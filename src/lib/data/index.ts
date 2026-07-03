'use server';
import 'server-only'
import {PawPrint} from "@/lib/types/pawPrint";
import {BSON, MongoClient, ObjectId, WithId} from "mongodb";
import "../../envConfig"
import {unstable_cache, updateTag} from "next/cache";
import {PRINTS_PER_PAGE} from "@/lib/constants";

let _mongo: MongoClient | undefined = undefined;

async function getCollection() {
    if (_mongo == undefined) {
        _mongo = new MongoClient(process.env.MONGO_URL!);
        await _mongo.connect();
    }
    const db = _mongo.db(process.env.MONGO_DB || "paws");
    return db.collection("prints");
}

function convert(response: WithId<BSON.Document>): PawPrint {
    return {
        id: response._id.toString(),
        heading: response["heading"],
        text: response["text"],
        date: response["date"],
        tags: response["tags"] || [],
        sources: response["sources"] || [],
        image: response["image"] || null,
        modifiedDate: response["modifiedDate"],
        bluesky: response["bluesky"] || null,
        mastodon: response["mastodon"] || null,
    }
}

export async function getPrintsCount() {
    const collection = await getCollection()
    return await collection.estimatedDocumentCount()
}

export async function insertOrUpdate(print: PawPrint) {
    const collection = await getCollection()
    let oid: ObjectId
    if (print.id) {
        // Update
        const { id, ...data } = print
        oid = new ObjectId(id)
        await collection.replaceOne({ _id: oid }, data)
    } else {
        // Insert
        const { id, ...data } = print
        void id;
        const result = await collection.insertOne(data)
        oid = result.insertedId
    }
    // Expire cache NOW!
    updateTag("prints")
    return await getPrint(oid.toString())
}

export async function deletePrint(id: string) {
    const collection = await getCollection()
    await collection.deleteOne({_id: new ObjectId(id)})
    updateTag("prints")
}

/**
 * Return a single paw print from the database.
 *
 * Invalidate the cache with the `prints` key.
 */
export const getPrint = unstable_cache(async (id: string): Promise<PawPrint|null> => {
    const collection = await getCollection()
    const result = await collection.findOne({_id: new ObjectId(id)})
    return result ? convert(result) : null;
}, undefined, {
    tags: ["prints"]
})

/**
 * Return paw prints form the database, by default the latest 10.
 *
 * The response is cached and will be invalidated after 500 seconds.
 * Invalidate the cache with the `prints` key.
 */
export const getPrints = unstable_cache(async (
    maxResults: number = PRINTS_PER_PAGE,
    pagination: number = 0,
    tags: string[] = [],
    byCreationDate: boolean = false,
): Promise<PawPrint[]> => {
    const collection = await getCollection()
    const query: Record<string, unknown> = {};
    if (tags.length > 0) {
        query["tags"] = {
            $in: tags
        }
    }
    let cursor = collection.find(query)
    if (byCreationDate) {
        // The object id starts with a timestamp
        // Hm... I wonder what will happen in 2038?
        cursor = cursor.sort({"_id": -1})
    } else {
        cursor = cursor.sort({"date": -1})
    }
    if (maxResults) {
        cursor = cursor.limit(maxResults).skip(pagination)
    }
    const responses = await cursor.toArray()
    return responses.map(convert);
}, undefined, {
    revalidate: 500,
    tags: ["prints"]
})

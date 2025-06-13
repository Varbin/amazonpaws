'use server';
import {PawPrint} from "@/types/pawPrint";
import {BSON, MongoClient, ObjectId, WithId} from "mongodb";
import "../../envConfig"
import {revalidateTag, unstable_cache, unstable_expireTag} from "next/cache";

const mongo = new MongoClient(process.env.MONGO_URL!);
await mongo.connect();
const db = mongo.db(process.env.MONGO_DB || "paws");
const collection = db.collection("prints");

function convert(response: WithId<BSON.Document>): PawPrint {
    return {
        id: response._id.toString(),
        heading: response["heading"],
        text: response["text"],
        date: response["date"],
        tags: response["tags"] || [],
        sources: response["sources"] || [],
        image: response["image"] || null
    }
}

export async function insertOrUpdate(print: PawPrint) {
    let oid: ObjectId
    if (print.id) {
        // Update
        const data: any = print
        oid = new ObjectId(print.id)
        delete data.id;
        await collection.replaceOne({_id: oid}, data);
    } else {
        // Insert
        const data: any = print
        delete data.id;
        const result = await collection.insertOne(data)
        oid = result.insertedId
    }
    // Expire cache NOW!
    unstable_expireTag("prints")
    return await getPrint(oid.toString())
}

export async function deletePrint(id: string) {
    await collection.deleteOne({_id: new ObjectId(id)})
    unstable_expireTag("prints")
}

/**
 * Return a single paw print from the database.
 *
 * Invalidate the cache with the `prints` key.
 */
export const getPrint = unstable_cache(async (id: string): Promise<PawPrint|null> => {
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
    maxResults: number = 10,
    pagination: number = 0,
    dateStart: string = "",
    tags: string[] = [],
): Promise<PawPrint[]> => {
    const query: any = {};
    if (dateStart) {
        query["date"] ={
                $lte: dateStart
        }
    }
    if (tags.length > 0) {
        query["tags"] = {
            $in: tags
        }
    }
    let cursor = collection.find(query).sort({"date": -1})
    if (maxResults) {
        cursor = cursor.limit(maxResults).skip(pagination)
    }
    const responses = await cursor.toArray()
    return responses.map(convert);
}, undefined, {
    revalidate: 500,
    tags: ["prints"]
})
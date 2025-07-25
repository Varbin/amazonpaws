'use server';
import 'server-only'
import {
    BucketAlreadyExists,
    CreateBucketCommand,
    DeleteObjectCommand, GetObjectCommand, ListBucketsCommand,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import {AwsCredentialIdentity} from "@smithy/types";
import {unstable_cache} from "next/cache";
import {URL} from 'node:url';
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {PawPrint} from "@/lib/types/pawPrint";
import {UPLOAD_TO_S3} from "@/lib/constants";

let _s3: S3Client | undefined = undefined;

/**
 * Get the s3 client as configured by env variables.
 */
function getS3Client(): S3Client {
    if (_s3 == undefined) {
        _s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY
            } as AwsCredentialIdentity,
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: process.env.S3_PATH_STYLE != undefined,
            region: process.env.S3_REGION
        })
    }
    return _s3
}

/**
 * Uploads a file to the S3 bucket as specified by env variables.
 *
 * @param {Buffer} buffer - The file content to upload as a buffer.
 * @param {string} key - The key (path/filename) under which the file will be stored in the S3 bucket.
 * @param {string|undefined} [contentType] - Optional MIME type of the file being uploaded.
 * @return {Promise<string>} A promise that resolves to the S3 URI of the uploaded file.
 */
export async function upload(buffer: Buffer, key: string, contentType: string|undefined = undefined): Promise<string> {
    const client = getS3Client()
    await client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType
    }))
    return `s3://${process.env.S3_BUCKET}/${key}`
}

/**
 * Returns bucket and key of an S3 URL.
 * @param url URL in the format s3://bucket/key
 */
function parseS3Url(url: string) {
    const parsed = URL.parse(url);
    if (parsed?.protocol != "s3:") {
        throw "Not an s3 URL"
    }
    return {
        Bucket: parsed.hostname,
        Key: parsed.pathname.substring(1)
    }
}

/**
 * Deletes an object from a bucket.
 * @param url URL in the format s3://bucket/key
 */
export async function deleteObject(url: string) {
    const client = getS3Client()
    await client.send(new DeleteObjectCommand(
        parseS3Url(url)
    ))
}

// One week is a common maximum.
const PRE_SIGNED_EXPIRATION = 60*60 * 24 * 7;

/**
 * Returns a pre-signed URL for public access of an object.
 * This function is cached for the validity of the URL
 */
export const getPreSignedUrl = unstable_cache(async function(url: string): Promise<string> {
    const client = getS3Client()
    const request = new GetObjectCommand(
        parseS3Url(url)
    )
    return await getSignedUrl(client, request, {
        expiresIn: PRE_SIGNED_EXPIRATION,
    })
}, undefined, {
    revalidate: PRE_SIGNED_EXPIRATION-3600,
})

/**
 * Replaces an s3://-URL of a PawPrint with a publicly reachable one.
 * @param print
 */
export async function preSignedPrint(print: PawPrint) {
    if (UPLOAD_TO_S3 && print.image?.src && print.image.src.startsWith("s3://")) {
        print.image.src = await getPreSignedUrl(print.image.src)
    }
    return print
}

/**
 * Replaces the s3://-URLs of PawPrints with publicly reachable ones.
 * @param prints
 */
export async function preSignedPrints(prints: PawPrint[]) {
    return await Promise.all(prints.map(preSignedPrint))
}

// Try to create the bucket if it does not exist yet.
if (UPLOAD_TO_S3) {
    const client = getS3Client()
    const response = await client.send(new ListBucketsCommand())
    if (response.Buckets?.find(b => b.Name == process.env.S3_BUCKET) == undefined) {
        try {
            await client.send(new CreateBucketCommand({
                Bucket: process.env.S3_BUCKET
            }))
        } catch (e: unknown) {
            if (e instanceof BucketAlreadyExists) {
                // ignore
            } else {
                throw e;
            }
        }
    }
}

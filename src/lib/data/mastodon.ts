'use server';

import 'server-only';
import {unstable_cache} from "next/cache";
import {getPreSignedUrl} from "@/lib/data/s3";
import {SocialMedia} from "@/lib/types/pawPrint";


async function callApi(call: string, parameters: string[][]|null = null, attachments: {[key: string]: Blob} = {}, method: string = "GET") : Promise<any> {
    const token = process.env.MASTODON_ACCESS_TOKEN!
    let instance = process.env.MASTODON_INSTANCE!
    if (instance.endsWith("/")) {
        instance = instance.substring(0, instance.length-1)
    }
    let body = null
    if (parameters != null) {
        body = new FormData()
        for (const [key, value] of parameters) {
            body.append(key, value)
        }
        for (const [key, value] of Object.entries(attachments)) {
            body.append(key, value)
        }
    }
    const response = await fetch(`${instance}/${call}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        method: method,
        body: body,
    })
    console.log(body)
    if (!response.ok) {
        console.error(`Cannot call ${call} @ ${method}`, await response.json())
        throw new Error(`Cannot connect to Mastodon: ${response.status} / ${response.statusText}`)
    }
    return await response.json()
}


export const getMastodonStatus = unstable_cache(async function()  : Promise<null|{ handle: string, url: string }> {
    if (!process.env.MASTODON_INSTANCE || !process.env.MASTODON_ACCESS_TOKEN) {
        return null
    }
    const call = await callApi("api/v1/accounts/verify_credentials")
    if (call.error) {
        throw new Error(call.error)
    }
    return {
        handle: call.acct,
        url: call.url
    }
}, undefined, {
    revalidate: 1,
})


export const getMastodonPostLimit = unstable_cache(async function()  : Promise<{max_characters: number, characters_reserved_per_url: number}> {
    const response = await callApi("api/v2/instance")

    return response.configuration.statuses
})


export async function postMastodonAttachment(url: string, alt: string): Promise<string|null> {
    // TODO: Find out how to make this work with REACT
    //const { Resvg } = await import('@resvg/resvg-js')

    if (url.startsWith("s3://")) {
        url = await getPreSignedUrl(url)
    }
    const blob = await (await fetch(url)).blob()
    // Mastodon does not support SVG
    if (blob.type == "image/svg+xml") {
        return null
    //    blob = new Blob([new Resvg(new Buffer(await blob.arrayBuffer())).render().asPng()], {type: "image/png"})
    }

    const response = await callApi("api/v2/media", [["description", alt]], {file: blob}, "POST")
    return response.id
}


export async function postMastodonStatus(
    id: string,
    heading: string,
    text: string,
    tags: string[] = [],
    postDate: string,
    attachtment: string|null = null,
    altText: string|null = null,
): Promise<SocialMedia> {
    const lengths = await getMastodonPostLimit()

    const url = "https://amazonpaws.com/print/" + id
    const tagsLine = tags.map(t => "#"+t.replaceAll(" ", "-")).join(" ")
    const tail = `\n\n${url}\n${tagsLine}`
    const tailLength = 2 + lengths.characters_reserved_per_url + 1 + tagsLine.length
    const left = lengths.max_characters - tailLength

    console.log("Allowed length: ", lengths.max_characters, "Tail length: ", tailLength, "Remaining:", left)

    if (text.length > left) {
        text = text.substring(0, left-1) + "…"
    }

    const data = [
        ["status", text + tail],
        ["spoiler_text", `${heading} (${postDate.substring(0, 10)})`],
        ["language", "en"],
        ["visibility", "direct"]
    ]

    if (attachtment) {
        const attachmentId = await postMastodonAttachment(attachtment, altText || "")
        if (attachmentId !== null) {
            data.push(["media_ids[]", attachmentId])
        }
    }
    const response = await callApi("api/v1/statuses", data, undefined, "POST")
    return {
        id: response.id,
        url: response.url,
        date: response.edited_at || response.created_at,
    }
}

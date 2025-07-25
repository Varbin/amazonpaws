import {Feed, Item} from "feed";
import {getPrints} from "@/lib/data/index";
import {preSignedPrints} from "@/lib/data/s3";
import {PawPrintDate} from "@/lib/types/pawPrint";

const PRINTS = 20;

export async function getFeed(): Promise<Feed> {
    const printsWithS3 = await getPrints(PRINTS, undefined, undefined, true);
    const prints = await preSignedPrints(printsWithS3);
    const feed = new Feed({
        title: "Amazon Paws",
        description: "The paw prints Amazon leaves on the world.",
        id: "https://amazonpaws.com/",
        link: "https://amazonpaws.com/",
        language: "en",
        updated: new Date(prints[0]["date"]),
        copyright: "Some rights reserved",
        generator: "https://github.com/jpmonette/feed",
        feedLinks: {
            "rss": "https://amazonpaws.com/feeds/rss",
            "atom": "https://amazonpaws.com/feeds/atom",
            "json": "https://amazonpaws.com/feeds/json",
        }
    })
    for (const print of prints) {
        const item: Item = {
            title: `${print.date}: ${print.heading}`,
            id: `https://amazonpaws.com/print/${print.id}`,
            link: `https://amazonpaws.com/print/${print.id}`,
            description: print.text,
            content: print.text,
            date: new Date(print.modifiedDate ?? PawPrintDate(print)),
            published: new Date(PawPrintDate(print))
        };
        if (print.image?.src) {
            item.image = {
                url: print.image.src.replaceAll("&", "&amp;"),
                title: print.image.caption || print.image.alt,
            };
            if (item.image.url.startsWith("data:")) {
                item.image.type = print.image.src.substring(5).split(';')[0]
                item.image.length = Buffer.from(item.image.url.split(',')[1], 'base64').length
            } else {
                try {
                    // Mhm. This could be done more efficiently, I guess.
                    const result = await fetch(print.image.src, {cache: 'force-cache'})
                    if (result.ok) {
                        item.image.type = result.headers.get('content-type')?.split(';')[0]
                        item.image.length = parseInt(result.headers.get('content-length') ?? '0')
                    }
                } catch (e) {
                    console.error("Failed to fetch image", print.image.src, e)
                }
            }
        }
        feed.addItem(item)
    }
    return feed;
}
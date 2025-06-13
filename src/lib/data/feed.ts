import { Feed } from "feed";
import {getPrints} from "@/lib/data/index";

export async function getFeed(): Promise<Feed> {
    const prints = await getPrints();
    const feed = new Feed({
        title: "Amazon Paws",
        description: "The paw prints Amazon leaves on the world.",
        id: "https://amazonpaws.com",
        language: "en",
        updated: new Date(prints[0]["date"]),
        copyright: "Some rights reserved",
        generator: "https://github.com/jakejarvis/next-rss",
        feedLinks: {}
    })
    prints.forEach(print => {
        feed.addItem({
            title: print.heading,
            id: print.id,
            link: `https://amazonpaws.com/print/${print.id}`,
            description: print.text,
            content: print.text,
            date: new Date(print.date),
        })
    })
    return feed;
}
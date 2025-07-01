import {getPrints, getPrintsCount} from "@/lib/data";
import type {MetadataRoute} from "next";
import {BASE_URL} from "@/lib/constants";
import {PawPrintDate} from "@/types/pawPrint";

const elementsPerPage = 50000

export async function generateSitemaps(): Promise<{id : number}[]> {
    // Fetch the total number of products and calculate the number of sitemaps needed
    let maps;
    try {
         maps = Math.ceil(await getPrintsCount() / elementsPerPage)
    } catch (e) {
        console.error("Failed to fetch number of paw prints. This is normal during build.", e)
        maps = 0;
    }
    const out = []
    for (let i = 0; i < maps; i++) {
        out.push({id: i})
    }
    return out
}

export default async function sitemap({ id }: {id : number}): Promise<MetadataRoute.Sitemap> {
    const prints = await getPrints(elementsPerPage, id*elementsPerPage)
    return prints.map(it => ({
        url: `${BASE_URL}/print/${it.id.toString()}`,
        lastModified: it.modifiedDate ?? PawPrintDate(it),
    }))
}
import {SITE_TITLE} from "@/lib/constants";
import {Metadata} from "next";
import {legalHtml} from "@/lib/data/legal";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: `Legal — ${SITE_TITLE}`,
    robots: "noindex, follow"
}

export default async function Page() {
    const legal = await legalHtml()

    return (
        <div className="frame">
            <h1>Legal</h1>
            <div dangerouslySetInnerHTML={{__html: legal}}></div>
        </div>
    )
}
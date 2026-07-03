import {getPrints} from "@/lib/data";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {isLoggedIn} from "@/lib/session";
import {redirect} from "next/navigation";
import {revalidate} from "@/app/edit/actions/revalidate";
import {deletePrintAction} from "@/app/edit/actions/deletePrintAction";
import Link from "next/link";
import {getMastodonStatus} from "@/lib/data/mastodon";
import {JSX} from "react";

async function mastodon(): Promise<JSX.Element|string> {
    let status
    try {
        status = await getMastodonStatus()
    } catch (e) {
        return "Error: " + (e as Error).message;
    }
    if (status === null) {
        return "Not logged in."
    }
    if (status instanceof Error) {
        return "Error: " + status.message
    }
    return <a href={status.url}>{status.handle}</a>
}

async function socialMediaStatus(): Promise<JSX.Element> {
    return <ul>
        <li>Mastodon: {await mastodon()}</li>
    </ul>
}

export default async function EditPage() {
    if (!await isLoggedIn()) {
        return redirect("/login")
    }
    const prints = await getPrints(0);
    const smStatus  = await socialMediaStatus()
    return <div className="frame">
        <h1>Edit</h1>
        <p>
            <Link href="/edit/new">New <FontAwesomeIcon icon={faPlusCircle}/></Link>
        </p>
        <h2>Social Media</h2>
        {smStatus}
        <h2>Cache</h2>
        <form action={revalidate}>
            <input type="submit" value="Revalidate Cache" />
        </form>
        <h2>Prints</h2>
        <ul style={{paddingLeft: "1em"}}>
            {prints.map(print => (
                <li key={print.id}><Link href={`/edit/${print.id}`}>{print.heading}</Link> ({print.date})
                <form action={deletePrintAction}>
                    <input type="hidden" name="id" value={print.id} />
                    <input type="submit" value="Delete" />
                </form>
                </li>
            ))}
        </ul>
    </div>
}
import {getPrints} from "@/lib/data";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {isLoggedIn} from "@/lib/session";
import {redirect} from "next/navigation";
import * as url from "node:url";
import {unstable_expireTag} from "next/cache";
import {revalidate} from "@/app/edit/actions/revalidate";
import {deletePrintAction} from "@/app/edit/actions/deletePrintAction";

export default async function EditPage() {
    if (!await isLoggedIn()) {
        return redirect("/login")
    }
    const prints = await getPrints(0);
    return <div className="frame">
        <h1>Edit</h1>
        <p>
            <a href="/edit/new">New <FontAwesomeIcon icon={faPlusCircle}/></a>
        </p>
        <h2>Cache</h2>
        <form action={revalidate}>
            <input type="submit" value="Revalidate Cache" />
        </form>
        <h2>Prints</h2>
        <ul style={{paddingLeft: "1em"}}>
            {prints.map(print => (
                <li key={print.id}><a href={`/edit/${print.id}`}>{print.heading}</a> ({print.date})
                <form action={deletePrintAction}>
                    <input type="hidden" name="id" value={print.id} />
                    <input type="submit" value="Delete" />
                </form>
                </li>
            ))}
        </ul>
    </div>
}
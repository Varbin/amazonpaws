import {PawPrint} from "@/lib/types/pawPrint";
import {shareBluesky} from "@/lib/share";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBluesky} from "@fortawesome/free-brands-svg-icons";

export default function ShareBluesky({print}: {print: PawPrint}) {
    'use client';
    const data: ShareData = {
        title: print.heading,
        text: print.text,
        url: "https://amazonpaws.com/print/" + print.id,
    }
    return (
        <a href="#" onClick={() => shareBluesky(data)}>
            <FontAwesomeIcon icon={faBluesky} title="Share on Bluesky" />
        </a>
    )
}
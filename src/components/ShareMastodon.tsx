import {PawPrint} from "@/lib/types/pawPrint";
import {share} from "@/lib/share";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMastodon} from "@fortawesome/free-brands-svg-icons";

export default function ShareMastodon({print}: {print: PawPrint}) {
    'use client';
    const data: ShareData = {
        title: print.heading,
        text: print.text,
        url: "https://amazonpaws.com/print/" + print.id,
    }
    return (
        <a href="#" onClick={() => share(data)}>
            <FontAwesomeIcon icon={faMastodon} title="Share on Mastodon" />
        </a>
    )
}
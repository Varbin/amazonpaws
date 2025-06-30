'use client';

import {PawPrint} from "@/types/pawPrint";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";
import {faBluesky, faMastodon} from "@fortawesome/free-brands-svg-icons";
import {share, shareBluesky} from "@/lib/share";

export function Share({print}: {print: PawPrint}) {
    'use client';
    const data: ShareData = {
        title: print.heading,
        text: print.text,
        url: "https://amazonpaws.com/print/" + print.id,
    }
    if (typeof window !== 'undefined' && navigator && navigator.share && navigator.canShare(data)) {
        return <a href="#" onClick={() => navigator.share(data)}>
            <FontAwesomeIcon icon={faShareAlt} title="Share" />
        </a>
    }
}


export function ShareMastodon({print}: {print: PawPrint}) {
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


export function ShareBluesky({print}: {print: PawPrint}) {
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
'use client';

import {PawPrint} from "@/lib/types/pawPrint";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";


export default function Share({print}: {print: PawPrint}) {
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

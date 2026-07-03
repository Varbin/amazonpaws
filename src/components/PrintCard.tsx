import {PawPrint, PawPrintDate} from "@/lib/types/pawPrint";
import styles from "./PrintCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
//import Share from "@/components/Share";
import ShareBluesky from "@/components/ShareBluesky";
import ShareMastodon from "@/components/ShareMastodon";
import dynamic from "next/dynamic";


type PawPrintProps = {
    print: PawPrint;
}

const Share = dynamic(() => import("./Share"), { ssr: false })

function figure(print: PawPrint) {
    if (print.image?.src) {
        return (
            <figure>
                <img src={print.image.src} alt={print.image.alt} style={{maxHeight: "200px", maxWidth: "100%"}} />
                <figcaption>{print.image.caption}</figcaption>
            </figure>
        )
    }
}

export default function PrintCard({ print }: PawPrintProps) {
    return (
        <article className={styles.card}>
            <div className={styles.dateAndShare}>
                <p className={styles.date}>Published <time>{PawPrintDate(print).substring(0, 10)}</time> / Event <time>{print.date}</time></p>
                <p className={styles.share} aria-label={"Share and link this story"} role={"group"}>
                    <Link href={`/print/${print.id}`}><FontAwesomeIcon icon={faLink} title="Permalink" /></Link>
                    <ShareBluesky print={print} />
                    <ShareMastodon print={print} />
                    <Share print={print} />
                </p>
            </div>
            <h2>{print.heading}</h2>
            {figure(print)}
            <p>{print.text}</p>
            <h3>Sources</h3>
            <ul className={styles.sources}>
                {print.sources.map((source, idx) => (
                    <li key={idx}><a href={source}>[Source {idx+1}]</a></li>
                ))}
            </ul>
            <h3>Categories</h3>
            <ul className={styles.tags}>
                {print.tags.map((tag, idx) => (
                    <li key={idx}><a href={`/tags/${tag}`}>#{tag}</a></li>
                ))}
            </ul>
        </article>
    )
}

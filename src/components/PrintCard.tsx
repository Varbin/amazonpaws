import { PawPrint } from "@/types/pawPrint";
import styles from "./PrintCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Share, ShareMastodon } from "@/components/Share";
import Link from "next/link";
import Image from "next/image";

type PawPrintProps = {
    print: PawPrint;
}

function figure(print: PawPrint) {
    if (print.image?.src) {
        return (
            <figure>
                <img src={print.image.src} alt={print.image.alt} width={200} height={200} />
                <figcaption>{print.image.caption}</figcaption>
            </figure>
        )
    }
}

export default function PrintCard({ print }: PawPrintProps) {
    return (
        <article className={styles.card}>
            <div className={styles.dateAndShare}>
                <p className={styles.date}>{print.date}</p>
                <p className={styles.share}>
                    <Link href={`/print/${print.id}`}><FontAwesomeIcon icon={faLink} title="Permalink" /></Link>
                    <Share print={print} />
                    <ShareMastodon print={print} />
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

import styles from "./PawTrack.module.css";
import {PawPrint} from "@/types/pawPrint";
import PrintCard from "./PrintCard";

type TimelineProps = {
    initialPrints: PawPrint[]
}

function leftOrRight(idx: number) {
    if (idx % 2 === 0) {
        return styles.left;
    } else {
        return styles.right;
    }
}

export default function PawTrack({ initialPrints }: TimelineProps) {
    return (
        <>
            <div className={styles.timeline}>
                {initialPrints.map((print, idx) => (
                    <article key={idx} className={`${styles.container} ${leftOrRight(idx)}`}>
                        <PrintCard key={print.id} print={print} />
                    </article>
                ))}
            </div>
            <div className={styles.continue} />
        </>
    )
}

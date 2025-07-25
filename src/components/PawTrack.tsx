"use client";
import styles from "./PawTrack.module.css";
import {PawPrint} from "@/lib/types/pawPrint";
import PrintCard from "./PrintCard";
import React, {useEffect, useState} from "react";
import {getPrints} from "@/lib/data";
import Image from "next/image";
import amazonpaws from "@/resources/images/amazonpaws_dark.svg"
import amazonpaws_animated from "@/resources/images/amazonpaws_dark_animated.svg"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useInView} from "react-intersection-observer";
import {PRINTS_PER_PAGE} from "@/lib/constants";
import {preSignedPrints} from "@/lib/data/s3";
import Link from "next/link";

type TimelineProps = {
    initialPrints: PawPrint[]
    children?: React.ReactNode;
}

function leftOrRight(idx: number) {
    if (idx % 2 === 0) {
        return styles.left;
    } else {
        return styles.right;
    }
}


function isFirst(idx: number) {
    if (idx === 0) {
        return styles.first;
    } else {
        return "";
    }
}


export function PawTrack({ initialPrints, children = [] }: TimelineProps) {
    return (
        <>
            <div className={styles.timeline}>
                {initialPrints.map((print, idx) => (
                    <div key={idx} className={`${styles.container} ${leftOrRight(idx)} ${isFirst(idx)}`}>
                        <PrintCard key={print.id} print={print} />
                    </div>
                ))}

                {children}
            </div>
        </>
    )
}

type FinalButtonProps = {
    className?: string
    onClick?: () => void
    loading?: boolean
    ref?: React.Ref<HTMLButtonElement>
    children?: React.ReactNode|React.ReactNode[]|string|string[]
}

export function FinalButton({className, onClick, loading, ref, children}: FinalButtonProps) {
    return (<button ref={ref} className={`${styles.button} ${className}`} onClick={onClick}>
        {children}&nbsp;
        {loading ? <FontAwesomeIcon icon={faSpinner} spin={true} /> : <></>}
    </button>)
}

type FinalLinkProps = {
    className?: string
    href: string
    onClick?: () => void
    loading?: boolean
    ref?: React.Ref<HTMLButtonElement>
    children?: React.ReactNode|React.ReactNode[]|string|string[]
}

export function FinalLink({className, href, loading, children, onClick}: FinalLinkProps) {
    return (<Link className={`${styles.button} ${className}`} href={href} onClick={onClick}>
        {children}&nbsp;
        {loading ? <FontAwesomeIcon icon={faSpinner} spin={true} /> : <></>}
    </Link>)
}

type InteractiveTimelineProps = {
    initialPrints: PawPrint[]
    tags?: string[]
}

export function InteractivePawTrack({ initialPrints, tags = [] }: InteractiveTimelineProps) {
    const [prints, setPrints] = useState(initialPrints);
    const [offset, setOffset] = useState(initialPrints.length);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [scrollTrigger, isInView] = useInView();

    async function loadMore() {
        setLoading(true);
        const more = await getPrints(PRINTS_PER_PAGE, offset, tags);
        const preSigned = await preSignedPrints(more);
        prints.push(...preSigned)
        setPrints(prints);
        setHasMore(more.length >= PRINTS_PER_PAGE);
        setOffset(prints.length);
        setLoading(false);
    }

    useEffect(() => {
        if (isInView && hasMore && !loading) {
            loadMore();
        }
    })

    return (
        <>
            <PawTrack initialPrints={initialPrints} />
            <Image className={styles.paws}
                   src={loading ? amazonpaws_animated : amazonpaws}
                   alt={loading
                       ? "Moving paws with an Amazon arrow."
                       : "Paws with an Amazon arrow."
                   }
                   height={60}
            />
            {hasMore
                ? <>
                    <FinalButton ref={scrollTrigger} onClick={loadMore}>
                        Load More
                    </FinalButton>
                </>
                : <>
                    <div className={styles.end}><p>You have reached the end!</p></div>
                </>
            }
        </>
    )
}

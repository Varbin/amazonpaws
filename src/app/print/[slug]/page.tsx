import {getPrint} from "@/lib/data";
import {notFound} from "next/navigation";
import PawTrack from "@/components/PawTrack";

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}) {
    const { slug } = await params;
    const print = await getPrint(slug);
    console.log(slug);
    if (!print) {
        return notFound()
    }
    return {
        title: "Amazon Paws",
        description: "The paw prints Amazon leaves on the world.",
    }
}

export default async function Page({
     params,
 }: {
    params: { slug: string }
}) {
    const { slug } = await params;
    const print = await getPrint(slug);
    if (!print) {
        return notFound()
    }
    return (
        <>
            <PawTrack initialPrints={[print]} />
            <a className="restart" href="/public">Load from beginning</a>
        </>
    )
}
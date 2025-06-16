import {getPrint} from "@/lib/data";
import {redirect} from "next/navigation";
import {Editor} from "@/app/edit/components/Editor";
import {getPreSignedUrl, preSignedPrint} from "@/lib/data/s3";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    let print = undefined;
    let presigned = undefined;
    if (slug !== 'new') {
        print = await getPrint(slug)
        if (!print) {
            return redirect("new")
        }
        if (print.image?.src?.startsWith("s3://")) {
            presigned = await getPreSignedUrl(print.image.src)
        }
    }
    return (
        <div className="frame">
            <h1>Edit</h1>
            <Editor print={print} preSignedUrl={presigned} />
        </div>
    )
}
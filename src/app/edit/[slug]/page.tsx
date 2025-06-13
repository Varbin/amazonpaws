import {getPrint} from "@/lib/data";
import {redirect} from "next/navigation";
import {Editor} from "@/app/edit/components/Editor";

export default async function Page({
                                       params,
                                   }: {
    params: { slug: string }
}) {
    let {slug} = await params;
    let print = undefined;
    if (slug !== 'new') {
        print = await getPrint(slug)
        if (!print) {
            return redirect("new")
        }
    }
    return (
        <div className="frame">
            <h1>Edit</h1>
            <Editor print={print} />
        </div>
    )
}
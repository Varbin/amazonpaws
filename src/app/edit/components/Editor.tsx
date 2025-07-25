'use client';
import {Image as PawImage, PawPrint, PawPrintDate} from "@/lib/types/pawPrint";
import styles from "../page.module.css";
import { useActionState } from "react";
import { editOrCreatePrint } from "@/app/edit/actions/editOrCreatePrint";

type EditorProps = {
    print: PawPrint | undefined;
    preSignedUrl?: string
};

function ImageEditor({ image }: { image: PawImage | null | undefined }) {
    return <>
        <label htmlFor={"src"}>Image (File or URL)</label>
        <input name="src" id={"src"} type="file" accept="image/*" />
        <input name="removeImage" id="removeImage" type="checkbox" />
        <label htmlFor={"removeImage"}>Remove Image</label>
        <label htmlFor={"caption"}>Caption</label>
        <input name="caption" id={"caption"} defaultValue={image?.caption ?? ""} />
        <label htmlFor={"alt"}>Alt-Text</label>
        <input name="alt" id={"alt"} defaultValue={image?.alt ?? ""} />
    </>
}

function Preview({ src }: { src: string | undefined }) {
    if (src) return <img src={src} alt="" style={{maxHeight: "200px", maxWidth: "100%"}} />
    return <></>
}

export function Editor({ print, preSignedUrl }: EditorProps) {
    const [state, action, pending] = useActionState(editOrCreatePrint, {pawPrint: print, preSignedUrl: preSignedUrl})
    const img = state.preSignedUrl ?? state.pawPrint?.image?.src ?? undefined;

    return <>
        <form className={styles.editor} action={action}>
            {pending && <p>Saving...</p>}
            {state.pawPrint?.id ? <input type="hidden" name="id" defaultValue={state.pawPrint.id} /> : <span/>}
            <div>
                <label htmlFor={"heading"}>Heading</label>
                <input name="heading" id={"heading"} defaultValue={state.pawPrint?.heading ?? ""} required={true} />
            </div>
            <div>
                <label htmlFor={"date"}>Date</label>
                <input name="date" type="date" id={"date"} defaultValue={state.pawPrint?.date ?? ""} required={true} />
            </div>
            <div>
                <label htmlFor={"postDate"}>Post Date</label>
                <input name="date" disabled={true} id={"postDate"} defaultValue={(state.pawPrint?.id ? PawPrintDate(state.pawPrint) : "-")} required={true} />
            </div>
            <div>
                <label htmlFor={"modifiedDate"}>Modified Date</label>
                <input name="date" disabled={true}  id={"modifiedDate"} defaultValue={state.pawPrint?.modifiedDate ?? "-"} required={true} />
            </div>
            <div>
                <label htmlFor={"text"}>Text</label>
                <textarea name="text" id={"text"} defaultValue={state.pawPrint?.text ?? ""} required={true} />
            </div>
            <div>
                <label htmlFor={"tags"}>Tags (Comma separated)</label>
                <input name="tags" id={"tags"} defaultValue={state.pawPrint?.tags.join(", ") ?? ""} required={true} />
            </div>
            <div>
                <label htmlFor={"sources"}>Sources (New-line separated)</label>
                <textarea name="sources" id={"tags"} defaultValue={state.pawPrint?.sources.join("\n") ?? ""} required={true} />
            </div>
            <div>
                <h3>Image</h3>
                <Preview src={img} />
                <ImageEditor image={state.pawPrint?.image} />
            </div>
            <input type="submit" value="Save" />
            {pending && <p>Saving...</p>}
            {state.error && <p>{state.error}</p>}
        </form>
    </>
}

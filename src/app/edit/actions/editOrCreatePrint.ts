'use server';

import {EditFormState} from "@/lib/types/editFormState";
import {isLoggedIn} from "@/lib/session";
import {Image, PawPrint} from "@/lib/types/pawPrint";
import {insertOrUpdate} from "@/lib/data";
import {redirect} from "next/navigation";
import {deleteObject, getPreSignedUrl, upload} from "@/lib/data/s3";
import path from "node:path";
import {randomBytes} from "node:crypto";
import {UPLOAD_TO_S3} from "@/lib/constants";

async function conditionalPresign(url: string|undefined): Promise<string|undefined> {
    if (url?.startsWith("s3://") && UPLOAD_TO_S3) {
        return await getPreSignedUrl(url)
    }
    return undefined
}

export async function editOrCreatePrint(state: EditFormState, formData: FormData): Promise<EditFormState> {
    if (!await isLoggedIn()) {
        state.error = "Log in expired."
        state.ok = false;
        return state;
    }

    const print: PawPrint = {
        id: state.pawPrint?.id || formData.get("id") as string,
        heading: formData.get("heading") as string,
        text: formData.get("text") as string,
        date: formData.get("date") as string,
        image: state.pawPrint?.image ?? null,
        sources: (formData.get("sources") as string).split("\n").map(s => s.trim()),
        tags: (formData.get("tags") as string).split(",").map(s => s.trim()),
        modifiedDate: new Date().toISOString(),  // Refresh modified data on every edit
    }
    if (formData.get("removeImage") === "on" || !(state.pawPrint?.image || formData.get("src"))) {
        const old = state.pawPrint?.image?.src
        if (old && old.startsWith("s3://")) {
            await deleteObject(old)
        }
        print.image = null;
    } else {
        let url = state.pawPrint?.image?.src;
        const file = formData.get("src") as File
        if (file && file.size) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const contentType = file.type;
            if (UPLOAD_TO_S3) {
                const ext = path.extname(file.name);
                const id = randomBytes(16).toString("hex")
                url = await upload(buffer, `${id}${ext}`, contentType);
            } else {
                const b64 = buffer.toString("base64");
                url = `data:${file.type};base64,${b64}`;
            }
        }
        print.image = {
            src: url,
            alt: formData.get("alt") as string,
            caption: formData.get("caption") as string,
        } as Image;
    }
    const needsRedirect = !print["id"];
    const result = await insertOrUpdate(print)
    if (result) {
        if (needsRedirect) {
            redirect("/edit/" + result.id)
        }
        return {
            pawPrint: result ?? undefined,
            preSignedUrl: await conditionalPresign(state?.pawPrint?.image?.src),
            ok: true,
        }
    } else {
        return {
            pawPrint: state?.pawPrint ?? undefined,
            preSignedUrl: await conditionalPresign(state?.pawPrint?.image?.src),
            error: "Error saving."
        }
    }
}

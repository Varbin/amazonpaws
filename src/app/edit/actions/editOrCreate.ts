'use server';

import {EditFormState} from "@/types/editFormState";
import {isLoggedIn} from "@/lib/session";
import {Image, PawPrint} from "@/types/pawPrint";
import {insertOrUpdate} from "@/lib/data";
import {redirect} from "next/navigation";

export async function editOrCreate(state: EditFormState, formData: FormData): Promise<EditFormState> {
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
    }
    if (formData.get("removeImage") === "on" || !(state.pawPrint?.image || formData.get("src"))) {
        console.log("Removing image");
        print.image = null;
    } else {
        let url = state.pawPrint?.image?.src;
        const file = formData.get("src") as File
        if (file && file.size) {
            const b64 = Buffer.from(await file.bytes()).toString("base64");
            url = `data:${file.type};base64,${b64}`;
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
            ok: true,
        }
    } else {
        return {
            pawPrint: result ?? undefined,
            error: "Error saving."
        }
    }
}

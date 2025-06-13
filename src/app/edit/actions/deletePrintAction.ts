'use server';

import {isLoggedIn} from "@/lib/session";
import {deletePrint} from "@/lib/data";
import {redirect} from "next/navigation";

export async function deletePrintAction(formData: FormData) {
    if (!await isLoggedIn()) {
        redirect("/login")
    }
    await deletePrint(formData.get("id") as string)
    redirect("/edit")
}

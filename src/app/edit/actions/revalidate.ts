'use server'
import {redirect} from "next/navigation";
import {isLoggedIn} from "@/lib/session";
import {updateTag} from "next/cache";

export async function revalidate() {
    if (!(await isLoggedIn())) {
        return redirect('/login')
    }
    updateTag("prints");
    return redirect("/edit")
}

'use server'
import {redirect} from "next/navigation";
import {isLoggedIn} from "@/lib/session";
import {unstable_expireTag} from "next/cache";

export async function revalidate(formData: FormData) {
    if (!(await isLoggedIn())) {
        return redirect('/login')
    }
    unstable_expireTag("prints");
    return redirect("/edit")
}

'use server';

import {LoginFormState} from "@/types/loginFormState";
import {createSession} from "@/lib/session";
import {redirect} from "next/navigation";

function validateKey(key: string) {
    if (!process.env.AUTH_KEY) {
        return false;
    }
    return key === process.env.AUTH_KEY;
}

export async function authenticate(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const key = formData.get('key') as string;
    if (!validateKey(key)) {
        return {error: "Invalid key."}
    }
    await createSession(true)
    redirect('/edit');
}
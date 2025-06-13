'use client';
import styles from "./page.module.css";
import {authenticate} from "@/app/login/actions/auth";
import {useActionState} from "react";

export default function LoginPage() {
    const [state, action, pending] = useActionState(authenticate, undefined)
    return (
    <div className="frame">
        <h1>Authentication</h1>
        <form className={styles.auth} action={action}>
            <div>
                <label>Authentication key:</label>
                <input id="key" name="key" placeholder="*****" type="password" />
            </div>
            <div>
                <input type="submit" value="Log-in" />
                {state?.error && <p>{state.error}</p>}
            </div>
        </form>
    </div>
    )
}
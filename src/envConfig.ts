import {loadEnvConfig} from "@next/env";
import {randomBytes} from "node:crypto";

loadEnvConfig(process.cwd())
// This might create short term sessions, but protects from arbitrary session writes.
if (!process.env.SECRET_KEY) {
    console.log("Generating secret key")
    process.env.SECRET_KEY = randomBytes(16).toString(
        "hex"
    )
    console.log(process.env.SECRET_KEY)
}
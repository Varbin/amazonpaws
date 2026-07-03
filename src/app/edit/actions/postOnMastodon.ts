'use server';

import {PawPrint, SocialMedia} from "@/lib/types/pawPrint";
import {postMastodonStatus} from "@/lib/data/mastodon";
import {PostState} from "@/lib/types/postState";
import {isLoggedIn} from "@/lib/session";
import {insertOrUpdate} from "@/lib/data";

export async function postOnMastodon(pawPrint: PawPrint): Promise<PostState> {
    if (!await isLoggedIn()) {
        return {
            error: "Log in expired.",
            ok: false,
        }
    }

    // We ignore remove for now.
    let result!: SocialMedia;
    try {
        result = await postMastodonStatus(pawPrint.id, pawPrint.heading, pawPrint.text, pawPrint.tags, pawPrint.image?.src, pawPrint.image?.alt)
    } catch (e) {
        return {
            pawPrint: pawPrint,
            error: (e as Error).message,
            ok: false,
        }
    }

    pawPrint.mastodon = result;
    const ret = await insertOrUpdate(pawPrint)
    if (ret == null) {
        return {
            pawPrint: pawPrint,
            error: "Error saving, but post was successfull.",
            ok: false,
        }
    }
    return {
        pawPrint: ret,
        ok: true,
    }
}
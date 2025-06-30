import {BSKY_ACCOUNT} from "@/lib/constants";

export function share(data: ShareData) {
    const userMastodon = window.prompt("Please enter your Mastodon instance or handle:", localStorage.getItem("mastodon") ?? "");
    if (!userMastodon) return;
    let mastodonUrl: string
    if (userMastodon.startsWith("https://") || userMastodon.startsWith("http://")) {
        mastodonUrl = new URL(userMastodon).protocol + "//" + new URL(userMastodon).host
    } else {
        if (userMastodon.startsWith("@")) {
            mastodonUrl = "https://" + userMastodon.split("@", 3)[2];
        } else if (userMastodon.includes("@")) {
            mastodonUrl = "https://" + userMastodon.split("@", 2)[1];
        } else {
            mastodonUrl = "https://"+userMastodon;
        }
        mastodonUrl = "https://" + new URL(mastodonUrl).hostname;
    }
    localStorage.setItem("mastodon", mastodonUrl);
    const url = new URL(mastodonUrl);
    url.pathname = "/share";
    const params: Record<string, string> = {}
    if (data.title) {
        params["title"] = data.title;
    }
    if (data.text) {
        let text = data.text;
        if (data.title) {
            text = "\n\n"+text;
        }
        params["text"] = text;
    }
    if (data.url) {
        let url = data.url;
        if (data.text || data.title) {
            url = "\n\n"+url;
        }
        params["url"] = url;
    }
    url.search = (new URLSearchParams(params)).toString()
    window.open(url.toString(), "_blank");
}


export function shareBluesky(data: ShareData) {
    const url = new URL("https://bsky.app/intent/compose");
    const params: Record<string, string> = {}
    params["text"] = `${data.title}: ${data.text}\n\n${data.url} by ${BSKY_ACCOUNT}`
    url.search = (new URLSearchParams(params)).toString()
    window.open(url.toString(), "_blank");
}

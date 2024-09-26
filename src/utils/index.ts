export function setEmojiSize(str: string): string {
    const emojiRegex: RegExp = new RegExp(/[\uD800-\uDBFF]|[\u2702-\u27B0]|[\uF680-\uF6C0]|[\u24C2-\uF251]/g);
    const matchedEmojis = str.match(emojiRegex);

    if (matchedEmojis !== null && matchedEmojis.length > 0 && matchedEmojis.join('') === str) {
        const length = matchedEmojis.length;
        if (length <= 2) return "4em";
        if (length <= 4) return "3em";
        if (length <= 8) return "2em";
    }
    return "1em";
}

export function truncate(str: string | null, max = 40) {
    if (str === null) return null;
    return str.substring(0, max) + (str.length > 40 ? "..." : "")
}
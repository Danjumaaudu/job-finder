import rssParser from "rss-parser";

export async function FetchWWR() {
    const parser = new rssParser();
    const feed = await parser.parseURL(
        "https://weworkremotely.com/categories/remote-programming-jobs.rss"
    );
    return feed.items.map((item)=>( {
        id: `wwr-${item.link}`,
        company: item.creator || "unknown",
        position: item.title,
        link: item.link,
        source: "WeWorkRemotely",
    }));
}
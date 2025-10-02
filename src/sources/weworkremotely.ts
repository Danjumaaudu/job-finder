import rssParser from "rss-parser";

export async function FetchWWR() {
  const parser = new rssParser();
  const feed = await parser.parseURL(
    "https://weworkremotely.com/categories/remote-programming-jobs.rss"
  );
  //console.log("WWR feed items:", feed.items.length); // 👀 log how many jobs
  return feed.items.map((item) => ({
    id: `wwr-${item.link}`,
    company: item.creator || "WeWorkRemotely",
    title: item.title || "Untitled Job",
    link: item.link,
    source: "WeWorkRemotely",
  }));
}

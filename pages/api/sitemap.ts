import { domain } from "../../utils";
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const { Client } = require("@notionhq/client");

export default async function GetSitemap(req, res) {
  // Get slug from CardsInfo
  var links = [];
  links.push({ url: `/`, changefreq: "daily", priority: 0.8 });
  links.push({ url: `/get-started`, changefreq: "daily", priority: 0.8 });
  links.push({ url: `/updates`, changefreq: "daily", priority: 0.8 });

  // const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });
  // const blogResponse = await notion.databases.query({
  //   database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
  // });
  // blogResponse.results.map((result) => {
  //   // params: { blogslug: result['properties']['Slug']['formula']['string'] },
  //   links.push({
  //     url: `/blog/${result["properties"]["Slug"]["formula"]["string"]}`,
  //     changefreq: "daily",
  //     priority: 0.7,
  //   });
  // });

  // const helpResponse = await notion.databases.query({
  //   database_id: process.env.NEXT_PUBLIC_NOTION_HELP_DATABASE_ID,
  // });
  // helpResponse.results.map((result) => {
  //   // params: { blogslug: result['properties']['Slug']['formula']['string'] },
  //   links.push({
  //     url: `/help/${result["properties"]["Slug"]["formula"]["string"]}`,
  //     changefreq: "daily",
  //     priority: 0.7,
  //   });
  // });
  // links.push({ url: `/queries`, changefreq: "daily", priority: 0.8 });

  // const posts = await getPosts();
  // console.log(`posts:`, posts);

  // add slugs from posts to links
  // posts.map((post) => {
  //   links.push({
  //     url: `/community/${post.slug}`,
  //     changefreq: "daily",
  //     priority: 0.7,
  //   });
  // });

  for (let index = 0; index < links.length; index++) {
    console.log(domain + links[index].url);
  }

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: domain }); //`https://${req.headers.host}`

  res.writeHead(200, {
    "Content-Type": "application/xml",
  });

  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());

  res.end(xmlString);
}

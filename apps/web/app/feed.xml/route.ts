import { getAllArticles } from "@/lib/content";

export async function GET() {
  const baseUrl = "https://frontendexpert.com";

  try {
    const articles = await getAllArticles();

    const itemsXml = articles
      .map((article) => {
        let pubDate = new Date().toUTCString();
        const parsed = new Date(article.publishedAt);
        if (!isNaN(parsed.getTime())) {
          pubDate = parsed.toUTCString();
        }

        const link = `${baseUrl}/blog/${article.slug}`;
        const tagsXml = article.tags
          .map((t) => `<category><![CDATA[${t}]]></category>`)
          .join("");

        return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <category><![CDATA[${article.category}]]></category>
      ${tagsXml}
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/"><![CDATA[${article.author.name}]]></dc:creator>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Frontend Expert</title>
    <link>${baseUrl}/blog</link>
    <description>Master modern web development, React 19, CSS architecture, and Core Web Vitals performance benchmarks.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=18000",
      },
    });
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

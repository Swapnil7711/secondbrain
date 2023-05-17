import Head from "next/head";
import React from "react";
import { domain } from "../../utils";

function PageSeo({
  title,
  description,
  slug,
  ogimage,
}: {
  title: string;
  description: string;
  slug: string;
  ogimage?: string;
}) {
  var ogImageWF = ogimage
    ? ogimage
    : `${domain}/assets/secondbrain-open-graph-image.jpg`;
  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <link rel="icon" href="/assets/logo.svg" />
      <meta name="description" content={description} />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${domain}${slug}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImageWF && <meta property="og:image" content={ogImageWF} />}

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${domain}${slug}`} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImageWF && <meta property="twitter:image" content={ogImageWF} />}

      {/* <!-- Search Console --> */}
      <link rel="canonical" href={`${domain}${slug}`} />
      <link rel="shortcut icon" type="image/jpg" href="/assets/logo.svg" />
      <script async src="https://tally.so/widgets/embed.js"></script>
      <script async src="https://script.secondbrain.fyi/js/widget-raw.min.js" id="4ebe74cb-c878-493b-ad5e-a0cd7a2be7d8"></script>
      Close
    </Head>
  );
}

export default PageSeo;

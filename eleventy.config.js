export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon-16.png");
  eleventyConfig.addPassthroughCopy("favicon-32.png");
  eleventyConfig.addPassthroughCopy("favicon-192.png");
  eleventyConfig.addPassthroughCopy("favicon-512.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  eleventyConfig.addCollection("campaigns", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/campaigns/*.md").sort((a, b) => a.data.number - b.data.number);
  });

  eleventyConfig.addCollection("dispatches", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/dispatches/**/*.md")
      .sort((a, b) => {
        if (a.data.campaign === b.data.campaign) return a.data.order - b.data.order;
        return 0;
      });
  });

  eleventyConfig.addFilter("dispatchesForCampaign", (dispatches, campaignSlug) => {
    return dispatches
      .filter((d) => d.data.campaign === campaignSlug)
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addFilter("findCampaign", (campaigns, campaignSlug) => {
    return campaigns.find((c) => c.data.slug === campaignSlug);
  });

  eleventyConfig.addFilter("title", (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  });

  eleventyConfig.addFilter("roman", (n) => {
    const map = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let num = n;
    let roman = "";
    for (const [letter, value] of Object.entries(map)) {
      while (num >= value) {
        roman += letter;
        num -= value;
      }
    }
    return roman;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk"],
  };
}

export default function sitemap() {
  const baseUrl = "https://analysis.tradeonair.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}


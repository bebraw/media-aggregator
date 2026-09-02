import { type NewsSource } from "./load-headlines";

export const newsSources: readonly NewsSource[] = [
  {
    id: "bbc-world",
    name: "BBC News",
    region: "Europe",
    language: "English",
    languageCode: "EN",
    translationCode: "en",
    feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    articleHosts: ["www.bbc.co.uk", "www.bbc.com"],
  },
  {
    id: "france24-fr",
    name: "France 24",
    region: "Europe",
    language: "French",
    languageCode: "FR",
    translationCode: "fr",
    feedUrl: "https://www.france24.com/fr/rss",
    articleHosts: ["www.france24.com"],
  },
  {
    id: "nhk-japan",
    name: "NHK News",
    region: "East Asia",
    language: "Japanese",
    languageCode: "JA",
    translationCode: "ja",
    feedUrl: "https://www3.nhk.or.jp/rss/news/cat0.xml",
    articleHosts: ["www3.nhk.or.jp"],
  },
] as const;

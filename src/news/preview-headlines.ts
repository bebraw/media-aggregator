export const headlineRegions = [
  { slug: "all", label: "All regions" },
  { slug: "africa", label: "Africa" },
  { slug: "americas", label: "Americas" },
  { slug: "east-asia", label: "East Asia" },
  { slug: "europe", label: "Europe" },
  { slug: "middle-east", label: "Middle East" },
  { slug: "south-asia", label: "South Asia" },
] as const;

export type RegionFilter = (typeof headlineRegions)[number]["slug"];

export interface Headline {
  id: string;
  source: string;
  region: Exclude<(typeof headlineRegions)[number]["label"], "All regions">;
  language: string;
  languageCode: string;
  publishedLabel: string;
  translatedHeadline: string;
  originalHeadline: string;
  url: string;
}

export const previewHeadlines: readonly Headline[] = [
  {
    id: "metro-east-transit",
    source: "Metro East",
    region: "East Asia",
    language: "Japanese",
    languageCode: "JA",
    publishedLabel: "08:40 UTC",
    translatedHeadline: "Cities announce a new regional transit plan",
    originalHeadline: "都市交通の新計画を発表",
    url: "https://example.com/preview/metro-east-transit",
  },
  {
    id: "civic-dispatch-energy",
    source: "Civic Dispatch",
    region: "Europe",
    language: "English",
    languageCode: "EN",
    publishedLabel: "08:12 UTC",
    translatedHeadline: "Energy ministers set a date for the next grid review",
    originalHeadline: "Energy ministers set a date for the next grid review",
    url: "https://example.com/preview/civic-dispatch-energy",
  },
  {
    id: "atlas-water",
    source: "Atlas Bulletin",
    region: "Middle East",
    language: "Arabic",
    languageCode: "AR",
    publishedLabel: "07:55 UTC",
    translatedHeadline: "Regional cities agree on a shared water-monitoring program",
    originalHeadline: "مدن إقليمية تتفق على برنامج مشترك لمراقبة المياه",
    url: "https://example.com/preview/atlas-water",
  },
  {
    id: "coastline-harvest",
    source: "Coastline Report",
    region: "Africa",
    language: "French",
    languageCode: "FR",
    publishedLabel: "07:31 UTC",
    translatedHeadline: "Farm cooperatives publish their early harvest outlook",
    originalHeadline: "Les coopératives agricoles publient leurs premières prévisions de récolte",
    url: "https://example.com/preview/coastline-harvest",
  },
  {
    id: "sur-housing",
    source: "Sur Actual",
    region: "Americas",
    language: "Spanish",
    languageCode: "ES",
    publishedLabel: "06:58 UTC",
    translatedHeadline: "Mayors present a joint urban housing proposal",
    originalHeadline: "Alcaldes presentan una propuesta conjunta de vivienda urbana",
    url: "https://example.com/preview/sur-housing",
  },
  {
    id: "monsoon-health",
    source: "Monsoon Desk",
    region: "South Asia",
    language: "Hindi",
    languageCode: "HI",
    publishedLabel: "06:22 UTC",
    translatedHeadline: "Public hospitals expand a regional heat-response network",
    originalHeadline: "सार्वजनिक अस्पताल क्षेत्रीय गर्मी प्रतिक्रिया नेटवर्क का विस्तार करते हैं",
    url: "https://example.com/preview/monsoon-health",
  },
];

export function parseRegionFilter(value: string | null): RegionFilter {
  return headlineRegions.some((region) => region.slug === value) ? (value as RegionFilter) : "all";
}

export function selectPreviewHeadlines(region: RegionFilter): readonly Headline[] {
  if (region === "all") {
    return previewHeadlines;
  }

  const selectedRegion = headlineRegions.find((candidate) => candidate.slug === region);
  return previewHeadlines.filter((headline) => headline.region === selectedRegion?.label);
}

/**
 * report.types.ts — Kontrak tipe data antara pipeline Python dan aplikasi.
 */

export type Meta = {
  generated: string;
  scope: string;
  basis: string;
  sources: { key: string; label: string }[];
  pricingPolicy: string;
};

export type PriceStats = {
  n: number;
  min: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  max: number;
  mean: number;
};

export type Bucket = {
  label: string;
  count: number;
  pct: number;
};

export type SourceStats = {
  key: string;
  label: string;
  n: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
};

export type SegmentStats = {
  key: string;
  label: string;
  n: number;
  share: number;
  p25: number;
  median: number;
  p75: number;
  p25Tanpa: number;
  medianTanpa: number;
  p75Tanpa: number;
  deltaMedian: number;
  deltaP75: number;
};

export type ExampleItem = {
  name: string;
  price: number;
};

export type ExampleSet = {
  category: string;
  key: string;
  items: ExampleItem[];
};

export type ToolListing = {
  p: number;
  t: string[];
  s: string;
};

export type MarketData = {
  rawItems: number;
  listingsUnique: number;
  listingsPriced: number;
  excludedNoise: number;
  excludedBait: number;
  excludedCap: number;
  baitThreshold: number;
  stats: PriceStats;
  buckets: Bucket[];
  bySource: SourceStats[];
  segments: SegmentStats[];
  examples: ExampleSet[];
};

export type SoftwareHouse = {
  name: string;
  location: string;
  established: number;
  services: string;
  techStack: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  typicalClient: string;
  strengths: string;
};

export type MarketingAddon = {
  category: string;
  name: string;
  rate: string;
  deliverables: string;
};

export type MetaAdsAnalysis = {
  totalAdsSampled: number;
  platforms: string[];
  topCtas: { label: string; count: number }[];
  adHookTypes: {
    tier: string;
    priceRange: string;
    hookAngle: string;
    ctaDestination: string;
    example: string;
  }[];
  tiktokFunnelStrategy: {
    format: string;
    requirement: string;
    techStack: string;
  };
};

export type KeywordTrend = {
  keyword: string;
  monthlyVolume: number;
  cpcEstimasi: number;
  intent: string;
  competition: string;
  growthPct: number;
};

export type SeasonalityPoint = {
  period: string;
  index: number;
  reason: string;
};

export type AcquisitionChannel = {
  channel: string;
  leadQuality: string;
  cacEstimate: string;
  salesCycle: string;
  averageDealSize: string;
  recommendation: string;
};

export type TechStackTrend = {
  name: string;
  adoptionPct: number;
  useCase: string;
  clientPerception: string;
};

export type SearchIntelligence = {
  totalMonthlyVolumeJabodetabek: number;
  averageCpc: number;
  keywords: KeywordTrend[];
  seasonality: SeasonalityPoint[];
  channels: AcquisitionChannel[];
  techStackTrends: TechStackTrend[];
};

export type Report = {
  meta: Meta;
  softwareHouses: SoftwareHouse[];
  marketingAddons: MarketingAddon[];
  metaAdsAnalysis: MetaAdsAnalysis;
  searchIntelligence: SearchIntelligence;
  market: MarketData;
  listings: ToolListing[];
  legend: Record<string, string>;
};

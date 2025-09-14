import type { Document } from "@contentful/rich-text-types";

export type CmsBrand = {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
};

export type CmsWhatYouNeedCard = {
  title: string;
  imageUrl?: string;
  order?: number;
};

export type CmsHome = {
  whatWeDoBestText?: Document;
  brands: CmsBrand[];
  whatYouNeedCards: CmsWhatYouNeedCard[];
};

export type CmsProjectSummary = {
  slug: string;
  title: string;
  subtitle: string;
  dateISO: string;
  coverImageUrl?: string;
};

export type CmsProjectsPage = {
  ourWorkSubtext?: Document;
  featured: CmsProjectSummary[];
  all: CmsProjectSummary[];
};

export type CmsProjectDetail = {
  slug: string;
  title: string;
  subtitle: string;
  dateISO: string;
  coverImageUrl?: string;
  secondImageUrl?: string;
  firstTextTitle: string;
  firstTextBody?: Document;
  quoteImageUrl?: string;
  quote: string;
  secondTextTitle: string;
  secondTextBody?: Document;
};

export type CmsAboutPage = {
  ourStoryText?: Document;
  ourStoryImageUrl?: string;
};

export type CmsServiceItem = {
  title: string;
  description: string;
  features: string[];
  serviceMediaUrl?: string;
  order: number;
  alternateLayout?: boolean;
};

export type CmsServicesPage = {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImageUrl?: string;
  services: CmsServiceItem[];
};



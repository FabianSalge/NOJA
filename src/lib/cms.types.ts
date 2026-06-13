import type { Document } from "@contentful/rich-text-types";

export type CmsBrand = {
  name: string;
  logoUrl?: string;
};

export type CmsWhatYouNeedCard = {
  title: string;
  imageUrl?: string;
  order?: number;
};

export type CmsHome = {
  heroTitle?: string;
  pulseEffectTitle?: string;
  whatWeDoBestText?: Document;
  servicesSectionTitle?: string;
  servicesSectionSubtitle?: string;
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
  pageTitle?: string;
  pageSubtitle?: string;
  moreWorkTitle?: string;
  allProjectsTitle?: string;
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
  videoUrl?: string;
};

export type CmsAboutValue = {
  title: string;
  description: string;
  icon: "eye" | "lightbulb" | "users";
  order?: number;
};

export type CmsTeamMember = {
  name: string;
  role: string;
  description?: string;
  funFact?: string;
  photoUrl?: string;
  videoUrl?: string;
  order?: number;
};

export type CmsAboutPage = {
  aboutEyebrow?: string;
  aboutHeading?: string;
  valuesTitle?: string;
  teamTitle?: string;
  ourStoryText?: Document;
  ourStoryImageUrl?: string;
  values: CmsAboutValue[];
  team: CmsTeamMember[];
  inActionImageUrls: string[];
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



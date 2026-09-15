import type { Language } from '@/i18n';
import type { CmsServiceItem } from '@/lib/cms.types';

/** Slide 6–7 copy prepared for review and subsequent CMS entry updates. */
const categories = {
  en: [
    {
      title: 'Brand & Design',
      subtitle: 'The stuff you own forever.',
      description:
        'Who you are, what that looks like, and every surface it has to hold up on — from the logo to the website to the box it ships in. Built so your team can apply it without calling us.',
      features: [
        'Brand Strategy & Positioning',
        'Visual Identity & Logo Design',
        'Brand Guidelines',
        'Graphic Design, Social Media Templates & Assets',
        'Web Design',
        'Print Design (Flyers, Posters & Packaging)',
        'Presentations & Pitch Decks',
      ],
    },
    {
      title: 'Film & Photo',
      subtitle: 'The stuff we shoot for you.',
      description:
        'Concept, crew, shoot day, edit. One team from the first moodboard to the final export, which is why nothing gets lost between the shoot and the cut — and why festival content goes out while the event is still running.',
      features: [
        'Creative Direction',
        'Video Production',
        'Photography',
        'Brand Films, Image Films & Commercials',
        'Event & Festival Content',
        'Post-Production',
      ],
    },
    {
      title: 'Content & Campaigns',
      subtitle: 'The stuff that keeps running.',
      description:
        'Campaign concepts, content calendars, channel management, and multi-day event coverage with same-day turnaround.',
      features: [
        'Campaign Concepts',
        'Content Strategy',
        'Content Production',
        'Social Media Management',
        'Community Management',
        'Performance & Reporting',
      ],
    },
  ],
  de: [
    {
      title: 'Brand & Design',
      subtitle: 'Alles, was deiner Marke bleibt.',
      description:
        'Wer du bist, wie das aussieht und wo deine Marke sichtbar wird — vom Logo über die Website bis zur Verpackung. So gestaltet, dass dein Team damit selbstständig arbeiten kann.',
      features: [
        'Markenstrategie & Positionierung',
        'Visuelle Identität & Logodesign',
        'Brand Guidelines',
        'Grafikdesign & Social-Media-Vorlagen',
        'Webdesign',
        'Printdesign & Verpackungen',
        'Präsentationen & Pitch Decks',
      ],
    },
    {
      title: 'Film & Photo',
      subtitle: 'Alles, was wir für dich einfangen.',
      description:
        'Konzept, Crew, Drehtag, Schnitt. Ein Team vom ersten Moodboard bis zum finalen Export. So geht zwischen Dreh und Schnitt nichts verloren — und Festival-Content geht online, während das Event noch läuft.',
      features: [
        'Kreative Direktion',
        'Videoproduktion',
        'Fotografie',
        'Brandfilms, Imagefilme & Werbespots',
        'Event- & Festival-Content',
        'Postproduktion',
      ],
    },
    {
      title: 'Content & Campaigns',
      subtitle: 'Alles, was deine Marke in Bewegung hält.',
      description:
        'Kampagnenkonzepte, Content-Kalender, Kanalbetreuung und die Begleitung mehrtägiger Events — mit Content, der noch am selben Tag online geht.',
      features: [
        'Kampagnenkonzepte',
        'Content-Strategie',
        'Content-Produktion',
        'Social-Media-Management',
        'Community-Management',
        'Performance & Reporting',
      ],
    },
  ],
} satisfies Record<Language, Omit<CmsServiceItem, 'order'>[]>;

export function feedbackServices(
  language: Language,
  existing: CmsServiceItem[] = [],
): CmsServiceItem[] {
  const mediaIndices = [0, 1, 3];
  return categories[language].map((category, index) => ({
    ...category,
    order: index + 1,
    alternateLayout: index % 2 === 0,
    serviceMediaUrl: existing[mediaIndices[index]]?.serviceMediaUrl,
  }));
}

export const feedbackServicesSubtitle = {
  en: 'Built to work alone. Better together.',
  de: 'Einzeln stark. Zusammen noch besser.',
};

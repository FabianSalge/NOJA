import type { Language } from '@/i18n';
import type { CmsServiceItem } from '@/lib/cms.types';

/** Slide 6 additions are standalone sections, alongside the slide 7 categories. */
const additions = {
  en: [
    {
      title: 'Brand & Identity',
      description:
        'Design paired with strategy — so the visuals remain timeless.',
      features: [
        'Brand Strategy & Positioning',
        'Visual Identity & Logo Design',
        'Brand Guidelines',
      ],
    },
    {
      title: 'Graphic Design',
      description: 'Different formats, same standard: social, print, decks.',
      features: [
        'Social Media Templates & Assets',
        'Print Design (Flyers, Posters, Packaging)',
        'Presentations & Pitch Decks',
      ],
    },
  ],
  de: [
    {
      title: 'Marke & Identität',
      description:
        'Design trifft Strategie — damit die Gestaltung zeitlos bleibt.',
      features: [
        'Markenstrategie & Positionierung',
        'Visuelle Identität & Logodesign',
        'Brand Guidelines',
      ],
    },
    {
      title: 'Grafikdesign',
      description:
        'Verschiedene Formate, derselbe Anspruch: Social Media, Print, Präsentationen.',
      features: [
        'Social-Media-Vorlagen & Assets',
        'Printdesign (Flyer, Poster, Verpackungen)',
        'Präsentationen & Pitch Decks',
      ],
    },
  ],
} satisfies Record<Language, Omit<CmsServiceItem, 'order'>[]>;

export function additionalServices(language: Language): CmsServiceItem[] {
  return additions[language].map((service, index) => ({
    ...service,
    order: index + 4,
    alternateLayout: index % 2 !== 0,
  }));
}

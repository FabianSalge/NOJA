// scripts/cma/lib/i18n-data.mjs
// Plain-text -> Contentful rich-text Document (paragraphs split on blank lines).
export function richTextParagraphs(text) {
  const paras = String(text).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  return {
    nodeType: "document",
    data: {},
    content: paras.map((p) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: p, marks: [], data: {} }],
    })),
  };
}

// EN/DE copy mirrored from src/i18n/{en,de}.ts (kept in sync manually; seed-only).
export const COPY = {
  home: {
    heroTitle: { en: "CONTENT WITH A PULSE", de: "CONTENT MIT PULS" },
    pulseEffectTitle: { en: "The Pulse Effect", de: "The Pulse Effect" },
    pulseEffectBody: {
      en: "We craft strategies, campaigns, and visual content that make your brand impossible to ignore. When people feel your brand, they believe in it.",
      de: "Wir entwickeln Strategien, Kampagnen und visuelle Inhalte, die deine Marke unübersehbar machen. Wenn Menschen deine Marke spüren, glauben sie an sie.",
    },
    servicesSectionTitle: { en: "Services", de: "Services" },
    servicesSectionSubtitle: {
      en: "Concepts, creation, execution — turning ideas into scroll-stopping visuals.",
      de: "Konzepte, Kreation, Umsetzung – wir verwandeln Ideen in visuelle Inhalte, die aufsehen erzielen.",
    },
  },
  about: {
    eyebrow: { en: "About NOJA", de: "Über Noja" },
    heading: { en: "Why Us?", de: "Why Us?" },
    storyText: {
      en: "NOJA was born from a shared vision of three creatives with backgrounds in design management and multimedia. We saw a gap between strong ideas and flawless execution — so we founded an agency that bridges both. From concept to delivery, we combine strategy, project management, and production to create content that stands out and delivers.",
      de: "NOJA entstand aus einer gemeinsamen Vision von drei Kreativen mit Hintergründen in Design Management und Multimedia. Wir sahen eine Lücke zwischen starken Ideen und einwandfreier Umsetzung – also gründeten wir eine Agentur, die beides verbindet. Von der Idee bis zur Auslieferung vereinen wir Strategie, Projektmanagement und Produktion, um Inhalte zu schaffen, die auffallen und wirken.",
    },
    valuesTitle: { en: "Our Values", de: "Unsere Werte" },
    teamTitle: { en: "We are Noja", de: "Wir sind Noja" },
  },
  projects: {
    pageTitle: { en: "Featured Projects", de: "Ausgewählte Projekte" },
    pageSubtitle: { en: "The Pulse Effect in Action", de: "Der Pulse Effect in Aktion" },
    moreWorkTitle: { en: "More Work", de: "Mehr Arbeiten" },
    allProjectsTitle: { en: "All Projects", de: "Alle Projekte" },
  },
  values: [
    { icon: "eye", order: 0,
      title: { en: "Transparency", de: "Transparenz" },
      description: { en: "Open communication and expectations.", de: "Offene Kommunikation und klare Erwartungen." } },
    { icon: "lightbulb", order: 1,
      title: { en: "Strategic Creativity", de: "Strategische Kreativität" },
      description: { en: "Blending concept development, production, and project management for end-to-end solutions.", de: "Die Verbindung von Konzeptentwicklung, Produktion und Projektmanagement für ganzheitliche Lösungen." } },
    { icon: "users", order: 2,
      title: { en: "Community", de: "Community" },
      description: { en: "If we don't have the solution in-house, someone in our creative network does. We collaborate with trusted specialists across other creative fields.", de: "Wenn wir eine Lösung nicht intern abdecken, findet sie jemand aus unserem kreativen Netzwerk. Wir arbeiten mit erfahrenen Spezialistinnen und Spezialisten aus allen kreativen Bereichen zusammen." } },
  ],
  team: [
    { order: 0, name: "Naomi Ross",
      role: { en: "Creative Designer", de: "Mitgründerin / Kreative Designerin" },
      description: { en: "Multimedia roots and a natural eye for social-media-savvy, clever transitions.", de: "Multimedia roots and a natural eye for social-media-savvy, clever transitions." },
      funFact: { en: "Animal hoarder.", de: "Animal hoarder." },
      photo: "Naomi_NOJA_2026.jpg", video: "Naomi_NOJA_2026.mp4" },
    { order: 1, name: "Talia Persis Jenny",
      role: { en: "Co Founder / Project Manager", de: "Mitgründerin / Projekt Managerin" },
      description: { en: "Versed in design & project management, leading team through the details.", de: "Versed in design & project management, leading team through the details." },
      funFact: { en: "People pleaser.", de: "People pleaser." },
      photo: "Talia_NOJA_2026.jpg", video: "Talia_NOJA_2026.mp4" },
    { order: 2, name: "Jamilla Metzger",
      role: { en: "Co Founder / Campaign Manager and Creative Producer", de: "Mitgründerin / Kampagnen Managerin und Content Produzentin" },
      description: { en: "Background in multimedia with a gift for bringing out the fullest potential behind lenses.", de: "Background in multimedia with a gift for bringing out the fullest potential behind lenses." },
      funFact: { en: "Drives a motorcycle...", de: "Drives a motorcycle..." },
      photo: "Jamilla_NOJA_2026.jpg", video: "Jamilla_NOJA_2026.mp4" },
  ],
  services: [
    { order: 0,
      title: { en: "Full-Service Production", de: "Full-Service Produktion" },
      description: { en: "From brand positioning and storytelling to campaign concepts that set the tone and guide execution.", de: "Von der Markenpositionierung und dem Storytelling bis hin zu Kampagnenkonzepten, die den Ton setzen und die Umsetzung leiten." },
      features: { en: ["Strategy & Creative Direction","Campaign & Project Management","Video & Photography Production","Post-Production & Editing"], de: ["Strategie & Kreative Direktion","Kampagnen- & Projektmanagement","Video- & Fotoproduktion","Post-Production & Editing"] } },
    { order: 1,
      title: { en: "Strategy & Creative Direction", de: "Strategy & Creative Direction" },
      description: { en: "From brand positioning and storytelling to campaign concepts that define direction and impact.", de: "Von der Markenpositionierung und dem Storytelling bis zu Kampagnenkonzepten, die Richtung und Wirkung definieren." },
      features: { en: ["Brand Positioning","Campaign Concepts","Creative Storytelling","Moodboards & Guidelines","Tone-of-Voice Development","Strategic Planning"], de: ["Brand Positioning","Kampagnenkonzepte","Creative Storytelling","Moodboards & Guidelines","Tone-of-Voice-Entwicklung","Strategische Planung"] } },
    { order: 2,
      title: { en: "Video + Photography Production", de: "Video + Photography Production" },
      description: { en: "Visual content that stops the scroll — produced to capture the essence of your brand.", de: "Visuelle Inhalte, die zum Anhalten bringen – produziert, um den Kern deiner Marke einzufangen." },
      features: { en: ["Concept Development","Location Scouting","Casting & Talent Management","Set & Crew Coordination","On-Site Directing","Complete Photo & Video Shoots"], de: ["Konzepterstellung","Location Scouting","Casting & Talent Management","Set- & Crew-Koordination","On-Site Directing","Komplette Foto- & Videoshoots"] } },
    { order: 3,
      title: { en: "Post-Production + Editing", de: "Post-Production + Editing" },
      description: { en: "Clean, professional content — tailored to platform, audience, and brand identity.", de: "Saubere, professionelle Inhalte – abgestimmt auf Plattform, Zielgruppe und Markenidentität." },
      features: { en: ["Video Editing","Color Grading","Sound Design & Mixing","Photo Retouching","Motion Graphics","Final Delivery & Formatting"], de: ["Video Editing","Color Grading","Sound Design & Mixing","Foto-Retouching","Motion Graphics","Finale Auslieferung & Formatierung"] } },
  ],
};

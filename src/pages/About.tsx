import { Eye, Lightbulb, Users } from 'lucide-react';
 
 
import { useEffect, useState } from 'react';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import { fetchAbout, localeForLanguage, type CmsAboutPage } from '@/lib/cms';
 
import { Helmet } from '@dr.pogodin/react-helmet';
import { buildCanonical, getSiteUrl } from '@/lib/seo';
import Story from '@/components/about/Story';
import Values from '@/components/about/Values';
import Team from '@/components/about/Team';
import { useTranslation } from '@/i18n';

const About = () => {
  const { t, language } = useTranslation();

  const [about, setAbout] = useState<CmsAboutPage | undefined>(undefined);
  useEffect(() => {
    fetchAbout(localeForLanguage(language)).then(setAbout).catch(() => {
      console.warn('Failed to fetch About page content from Contentful. Falling back to static copy.');
    });
  }, [language]);

  const ICONS = { eye: Eye, lightbulb: Lightbulb, users: Users } as const;

  const fallbackValues = [
    {
      icon: Eye,
      title: t.about.values.transparency.title,
      description: t.about.values.transparency.description,
    },
    {
      icon: Lightbulb,
      title: t.about.values.strategicCreativity.title,
      description: t.about.values.strategicCreativity.description,
    },
    {
      icon: Users,
      title: t.about.values.community.title,
      description: t.about.values.community.description,
    }
  ];

  const fallbackTeam = [
    {
      name: t.about.team.naomi.name,
      role: t.about.team.naomi.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Naomi_NOJA_2026.jpg`,
      video: `${import.meta.env.BASE_URL}images/team-pictures/Naomi_NOJA_2026.mp4`,
      description: t.about.team.naomi.description,
      funFact: t.about.team.naomi.funFact,
    },
    {
      name: t.about.team.talia.name,
      role: t.about.team.talia.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Talia_NOJA_2026.jpg`,
      video: `${import.meta.env.BASE_URL}images/team-pictures/Talia_NOJA_2026.mp4`,
      description: t.about.team.talia.description,
      funFact: t.about.team.talia.funFact,
    },
    {
      name: t.about.team.jamilla.name,
      role: t.about.team.jamilla.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Jamilla_NOJA_2026.jpg`,
      video: `${import.meta.env.BASE_URL}images/team-pictures/Jamilla_NOJA_2026.mp4`,
      description: t.about.team.jamilla.description,
      funFact: t.about.team.jamilla.funFact,
    },
  ];

  const fallbackActionImages = [
    `${import.meta.env.BASE_URL}images/action-slider/slide-01.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-02.jpg`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-03.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-04.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-05.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-06.jpg`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-07.jpg`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-08.jpg`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-09.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-10.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-11.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-12-lecle.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-13-naomi.jpg`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-14-talia.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-15.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-16.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-17.png`,
    `${import.meta.env.BASE_URL}images/action-slider/slide-18.png`,
  ];

  const values = about?.values?.length
    ? about.values.map((v) => ({ icon: ICONS[v.icon] ?? Eye, title: v.title, description: v.description }))
    : fallbackValues;

  const team = about?.team?.length
    ? about.team.map((m) => ({ name: m.name, role: m.role, image: m.photoUrl ?? '', video: m.videoUrl, description: m.description ?? '', funFact: m.funFact ?? '' }))
    : fallbackTeam;

  const actionImages = about?.inActionImageUrls?.length ? about.inActionImageUrls : fallbackActionImages;



  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] pt-12 md:pt-20">
      <Helmet>
        <title>About NOJA — Why Us</title>
        <meta name="description" content="We blend concept, production, and project management to deliver strategic creative content." />
        <link rel="canonical" href={buildCanonical('/about')} />
        <meta property="og:title" content="About NOJA — Why Us" />
        <meta property="og:description" content="We blend concept, production, and project management to deliver strategic creative content." />
        <meta property="og:image" content={`${getSiteUrl()}/Logos/Noja_Productions.png`} />
      </Helmet>

      <Story
        text={about?.ourStoryText}
        fallbackText={t.about.story.text}
        imageUrl={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`}
        eyebrow={about?.aboutEyebrow}
        heading={about?.aboutHeading}
      />

      

      <Values items={values} title={about?.valuesTitle} />

      <Team members={team} title={about?.teamTitle} />

      {/* In Action Marquee */}
      <section className="py-20 bg-[hsl(var(--primary))] overflow-hidden">
        <div className="relative w-full">
          <div className="flex w-max marquee-content">
            {[...actionImages, ...actionImages].map((src, index) => (
              <div key={index} className="flex-shrink-0 px-2">
                <div className="overflow-hidden rounded-2xl w-40 sm:w-56 aspect-[9/16]">
                  <img
                    src={src}
                    alt={`Action shot ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HaveProjectCTA className="py-24" variant="dark" />
    </div>
  );
};

export default About;
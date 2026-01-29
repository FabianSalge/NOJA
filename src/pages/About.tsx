import { Eye, Lightbulb, Users } from 'lucide-react';
 
 
import { useEffect, useState } from 'react';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import { fetchAbout, type CmsAboutPage } from '@/lib/cms';
 
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';
import Story from '@/components/about/Story';
import Values from '@/components/about/Values';
import Team from '@/components/about/Team';
import { useTranslation } from '@/i18n';

const About = () => {
  const { t, language } = useTranslation();

  const [about, setAbout] = useState<CmsAboutPage | undefined>(undefined);
  useEffect(() => {
    fetchAbout().then(setAbout).catch(() => {
      console.warn('Failed to fetch About page content from Contentful. Falling back to static copy.');
    });
  }, []);

  const values = [
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

  const team = [
    {
      name: t.about.team.naomi.name,
      role: t.about.team.naomi.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Naomi_NOJA.jpeg`,
      description: t.about.team.naomi.description,
      funFact: t.about.team.naomi.funFact,
    },
    {
      name: t.about.team.talia.name,
      role: t.about.team.talia.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Talia_NOJA.jpeg`,
      description: t.about.team.talia.description,
      funFact: t.about.team.talia.funFact,
    },
    {
      name: t.about.team.jamilla.name,
      role: t.about.team.jamilla.role,
      image: `${import.meta.env.BASE_URL}images/team-pictures/Jamilla_NOJA.jpg`,
      description: t.about.team.jamilla.description,
      funFact: t.about.team.jamilla.funFact,
    }
  ];

  const actionImages = [
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

  

  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] pt-20">
      <Helmet>
        <title>About NOJA — Why Us</title>
        <meta name="description" content="We blend concept, production, and project management to deliver strategic creative content." />
        <link rel="canonical" href={buildCanonical('/about')} />
      </Helmet>

      <Story 
        text={language === 'en' ? about?.ourStoryText : undefined} 
        fallbackText={t.about.story.text}
        imageUrl={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`} 
      />

      

      <Values items={values} />

      <Team members={team} />

      {/* In Action Marquee */}
      <section className="py-20 bg-[hsl(var(--primary))] overflow-hidden">
        <div className="relative w-full">
          <div className="flex w-max marquee-content">
            {[...actionImages, ...actionImages].map((src, index) => (
              <div key={index} className="flex-shrink-0 px-2">
                <div className="overflow-hidden rounded-2xl w-56 aspect-[9/16]">
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
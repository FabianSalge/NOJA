import { Eye, Lightbulb, RefreshCcw } from 'lucide-react';
 
 
import { useEffect, useState } from 'react';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import { fetchAbout, type CmsAboutPage } from '@/lib/cms';
 
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';
import Story from '@/components/about/Story';
import Values from '@/components/about/Values';
import Team from '@/components/about/Team';

const About = () => {
  

  const [about, setAbout] = useState<CmsAboutPage | undefined>(undefined);
  useEffect(() => {
    fetchAbout().then(setAbout).catch(() => {
      console.warn('Failed to fetch About page content from Contentful. Falling back to static copy.');
    });
  }, []);

  const values = [
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Open communication and expectations.',
    },
    {
      icon: Lightbulb,
      title: 'Strategic Creativity',
      description: 'Blending concept development, production, and project management for end-to-end solutions.',
    },
    {
      icon: RefreshCcw,
      title: 'Adaptability',
      description: 'Adjusting strategies to client needs fast.',
    }
  ];

  const team = [
    {
      name: 'Naomi Ross',
      role: 'Content Producer',
      image: `${import.meta.env.BASE_URL}images/naomi.avif`,
      description: "Multimedia roots and a natural eye for social-media-savvy, clever transitions.",
      funFact: "Animal hoarder."
    },
    {
      name: 'Talia Persis Jenny',
      role: 'Operations & Management',
      image: `${import.meta.env.BASE_URL}images/talia.png`,
      description: "Versed in design & project management, leading team through the details.",
      funFact: "People pleaser."
    },
    {
      name: 'Jamilla Metzger',
      role: 'Content Producer',
      image: `${import.meta.env.BASE_URL}images/jamilla.avif`,
      description: "Background in multimedia with a gift for bringing out the fullest potential behind lenses.",
      funFact: "Drives a motorcycle..."
    }
  ];

  const actionImages = [
    `${import.meta.env.BASE_URL}images/im1.png`,
    `${import.meta.env.BASE_URL}images/im2.png`,
    `${import.meta.env.BASE_URL}images/im3.jpg`,
    `${import.meta.env.BASE_URL}images/im4.png`,
    `${import.meta.env.BASE_URL}images/im5.png`,
    `${import.meta.env.BASE_URL}images/im6.png`,
    `${import.meta.env.BASE_URL}images/im7.jpg`,
    `${import.meta.env.BASE_URL}images/im8.jpg`,
  ];

  

  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <Helmet>
        <title>About NOJA — Why Us</title>
        <meta name="description" content="We blend concept, production, and project management to deliver strategic creative content." />
        <link rel="canonical" href={buildCanonical('/about')} />
      </Helmet>

      <Story text={about?.ourStoryText} imageUrl={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`} />

      

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
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';
import { useTranslation } from '@/i18n';

const Section = ({
  title,
  body,
  extra,
  extraBold,
  bullets,
  pre,
}: {
  title: string;
  body: string;
  extra?: string;
  extraBold?: boolean;
  bullets?: string[];
  pre?: boolean;
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-background mb-3">{title}</h2>
    {pre ? (
      <pre className="text-background/80 leading-relaxed whitespace-pre-wrap font-sans">{body}</pre>
    ) : (
      <p className="text-background/80 leading-relaxed">{body}</p>
    )}
    {bullets && (
      <ul className="mt-3 space-y-1 list-none">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-background/80">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-background/40 flex-shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    )}
    {extra && (
      <p className={`mt-3 leading-relaxed ${extraBold ? 'font-bold text-background' : 'text-background/80'}`}>
        {extra}
      </p>
    )}
  </div>
);

const CookieDeclaration = () => {
  const { language } = useTranslation();
  const isDE = language === 'de';

  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] text-foreground pt-28 pb-20">
      <Helmet>
        <title>{isDE ? 'Cookie-Erklärung — NOJA' : 'Cookie Declaration — NOJA'}</title>
        <meta name="description" content={isDE ? 'Cookie-Erklärung von NOJA Productions KLG.' : 'Cookie declaration for NOJA Productions KLG.'} />
        <link rel="canonical" href={buildCanonical('/cookie-declaration')} />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black text-background mb-4 leading-[0.9]">
          {isDE ? 'Cookie-Erklärung' : 'Cookie Declaration'}
        </h1>

        <p className="text-sm text-background/60 mb-10">
          {isDE ? 'NOJA Productions KLG — Stand: März 2026' : 'NOJA Productions KLG — As of: March 2026'}
        </p>

        <Section
          title={isDE ? '1. Was sind Cookies?' : '1. What are cookies?'}
          body={isDE
            ? 'Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, um die grundlegende Funktionalität der Website sicherzustellen.'
            : 'Cookies are small text files stored on your device to ensure basic website functionality.'
          }
        />

        <Section
          title={isDE ? '2. Verwendung von Cookies' : '2. Use of cookies'}
          body={isDE
            ? 'Unsere Website verwendet ausschließlich technisch notwendige Cookies, die für den stabilen Betrieb und die Inhaltsauslieferung erforderlich sind. Die Nutzung dieser technisch notwendigen Cookies basiert auf unserem berechtigten Interesse an einem sicheren und fehlerfreien Betrieb unserer Website (Art. 6 Abs. 1 lit. f DSGVO / Art. 30 Abs. 1 lit. b nDSG).'
            : 'Our website uses only technically necessary cookies required for stable operation and content delivery. The use of these technically necessary cookies is based on our legitimate interest in ensuring the secure and error-free operation of our website (Art. 6 Abs. 1 lit. f DSGVO / Art. 30 Abs. 1 lit. b nDSG).'
          }
          extra={isDE
            ? 'Wir verwenden keine Tracking-, Analyse- oder Marketing-Cookies.'
            : 'We do not use tracking, analytics, or marketing cookies.'
          }
          extraBold
        />

        <Section
          title={isDE ? '3. Contentful (CMS)' : '3. Contentful (CMS)'}
          body={isDE
            ? 'Unsere Website-Inhalte werden über Contentful (Headless CMS) verwaltet.'
            : 'Our website content is managed via Contentful (headless CMS).'
          }
          bullets={isDE
            ? [
                'Contentful setzt selbst keine Tracking-Cookies für Website-Besucher',
                'Inhalte werden über APIs und CDN-Infrastruktur ausgeliefert',
                'Kein direktes User-Profiling oder Tracking durch Contentful',
              ]
            : [
                'Contentful itself does not set tracking cookies for website visitors',
                'Content is delivered via APIs and CDN infrastructure',
                'No direct user profiling or tracking is performed through Contentful',
              ]
          }
        />

        <Section
          title={isDE ? '4. Hosting & Auslieferung (Technisch notwendige Cookies)' : '4. Hosting & Delivery (Technically Necessary Cookies)'}
          body={isDE
            ? 'Unsere Website wird auf Vercel gehostet. Zur Sicherstellung eines stabilen Betriebs, schnellen Zugriffs und der Sicherheit (z. B. Bot-Schutz und Lastverteilung) setzt Vercel und seine zugehörige CDN-Infrastruktur technisch notwendige Cookies.'
            : 'Our website is hosted on Vercel. To ensure stable operation, fast access, and security (e.g., bot protection and load balancing), Vercel and its associated CDN infrastructure set technically necessary cookies.'
          }
          bullets={isDE
            ? [
                '__session oder _vercel (Session-Management und Performance)',
              ]
            : [
                '__session or _vercel (for session management and performance)',
              ]
          }
          extra={isDE
            ? 'Diese Cookies dienen ausschließlich der Aufrechterhaltung der Website-Funktionalität und speichern keine personenbezogenen Daten für Tracking- oder Profiling-Zwecke.'
            : 'These cookies are used solely to maintain the functionality of the website and do not store personal data for tracking or profiling purposes.'
          }
        />

        <Section
          title={isDE ? '5. Kein Marketing oder Analytics' : '5. No marketing or analytics'}
          body={isDE ? 'Wir verwenden derzeit nicht:' : 'We currently do not use:'}
          bullets={isDE
            ? ['Google Analytics', 'Meta Pixel', 'LinkedIn Insight Tag', 'Retargeting-Tools', 'Werbe-Cookies']
            : ['Google Analytics', 'Meta Pixel', 'LinkedIn Insight Tag', 'Retargeting tools', 'Advertising cookies']
          }
        />

        <Section
          title={isDE ? '6. Datenschutz & Sicherheit' : '6. Data protection & security'}
          body={isDE ? 'Wir wenden Datensparsamkeit und Sicherheitsmaßnahmen an:' : 'We apply data minimization and security measures:'}
          bullets={isDE
            ? ['Eingeschränkter Zugriff', 'Sichere Übertragung', 'Regelmäßige Updates']
            : ['Restricted access', 'Secure transmission', 'Regular updates']
          }
        />

        <Section
          title={isDE ? '7. Benutzer-Kontrolle' : '7. User control'}
          body={isDE ? 'Benutzer können:' : 'Users can:'}
          bullets={isDE
            ? ['Cookies über die Browser-Einstellungen blockieren', 'Cookies jederzeit löschen']
            : ['Block cookies via browser settings', 'Delete cookies at any time']
          }
          extra={isDE ? 'Hinweis: Dies kann die Funktionalität beeinträchtigen.' : 'Note: This may affect functionality.'}
        />

        <Section
          title={isDE ? '8. Kontakt' : '8. Contact'}
          body={`NOJA Productions KLG\nObere Wangenstrasse 17\n8306 Brüttisellen, Zürich`}
          pre
        />
      </div>
    </div>
  );
};

export default CookieDeclaration;

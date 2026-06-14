import { Helmet } from '@dr.pogodin/react-helmet';

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

interface AnalyticsProps {
  /** Load the GA4 cookie-setting script. Gate this on the visitor's consent. */
  gaEnabled?: boolean;
}

const Analytics = ({ gaEnabled = false }: AnalyticsProps) => {
  return (
    <>
      {/* Site-ownership verification is not tracking — always render it. */}
      {GSC_VERIFICATION && (
        <Helmet>
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        </Helmet>
      )}
      {gaEnabled && GA_ID && (
        <Helmet>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </script>
        </Helmet>
      )}
    </>
  );
};

export default Analytics;

import { Helmet } from 'react-helmet-async';

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

const Analytics = () => {
  return (
    <>
      {GSC_VERIFICATION && (
        <Helmet>
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        </Helmet>
      )}
      {GA_ID && (
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



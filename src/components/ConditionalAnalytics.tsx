import Analytics from './Analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useConsent } from '@/hooks/use-consent';

const ConditionalAnalytics = () => {
  const { hasConsented } = useConsent();

  return (
    <>
      {/* GSC verification always renders; GA4 (sets cookies) only after consent. */}
      <Analytics gaEnabled={hasConsented} />
      {/* Vercel Analytics and Speed Insights are cookieless, so they run unconditionally. */}
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
};

export default ConditionalAnalytics;

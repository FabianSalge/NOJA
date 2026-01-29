import { useConsent } from '@/hooks/use-consent';
import Analytics from './Analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * Only loads analytics components when user has consented to analytics cookies.
 * Essential cookies are always allowed.
 */
const ConditionalAnalytics = () => {
  const { preferences } = useConsent();

  // Only render analytics if user has accepted analytics cookies
  if (!preferences.analytics) {
    return null;
  }

  return (
    <>
      <Analytics />
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
};

export default ConditionalAnalytics;

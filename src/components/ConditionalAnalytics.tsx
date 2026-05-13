import Analytics from './Analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const ConditionalAnalytics = () => {
  return (
    <>
      <Analytics />
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
};

export default ConditionalAnalytics;

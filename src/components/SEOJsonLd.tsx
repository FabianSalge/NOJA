import { Helmet } from 'react-helmet-async';

type SEOJsonLdProps = {
  json: object | object[];
};

const SEOJsonLd = ({ json }: SEOJsonLdProps) => {
  const content = Array.isArray(json) ? json : [json];
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(content)}</script>
    </Helmet>
  );
};

export default SEOJsonLd;



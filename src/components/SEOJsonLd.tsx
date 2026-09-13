import { Helmet } from "@dr.pogodin/react-helmet";

import { toJsonLd } from "@/lib/seo";

type SEOJsonLdProps = {
  json: object | object[];
};

const SEOJsonLd = ({ json }: SEOJsonLdProps) => {
  const content = Array.isArray(json) ? json : [json];
  return (
    <Helmet>
      <script type="application/ld+json">{toJsonLd(content)}</script>
    </Helmet>
  );
};

export default SEOJsonLd;

export const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const BRAND_LOGOS: string[] = [
  'Brands/LeCleMarie_Invoice_November24.png',
  'Brands/logo_edited.png',
  'Brands/Logo_spacewhite.png',
  'Brands/maru_edited.png',
];

export const HOME_IMAGES = {
  iphone: withBase('images/Home/iphone_home.png'),
  contentStrategy: withBase('images/Home/content-strategy-bg.jpg'),
  videoPhotography: withBase('images/Home/video-photography-bg.jpg'),
  postProduction: withBase('images/Home/post-production-bg.jpg'),
};

export const LOGOS = {
  njWhite: withBase('Logos/NJ_white.png'),
  njBeige: withBase('Logos/NJ_beige.png'),
  nojaWordmark: withBase('Logos/NOJA_white.png'),
  productions: withBase('Logos/Noja_Productions.png'),
};



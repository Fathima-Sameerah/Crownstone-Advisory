import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://crownstoneofficial.com';
const SOCIAL_IMAGE = `${SITE_URL}/assets/logo.png`;

export default function SEO({
  title,
  description = "Crownstone Advisory is a professional consultancy providing commercial, contractual, and claims advisory services, led by a Chartered Quantity Surveyor (MRICS).",
  canonical
}) {
  const { pathname } = useLocation();
  const canonicalUrl = canonical || `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Crownstone Advisory" />
      <meta property="og:image" content={SOCIAL_IMAGE} />
      <meta property="og:image:alt" content="Crownstone Advisory logo" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SOCIAL_IMAGE} />
    </Helmet>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BRAND } from '../data/content';

export default function SEO({
  title,
  description = "Crownstone Advisory is a professional consultancy providing commercial, contractual, and claims advisory services, led by a Chartered Quantity Surveyor (MRICS).",
  canonical = ""
}) {
  const fullTitle = title
    ? `${title} | Crownstone Advisory`
    : `Crownstone Advisory | Chartered Quantity Surveyors & Cost Consultants`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/assets/logo.png" />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Banner({
  eyebrow,
  title,
  bgImage = "/assets/site.jpg"
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-banner">
      <div
        className="page-banner-bg"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      >
        <div className="page-banner-overlay" />
      </div>

      <div className="container page-banner-content">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && <span className="eyebrow-badge">{eyebrow}</span>}
          <h1 className="banner-title">{title}</h1>
        </motion.div>
      </div>
    </div>
  );
}

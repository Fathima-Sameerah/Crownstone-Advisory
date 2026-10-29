import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import CtaBand from '../components/CtaBand';
import IconCircle from '../components/IconCircle';
import ImageWithFallback from '../components/ImageWithFallback';
import { CLIENT_TYPES, GOVERNANCE_LIST } from '../data/content';

export default function Support() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-wrapper support-page">
      <SEO
        title="Who We Support / Why Choose Us"
        description="Crownstone Advisory supports private developers, contractors, consultants, and property owners with high governance standards and commercial clarity."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="OUR CLIENTS"
        title="Who We Support / Why Choose Us"
        bgImage="/assets/team.jpg"
      />

      {/* 2. Client Grid: 5 Centred Icon Cards */}
      <section className="section bg-ivory">
        <div className="container">
          <Reveal className="text-center mb-12">
            <span className="eyebrow-badge">WHO WE SUPPORT</span>
            <h2 className="section-title">Clients across the project lifecycle</h2>
          </Reveal>

          <div className="client-types-grid">
            {CLIENT_TYPES.map((client, index) => (
              <Reveal key={index} delay={0.08 * index}>
                <motion.div
                  className="client-type-card"
                  whileHover={shouldReduceMotion ? {} : { y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconCircle name={client.icon} size={28} />
                  <h3 className="client-type-title">{client.title}</h3>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cream, 2 columns: Why Choose Us / Professional Standing & Governance */}
      <section className="section bg-cream">
        <div className="container">
          <div className="two-col-grid align-center">
            <Reveal className="col-text">
              <span className="eyebrow-badge">WHY CHOOSE US</span>
              <h2 className="section-title">Professional Standing & Governance</h2>
              <ul className="governance-list">
                {GOVERNANCE_LIST.map((item, index) => (
                  <motion.li
                    key={index}
                    className="governance-item"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * index, duration: 0.4 }}
                  >
                    <span className="gold-dot-bullet" aria-hidden="true" />
                    <span className="governance-item-text">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="col-media">
              <ImageWithFallback
                src="/assets/hero.jpg"
                alt="Chartered Quantity Surveyor site operation"
                className="rounded-image-card"
                placeholderText="Site Operation"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Focus Band & CTA Band */}
      <FocusBand />
      <CtaBand
        heading="Ready to talk?"
        buttonText="Contact Us"
        buttonLink="/contact"
      />
    </div>
  );
}

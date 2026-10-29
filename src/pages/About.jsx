import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import CtaBand from '../components/CtaBand';
import PracticeBlock from '../components/PracticeBlock';
import ImageWithFallback from '../components/ImageWithFallback';
import { GOVERNANCE_LIST } from '../data/content';

const governanceListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const governanceItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-wrapper about-page">
      <SEO
        title="About Us"
        description="Learn about Crownstone Advisory, led by a Chartered Quantity Surveyor (MRICS) providing standards you can rely on across Sri Lanka and GCC."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="CROWNSTONE ADVISORY"
        title="About Us"
        bgImage="/assets/site.jpg"
      />

      {/* 2. Who We Are (Two columns) */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="two-col-grid align-center">
            <Reveal className="col-text">
              <span className="eyebrow-badge">WHO WE ARE</span>
              <h2 className="section-title">
                Led by a Chartered Quantity Surveyor (MRICS)
              </h2>
              <p className="body-text">
                <strong>Crownstone Advisory</strong> is a professional consultancy providing commercial, contractual, and claims advisory services, led by a <strong>Chartered Quantity Surveyor (MRICS)</strong>. We support clients, developers, contractors, and consultants with independent, practical, and contractually robust advice across the project lifecycle - from pre-contract cost planning to post-contract commercial management and claims resolution.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="col-media">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ImageWithFallback
                  src="/assets/serveyor.jpg"
                  alt="Crownstone Advisory professional quantity surveying site operations"
                  className="rounded-image-card"
                  placeholderText="Site Operation"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Cream section with Practice Block */}
      <section className="section practice-section bg-cream">
        <div className="container">
          <Reveal>
            <PracticeBlock />
          </Reveal>
        </div>
      </section>

      {/* 4. Professional Standing & Governance (Two columns: left image, right text) */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="two-col-grid align-center">
            <Reveal delay={0.2} className="col-media">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ImageWithFallback
                  src="/assets/teams.jpg"
                  alt="Engineers reviewing compliance and contract documents"
                  className="rounded-image-card"
                  placeholderText="Team Review"
                />
              </motion.div>
            </Reveal>

            <Reveal className="col-text">
              <span className="eyebrow-badge">PROFESSIONAL STANDING & GOVERNANCE</span>
              <h2 className="section-title">Standards you can rely on</h2>
              <motion.ul
                className="governance-list"
                variants={governanceListVariants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.2 }}
              >
                {GOVERNANCE_LIST.map((item, index) => (
                  <motion.li
                    key={index}
                    className="governance-item"
                    variants={governanceItemVariants}
                  >
                    <span className="gold-dot-bullet" aria-hidden="true" />
                    <span className="governance-item-text">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Focus Band & CTA Band */}
      <FocusBand />
      <CtaBand
        heading="Let us review your project"
        buttonText="Get in Touch"
        buttonLink="/contact"
      />
    </div>
  );
}

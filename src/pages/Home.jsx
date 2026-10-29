import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import CtaBand from '../components/CtaBand';
import PracticeBlock from '../components/PracticeBlock';
import ServiceCard from '../components/ServiceCard';
import ImageWithFallback from '../components/ImageWithFallback';
import {
  BRAND,
  ABOUT_TEXT,
  QS_LIST,
  CONTRACT_LIST,
  CLAIMS_LIST
} from '../data/content';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const heroHeadline = "Expert Quantity Surveying & Cost Consultancy";
  const heroWords = heroHeadline.split(" ");

  return (
    <div className="page-wrapper home-page">
      <SEO
        title="Crownstone Advisory"
        description="Crownstone Advisory provides independent quantity surveying, commercial management, and claims advisory services across Sri Lanka & the GCC."
      />

      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-wrapper">
          <ImageWithFallback
            src={`${import.meta.env.BASE_URL}assets/hero.jpg`}
            alt="Crownstone Advisory - Hard hat, plans and calculator on site"
            className="hero-bg-img"
            overlay={true}
            loading="eager"
            placeholderText="Hero Image"
          />
        </div>

        <div className="container hero-content-container">
          <div className="hero-content">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="eyebrow-badge"
            >
              {BRAND.practice}
            </motion.div>

            {/* H1 with rising words */}
            <h1 className="hero-title">
              {shouldReduceMotion ? (
                heroHeadline
              ) : (
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                    }
                  }}
                >
                  {heroWords.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                        }
                      }}
                      style={{ display: 'inline-block', marginRight: '0.28em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </h1>

            {/* Paragraph */}
            <motion.p
              className="hero-paragraph"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Chartered Quantity Surveyors & Cost Consultants. Commercial clarity, entitlement protection, and dispute prevention.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="hero-actions"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/contact" className="btn btn-primary">
                Get in Touch
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Our Services
              </Link>
            </motion.div>

            {/* Gold Email Link */}
            <motion.div
              className="hero-email-wrap"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <a href={`mailto:${BRAND.email}`} className="hero-email-link">
                {BRAND.email}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. About Preview Section (cream bg, 2 columns) */}
      <section className="section bg-cream">
        <div className="container">
          <div className="two-col-grid">
            <Reveal className="col-text">
              <span className="eyebrow-badge">ABOUT US</span>
              <h2 className="section-title">
                Independent advice across the project lifecycle
              </h2>
              <p className="body-text">
                <strong>Crownstone Advisory</strong> is a professional consultancy providing commercial, contractual, and claims advisory services, led by a <strong>Chartered Quantity Surveyor (MRICS)</strong>. We support clients, developers, contractors, and consultants with independent, practical, and contractually robust advice across the project lifecycle - from pre-contract cost planning to post-contract commercial management and claims resolution.
              </p>
              <div className="mt-8">
                <Link to="/about" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="col-media">
              <ImageWithFallback
                src={`${import.meta.env.BASE_URL}assets/about.jpg`}
                alt="Crownstone Advisory professional team reviewing project specs"
                className="rounded-image-card"
                placeholderText="About Image"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Practice Block (Centred) */}
      <section className="section practice-section bg-ivory">
        <div className="container">
          <Reveal>
            <PracticeBlock />
          </Reveal>
        </div>
      </section>

      {/* 4. Core Services (3 equal cards linking to /services) */}
      <section className="section bg-cream">
        <div className="container">
          <Reveal className="text-center mb-12">
            <span className="eyebrow-badge">OUR CORE SERVICES</span>
            <h2 className="section-title">What we do</h2>
          </Reveal>

          <div className="three-col-grid">
            {/* Card 1: Quantity Surveying */}
            <Reveal delay={0.1}>
              <Link to="/services" className="card-link-wrapper">
                <ServiceCard
                  icon="FileText"
                  title="Quantity Surveying & Cost Consultancy"
                  items={QS_LIST}
                  variant="white"
                />
              </Link>
            </Reveal>

            {/* Card 2: Contract & Commercial Management (Navy) */}
            <Reveal delay={0.2}>
              <Link to="/services" className="card-link-wrapper">
                <ServiceCard
                  icon="Link"
                  title="Contract & Commercial Management"
                  items={CONTRACT_LIST}
                  variant="navy"
                />
              </Link>
            </Reveal>

            {/* Card 3: Claims & Dispute Advisory */}
            <Reveal delay={0.3}>
              <Link to="/services" className="card-link-wrapper">
                <ServiceCard
                  icon="Scale"
                  title="Claims & Dispute Advisory"
                  items={CLAIMS_LIST.slice(0, 4)}
                  variant="white"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Focus Band */}
      <FocusBand />

      {/* 6. Our Clients Preview (2 columns) */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="two-col-grid align-center">
            <Reveal className="col-text">
              <span className="eyebrow-badge">OUR CLIENTS</span>
              <h2 className="section-title">
                Developers, contractors, consultants & owners
              </h2>
              <p className="client-types-inline">
                Private developers · Contractors & subcontractors · Consultants · Property owners · Institutional and individual clients
              </p>
              <div className="mt-8">
                <Link to="/support" className="btn btn-primary">
                  See Our Clients
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="col-media">
              <ImageWithFallback
                src={`${import.meta.env.BASE_URL}assets/team.jpg`}
                alt="Two Crownstone Advisory engineers reviewing construction blueprints"
                className="rounded-image-card"
                placeholderText="Team Image"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. CTA Band */}
      <CtaBand
        heading="Need commercial clarity on your project?"
        buttonText="Contact Us"
        buttonLink="/contact"
      />
    </div>
  );
}

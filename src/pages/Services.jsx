import React, { useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import CtaBand from '../components/CtaBand';
import ServiceCard from '../components/ServiceCard';
import ImageWithFallback from '../components/ImageWithFallback';
import { QS_LIST, CONTRACT_LIST, CLAIMS_LIST } from '../data/content';

function NumberCounter({ targetNumber }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(targetNumber);
      return;
    }

    if (isInView) {
      let start = 0;
      const duration = 600; // ms
      const stepTime = Math.max(Math.floor(duration / targetNumber), 30);
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= targetNumber) {
          clearInterval(timer);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, targetNumber, shouldReduceMotion]);

  const formatted = count < 10 ? `0 ${count}` : `${count}`;

  return (
    <span ref={ref} className="claims-card-num">
      {formatted}
    </span>
  );
}

export default function Services() {
  return (
    <div className="page-wrapper services-page">
      <SEO
        title="Our Services"
        description="Comprehensive Quantity Surveying, Contract & Commercial Management, and Specialist Claims & Dispute Advisory services."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="CORE SERVICES"
        title="Our Services"
        bgImage="/assets/site.jpg"
      />

      {/* 2. Side-by-side core service cards */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="two-card-row">
            {/* White card */}
            <Reveal className="w-full">
              <ServiceCard
                icon="FileText"
                title="Quantity Surveying & Cost Consultancy"
                items={QS_LIST}
                variant="white"
              />
            </Reveal>

            {/* Navy card */}
            <Reveal delay={0.2} className="w-full">
              <ServiceCard
                icon="Link"
                title="Contract & Commercial Management"
                items={CONTRACT_LIST}
                variant="navy"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Navy section: Claims & Dispute Advisory */}
      <section className="section claims-specialist-section bg-navy text-white">
        <div className="container">
          <div className="two-col-grid align-center mb-16">
            <Reveal className="col-text">
              <span className="eyebrow-badge eyebrow-gold">SPECIALIST SERVICE</span>
              <h2 className="section-title text-white">Claims & Dispute Advisory</h2>
              <p className="claims-leader-text">
                Led by a Chartered Quantity Surveyor.
              </p>
              <p className="claims-intro-bold">
                <strong>
                  We provide independent claims advisory and strategic commercial support, including:
                </strong>
              </p>
            </Reveal>

            <Reveal delay={0.2} className="col-media">
              <ImageWithFallback
                src="/assets/site.jpg"
                alt="Major construction site managed by Crownstone Advisory"
                className="rounded-image-card site-card-navy-border"
                placeholderText="Site Overview"
              />
            </Reveal>
          </div>

          {/* 6 numbered cards (01 - 06) in 3x2 grid */}
          <div className="claims-grid">
            {CLAIMS_LIST.map((claimText, idx) => (
              <Reveal key={idx} delay={0.08 * idx}>
                <div className="claims-item-card">
                  <div className="claims-card-top">
                    <NumberCounter targetNumber={idx + 1} />
                  </div>
                  <p className="claims-card-desc">{claimText}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Focus Band & CTA Band */}
      <FocusBand />
      <CtaBand
        heading="Discuss your commercial needs"
        buttonText="Get in Touch"
        buttonLink="/contact"
      />
    </div>
  );
}

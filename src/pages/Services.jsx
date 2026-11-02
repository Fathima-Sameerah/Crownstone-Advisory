import React, { useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import CtaBand from '../components/CtaBand';
import ServiceCard from '../components/ServiceCard';
import IconCircle from '../components/IconCircle';
import ImageWithFallback from '../components/ImageWithFallback';
import { QS_LIST, CONTRACT_LIST, CLAIMS_LIST } from '../data/content';

const QUICK_JUMP_LINKS = [
  { id: 'core', label: 'Core Services' },
  { id: 'scope', label: 'Scope of Services' },
  { id: 'tender', label: 'Pre-Contract & Tender' },
  { id: 'claims', label: 'Claims & Disputes' }
];

const SCOPE_ITEMS = [
  {
    num: '01',
    icon: 'FileWarning',
    title: 'Claims & Notices',
    desc: 'Advising on detailed claim submissions and drafting formal Notices of Claim.'
  },
  {
    num: '02',
    icon: 'TrendingUp',
    title: 'Strategic Growth',
    desc: 'Developing and implementing robust business plans for construction and consultancy firms.'
  },
  {
    num: '03',
    icon: 'Workflow',
    title: 'Governance & Workflow',
    desc: 'Optimizing post-contract management, commercial cost control, and change management workflows.'
  },
  {
    num: '04',
    icon: 'ScrollText',
    title: 'Procurement & Tendering',
    desc: 'Recommending tailored procurement strategies and Standard Forms of Contract aligned with client goals.'
  },
  {
    num: '05',
    icon: 'Handshake',
    title: 'Contract Administration',
    desc: "Acting as the client's trusted representative for seamless contract administration."
  }
];

const TENDER_CARD_A_ITEMS = [
  'Advice on tender negotiation strategy and commercial terms',
  'Evaluation of tender submissions, with risks identified and mitigation recommended',
  'Guidance on contract pricing, obligations, and risk allocation',
  'Support for value for money, with transparency and compliance with procurement requirements'
];

const TENDER_CARD_B_ITEMS = [
  'Preparation of Bills of Quantities to standard methods of measurement and project specifications',
  'Tender documentation, submissions, and contractor communication',
  'Responses to tender queries and clarifications',
  'Technical and commercial evaluation, with contractor selection recommendations',
  'Post-tender negotiations through to contract documentation and award'
];

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
  const [activeSection, setActiveSection] = useState('core');
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      let headerOffset = 116;
      if (window.innerWidth <= 400) headerOffset = 90;
      else if (window.innerWidth < 600) headerOffset = 96;
      else if (window.innerWidth < 900) headerOffset = 106;

      const triggerPos = scrollPos + headerOffset + 60;
      const sectionIds = ['claims', 'tender', 'scope', 'core'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= triggerPos) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('core');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePillClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  return (
    <div className="page-wrapper services-page">
      <SEO
        title="Our Services | Scope of Services, Pre-Contract Advisory & Tender Management"
        description="Crownstone Advisory provides comprehensive Quantity Surveying, Pre-Contract Advisory & Tender Management, full Scope of Services, and specialist Claims & Dispute Advisory."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="CORE SERVICES"
        title="Our Services"
        bgImage={`${import.meta.env.BASE_URL}assets/site.jpg`}
      />

      {/* 0. Quick-Jump Links */}
      <nav className="services-jump-section" aria-label="Services quick-jump navigation">
        <div className="container services-jump-wrapper">
          <div className="services-jump-track">
            {QUICK_JUMP_LINKS.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handlePillClick(e, link.id)}
                  className={`services-jump-pill ${isActive ? 'active' : ''}`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 * idx,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Side-by-side core service cards */}
      <section id="core" className="section bg-ivory services-nav-target">
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

      {/* 1. Section: Scope of Services */}
      <section id="scope" className="section bg-ivory services-nav-target">
        <div className="container">
          <Reveal className="mb-12">
            <span className="eyebrow-badge">SCOPE OF SERVICES</span>
            <h2 className="section-title">What our scope covers</h2>
          </Reveal>

          <div className="scope-grid">
            {SCOPE_ITEMS.map((card, idx) => (
              <motion.div
                key={card.num}
                className="scope-card-wrapper"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 32 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: isMobile ? 0.5 : 0.6,
                  delay: 0.1 * idx,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <motion.div
                  className="scope-card"
                  whileHover={shouldReduceMotion ? {} : { y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="scope-card-top">
                    <IconCircle name={card.icon} />
                    <motion.span
                      className="scope-card-num"
                      initial={shouldReduceMotion ? {} : { opacity: 0 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * idx + 0.15 }}
                    >
                      {card.num}
                    </motion.span>
                  </div>
                  <h3 className="scope-card-title">{card.title}</h3>
                  <p className="scope-card-desc">{card.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Section: Pre-Contract Advisory & Tender Management */}
      <section id="tender" className="section bg-cream services-nav-target">
        <div className="container">
          <Reveal className="mb-8">
            <span className="eyebrow-badge">PRE-CONTRACT</span>
            <h2 className="section-title">Pre-Contract Advisory & Tender Management</h2>
            <p className="tender-intro-text">
              Crownstone Advisory supports clients through procurement and tendering to achieve commercial value, cost certainty, and successful project delivery.
            </p>
          </Reveal>

          <div className="tender-two-card-row">
            {/* Card A: Tender Negotiation & Commercial Advisory (White card) */}
            <motion.div
              className="tender-card-col"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -60 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: isMobile ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="tender-card tender-card-white"
                whileHover={shouldReduceMotion ? {} : { y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="tender-card-header">
                  <IconCircle name="Gavel" />
                </div>
                <h3 className="tender-card-title">Tender Negotiation & Commercial Advisory</h3>
                <ul className="tender-card-list">
                  {TENDER_CARD_A_ITEMS.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="tender-card-item"
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, x: -10 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * idx, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="gold-dot-bullet" aria-hidden="true" />
                      <span className="tender-card-item-text">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Card B: BOQ Preparation & Tender Management (Navy card) */}
            <motion.div
              className="tender-card-col"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 60 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: isMobile ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="tender-card tender-card-navy"
                whileHover={shouldReduceMotion ? {} : { y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="tender-card-header">
                  <IconCircle name="ClipboardList" className="icon-circle-on-navy" />
                </div>
                <h3 className="tender-card-title">BOQ Preparation & Tender Management</h3>
                <ul className="tender-card-list">
                  {TENDER_CARD_B_ITEMS.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="tender-card-item"
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, x: -10 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * idx, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="gold-dot-bullet" aria-hidden="true" />
                      <span className="tender-card-item-text">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>

          {/* Full-width Our Commitment Band */}
          <motion.div
            className="commitment-card"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 32 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: isMobile ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {!shouldReduceMotion && (
              <motion.div
                className="commitment-gold-line"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: isMobile ? 0.5 : 0.65,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{ originY: 0 }}
              />
            )}

            <div className="commitment-header">
              <ShieldCheck className="commitment-icon" size={22} strokeWidth={2.4} />
              <span className="eyebrow-badge" style={{ fontSize: '13px', letterSpacing: '2.5px' }}>
                OUR COMMITMENT
              </span>
            </div>

            <p className="commitment-text">
              We combine technical expertise, contractual knowledge, and commercial insight to deliver transparent, value-driven procurement, protecting your commercial interests from tender preparation through to contract award.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Navy section: Claims & Dispute Advisory */}
      <section id="claims" className="section claims-specialist-section bg-navy text-white services-nav-target">
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
                src={`${import.meta.env.BASE_URL}assets/site.jpg`}
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

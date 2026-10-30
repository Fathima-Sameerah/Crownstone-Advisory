import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Phone,
  Check,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import { BRAND } from '../data/content';
import {
  PRIMARY_EMAIL,
  PHONE_DISPLAY,
  PHONE_LINK,
  ADDRESS,
  DEPARTMENTS,
  ENQUIRY_EMAIL,
  FORM_ENDPOINT,
  CRM_WEBHOOK,
  CONSULT_MINUTES,
  SERVICES,
  UK_CONTACT
} from '../config/contact';

const TIMEZONES = [
  'Sri Lanka (GMT+5:30)',
  'United Kingdom (GMT/BST)',
  'GCC / UAE (GMT+4)'
];

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM'];

// Helper to generate the next 10 business days (skipping Sat & Sun)
function getWorkingDays(count = 10) {
  const days = [];
  const curr = new Date();
  curr.setDate(curr.getDate() + 1);

  while (days.length < count) {
    const day = curr.getDay();
    if (day !== 0 && day !== 6) {
      days.push({
        weekday: curr.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: curr.getDate(),
        month: curr.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: curr.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        iso: curr.toISOString().split('T')[0]
      });
    }
    curr.setDate(curr.getDate() + 1);
  }
  return days;
}

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const workingDays = useMemo(() => getWorkingDays(10), []);

  // ---------------------------------------------------------------------------
  // 1. ENQUIRY FORM STATE
  // ---------------------------------------------------------------------------
  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: '',
    message: '',
    _honeypot: ''
  });
  const [enquiryErrors, setEnquiryErrors] = useState({});
  const [enquiryShaking, setEnquiryShaking] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryErrorMsg, setEnquiryErrorMsg] = useState('');

  const enquiryNameRef = useRef(null);
  const enquiryEmailRef = useRef(null);
  const enquiryWhatsappRef = useRef(null);
  const enquiryCompanyRef = useRef(null);
  const enquiryServiceRef = useRef(null);

  // ---------------------------------------------------------------------------
  // 2. CONSULTATION WIZARD STATE
  // ---------------------------------------------------------------------------
  const [consultStep, setConsultStep] = useState(1);
  const [consultDirection, setConsultDirection] = useState(1);
  const [consultData, setConsultData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    dateObj: workingDays[0],
    time: '10:30 AM',
    timezone: TIMEZONES[0],
    _honeypot: ''
  });
  const [consultErrors, setConsultErrors] = useState({});
  const [consultShaking, setConsultShaking] = useState('');
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultErrorMsg, setConsultErrorMsg] = useState('');

  const consultNameRef = useRef(null);
  const consultEmailRef = useRef(null);
  const consultWhatsappRef = useRef(null);

  // ---------------------------------------------------------------------------
  // VALIDATION HELPERS
  // ---------------------------------------------------------------------------
  const validateWhatsapp = (val) => {
    if (!val || !val.trim()) return false;
    if (!/^[0-9+\-\s]+$/.test(val)) return false;
    const digitsOnly = val.replace(/\D/g, '');
    return digitsOnly.length >= 8 && digitsOnly.length <= 15;
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validateEnquiry = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Full name is required';
    if (!data.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!validateEmail(data.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!data.whatsapp.trim()) {
      errs.whatsapp = 'WhatsApp number is required';
    } else if (!validateWhatsapp(data.whatsapp)) {
      errs.whatsapp = 'Enter a valid WhatsApp number (8–15 digits)';
    }
    if (!data.company.trim()) errs.company = 'Company name is required';
    if (!data.service) errs.service = 'Please select a required service';
    return errs;
  };

  const validateConsultStep1 = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Full name is required';
    if (!data.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!validateEmail(data.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!data.whatsapp.trim()) {
      errs.whatsapp = 'WhatsApp number is required';
    } else if (!validateWhatsapp(data.whatsapp)) {
      errs.whatsapp = 'Enter a valid WhatsApp number (8–15 digits)';
    }
    return errs;
  };

  // ---------------------------------------------------------------------------
  // ENQUIRY HANDLERS
  // ---------------------------------------------------------------------------
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiry((prev) => ({ ...prev, [name]: value }));
    if (enquiryErrors[name]) {
      setEnquiryErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEnquiryBlur = (e) => {
    const { name } = e.target;
    const errs = validateEnquiry(enquiry);
    if (errs[name]) {
      setEnquiryErrors((prev) => ({ ...prev, [name]: errs[name] }));
      setEnquiryShaking(name);
      setTimeout(() => setEnquiryShaking(''), 400);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const errs = validateEnquiry(enquiry);
    if (Object.keys(errs).length > 0) {
      setEnquiryErrors(errs);
      const firstKey = Object.keys(errs)[0];
      setEnquiryShaking(firstKey);
      setTimeout(() => setEnquiryShaking(''), 400);

      // Focus first invalid element
      if (firstKey === 'name' && enquiryNameRef.current) enquiryNameRef.current.focus();
      else if (firstKey === 'email' && enquiryEmailRef.current) enquiryEmailRef.current.focus();
      else if (firstKey === 'whatsapp' && enquiryWhatsappRef.current) enquiryWhatsappRef.current.focus();
      else if (firstKey === 'company' && enquiryCompanyRef.current) enquiryCompanyRef.current.focus();
      else if (firstKey === 'service' && enquiryServiceRef.current) enquiryServiceRef.current.focus();
      return;
    }

    if (enquiry._honeypot) {
      // Spam honeypot tripped
      setEnquirySubmitting(true);
      setTimeout(() => {
        setEnquirySubmitting(false);
        setEnquirySubmitted(true);
      }, 400);
      return;
    }

    setEnquirySubmitting(true);
    setEnquiryErrorMsg('');

    const payload = {
      type: 'enquiry',
      name: enquiry.name.trim(),
      email: enquiry.email.trim(),
      whatsapp: enquiry.whatsapp.trim(),
      company: enquiry.company.trim(),
      service: enquiry.service,
      message: enquiry.message.trim(),
      page: 'contact',
      submittedAt: new Date().toISOString()
    };

    /**
     * =========================================================================
     * ENQUIRY FORM SUBMISSION CONFIGURATION:
     * -------------------------------------------------------------------------
     * Add your Formspree/EmailJS endpoint URL to FORM_ENDPOINT in src/config/contact.js.
     * Add your CRM (HubSpot, Zoho, Zapier, Make) webhook URL to CRM_WEBHOOK in src/config/contact.js.
     * If both are blank, it triggers the mailto: fallback to ENQUIRY_EMAIL (business@crownstone.com).
     * =========================================================================
     */
    if (FORM_ENDPOINT || CRM_WEBHOOK) {
      try {
        const calls = [];
        if (FORM_ENDPOINT) {
          calls.push(
            fetch(FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(payload)
            })
          );
        }
        if (CRM_WEBHOOK) {
          calls.push(
            fetch(CRM_WEBHOOK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
          );
        }
        await Promise.all(calls);
        setEnquirySubmitted(true);
      } catch (err) {
        setEnquiryErrorMsg('Unable to submit enquiry at this time. Please retry or contact us directly.');
      } finally {
        setEnquirySubmitting(false);
      }
    } else {
      // Fallback: mailto link
      const subject = encodeURIComponent(`Website enquiry - ${enquiry.service} from ${enquiry.name}`);
      const body = encodeURIComponent(
        `WEBSITE ENQUIRY DETAILS:\n\n` +
        `Full Name: ${enquiry.name}\n` +
        `Email: ${enquiry.email}\n` +
        `WhatsApp: ${enquiry.whatsapp}\n` +
        `Company: ${enquiry.company}\n` +
        `Required Service: ${enquiry.service}\n\n` +
        `Message:\n${enquiry.message || 'N/A'}\n\n` +
        `Submitted: ${new Date().toLocaleString()}`
      );
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setEnquirySubmitting(false);
        setEnquirySubmitted(true);
      }, 500);
    }
  };

  const handleResetEnquiry = () => {
    setEnquiry({
      name: '',
      email: '',
      whatsapp: '',
      company: '',
      service: '',
      message: '',
      _honeypot: ''
    });
    setEnquiryErrors({});
    setEnquirySubmitted(false);
    setEnquiryErrorMsg('');
  };

  // ---------------------------------------------------------------------------
  // CONSULTATION HANDLERS
  // ---------------------------------------------------------------------------
  const handleConsultChange = (e) => {
    const { name, value } = e.target;
    setConsultData((prev) => ({ ...prev, [name]: value }));
    if (consultErrors[name]) {
      setConsultErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleConsultBlur = (e) => {
    const { name } = e.target;
    const errs = validateConsultStep1(consultData);
    if (errs[name]) {
      setConsultErrors((prev) => ({ ...prev, [name]: errs[name] }));
      setConsultShaking(name);
      setTimeout(() => setConsultShaking(''), 400);
    }
  };

  const handleConsultNextStep1 = () => {
    const errs = validateConsultStep1(consultData);
    if (Object.keys(errs).length > 0) {
      setConsultErrors(errs);
      const firstKey = Object.keys(errs)[0];
      setConsultShaking(firstKey);
      setTimeout(() => setConsultShaking(''), 400);

      if (firstKey === 'name' && consultNameRef.current) consultNameRef.current.focus();
      else if (firstKey === 'email' && consultEmailRef.current) consultEmailRef.current.focus();
      else if (firstKey === 'whatsapp' && consultWhatsappRef.current) consultWhatsappRef.current.focus();
      return;
    }
    setConsultErrors({});
    setConsultDirection(1);
    setConsultStep(2);
  };

  const handleConsultNextStep2 = () => {
    if (!consultData.dateObj || !consultData.time) {
      alert('Please select both a date and a time slot.');
      return;
    }
    setConsultDirection(1);
    setConsultStep(3);
  };

  const handleConsultBack = () => {
    setConsultDirection(-1);
    setConsultStep((prev) => Math.max(1, prev - 1));
  };

  const handleConsultSubmit = async () => {
    if (consultData._honeypot) {
      setConsultSubmitting(true);
      setTimeout(() => {
        setConsultSubmitting(false);
        setConsultSubmitted(true);
      }, 400);
      return;
    }

    setConsultSubmitting(true);
    setConsultErrorMsg('');

    const payload = {
      type: 'consultation',
      name: consultData.name.trim(),
      email: consultData.email.trim(),
      whatsapp: consultData.whatsapp.trim(),
      company: consultData.company.trim() || 'Not specified',
      date: consultData.dateObj.fullDate,
      time: consultData.time,
      timezone: consultData.timezone,
      duration: CONSULT_MINUTES,
      page: 'contact',
      submittedAt: new Date().toISOString()
    };

    /**
     * =========================================================================
     * CONSULTATION BOOKING SUBMISSION CONFIGURATION:
     * -------------------------------------------------------------------------
     * Add your Formspree/EmailJS endpoint URL to FORM_ENDPOINT in src/config/contact.js.
     * Add your CRM (HubSpot, Zoho, Zapier, Make) webhook URL to CRM_WEBHOOK in src/config/contact.js.
     * If both are blank, it triggers the mailto: fallback to ENQUIRY_EMAIL (business@crownstone.com).
     * =========================================================================
     */
    if (FORM_ENDPOINT || CRM_WEBHOOK) {
      try {
        const calls = [];
        if (FORM_ENDPOINT) {
          calls.push(
            fetch(FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(payload)
            })
          );
        }
        if (CRM_WEBHOOK) {
          calls.push(
            fetch(CRM_WEBHOOK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
          );
        }
        await Promise.all(calls);
        setConsultSubmitted(true);
      } catch (err) {
        setConsultErrorMsg('Unable to confirm booking at this time. Please retry or contact us directly.');
      } finally {
        setConsultSubmitting(false);
      }
    } else {
      // Fallback: mailto link
      const subject = encodeURIComponent(
        `Consultation Booking - ${consultData.name} (${consultData.dateObj.fullDate} at ${consultData.time})`
      );
      const body = encodeURIComponent(
        `FREE 15-MINUTE INTRODUCTORY CONSULTATION:\n\n` +
        `Full Name: ${consultData.name}\n` +
        `Email: ${consultData.email}\n` +
        `WhatsApp: ${consultData.whatsapp}\n` +
        `Company: ${consultData.company || 'Not provided'}\n\n` +
        `Requested Date: ${consultData.dateObj.fullDate}\n` +
        `Time: ${consultData.time} (${consultData.timezone})\n` +
        `Duration: ${CONSULT_MINUTES} minutes\n\n` +
        `Submitted: ${new Date().toLocaleString()}`
      );
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setConsultSubmitting(false);
        setConsultSubmitted(true);
      }, 500);
    }
  };

  const handleResetConsult = () => {
    setConsultStep(1);
    setConsultDirection(1);
    setConsultData({
      name: '',
      email: '',
      whatsapp: '',
      company: '',
      dateObj: workingDays[0],
      time: '10:30 AM',
      timezone: TIMEZONES[0],
      _honeypot: ''
    });
    setConsultErrors({});
    setConsultSubmitted(false);
    setConsultErrorMsg('');
  };

  // Step slide animation variants
  const stepVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      opacity: 0
    })
  };

  return (
    <div className="page-wrapper contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with Crownstone Advisory for expert Quantity Surveying, Contract & Commercial Management, and Claims Advisory in Sri Lanka, the GCC, and the UK."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="CONTACT US"
        title="Get in Touch"
        bgImage={`${import.meta.env.BASE_URL}assets/site.jpg`}
      />

      {/* 2. Main Two-Column Upper Section: Enquiry Form (Left) & Free Consultation (Right) */}
      <section className="section bg-ivory contact-main-section">
        <div className="container">
          {/* Intro block */}
          <Reveal className="contact-intro-block">
            <span className="eyebrow-badge">CONTACT US</span>
            <h2 className="section-title">Tell us about your project</h2>
            <p className="contact-intro-text">
              Send an enquiry or book a free 15-minute introductory consultation. We reply with commercial clarity, before issues escalate.
            </p>
          </Reveal>

          <div className="contact-hero-grid">
            {/* LEFT CARD: Enquiry Form */}
            <Reveal delay={0.1}>
              <div className="enquiry-card">
                <span className="card-eyebrow card-eyebrow-gold">ENQUIRY FORM</span>
                <h3 className="card-heading-title">Send us an enquiry</h3>
                <p className="card-note-muted">Fields marked * are required.</p>

                {enquirySubmitted ? (
                  <motion.div
                    className="form-success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="success-circle">
                      <Check size={32} strokeWidth={2.5} />
                    </div>
                    <h4 className="success-title">Thank you, {enquiry.name}.</h4>
                    <p className="success-msg">
                      Your enquiry has been received. We will contact you on WhatsApp or email shortly.
                    </p>
                    <button
                      type="button"
                      className="success-reset-btn"
                      onClick={handleResetEnquiry}
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} noValidate className="enquiry-form">
                    {/* Honeypot anti-spam field */}
                    <input
                      type="text"
                      name="_honeypot"
                      value={enquiry._honeypot}
                      onChange={handleEnquiryChange}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Full Name */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.04, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-name" className="form-label">
                        Full name <span className="required-star">*</span>
                      </label>
                      <input
                        ref={enquiryNameRef}
                        type="text"
                        id="enquiry-name"
                        name="name"
                        value={enquiry.name}
                        onChange={handleEnquiryChange}
                        onBlur={handleEnquiryBlur}
                        placeholder="Your full name"
                        aria-invalid={enquiryErrors.name ? 'true' : 'false'}
                        className={`form-input ${enquiryErrors.name ? 'input-error' : ''} ${
                          enquiryShaking === 'name' ? 'field-shake' : ''
                        }`}
                        required
                      />
                      {enquiryErrors.name && (
                        <span className="field-error">{enquiryErrors.name}</span>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-email" className="form-label">
                        Email <span className="required-star">*</span>
                      </label>
                      <input
                        ref={enquiryEmailRef}
                        type="email"
                        id="enquiry-email"
                        name="email"
                        value={enquiry.email}
                        onChange={handleEnquiryChange}
                        onBlur={handleEnquiryBlur}
                        placeholder="name@company.com"
                        aria-invalid={enquiryErrors.email ? 'true' : 'false'}
                        className={`form-input ${enquiryErrors.email ? 'input-error' : ''} ${
                          enquiryShaking === 'email' ? 'field-shake' : ''
                        }`}
                        required
                      />
                      {enquiryErrors.email && (
                        <span className="field-error">{enquiryErrors.email}</span>
                      )}
                    </motion.div>

                    {/* WhatsApp */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.12, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-whatsapp" className="form-label">
                        WhatsApp number <span className="required-star">*</span>
                      </label>
                      <input
                        ref={enquiryWhatsappRef}
                        type="tel"
                        id="enquiry-whatsapp"
                        name="whatsapp"
                        value={enquiry.whatsapp}
                        onChange={handleEnquiryChange}
                        onBlur={handleEnquiryBlur}
                        placeholder="+94 77 000 0000"
                        aria-invalid={enquiryErrors.whatsapp ? 'true' : 'false'}
                        className={`form-input ${enquiryErrors.whatsapp ? 'input-error' : ''} ${
                          enquiryShaking === 'whatsapp' ? 'field-shake' : ''
                        }`}
                        required
                      />
                      {enquiryErrors.whatsapp && (
                        <span className="field-error">{enquiryErrors.whatsapp}</span>
                      )}
                    </motion.div>

                    {/* Company */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.16, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-company" className="form-label">
                        Company <span className="required-star">*</span>
                      </label>
                      <input
                        ref={enquiryCompanyRef}
                        type="text"
                        id="enquiry-company"
                        name="company"
                        value={enquiry.company}
                        onChange={handleEnquiryChange}
                        onBlur={handleEnquiryBlur}
                        placeholder="Company name"
                        aria-invalid={enquiryErrors.company ? 'true' : 'false'}
                        className={`form-input ${enquiryErrors.company ? 'input-error' : ''} ${
                          enquiryShaking === 'company' ? 'field-shake' : ''
                        }`}
                        required
                      />
                      {enquiryErrors.company && (
                        <span className="field-error">{enquiryErrors.company}</span>
                      )}
                    </motion.div>

                    {/* Required Consultancy Service */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-service" className="form-label">
                        Required consultancy service <span className="required-star">*</span>
                      </label>
                      <select
                        ref={enquiryServiceRef}
                        id="enquiry-service"
                        name="service"
                        value={enquiry.service}
                        onChange={handleEnquiryChange}
                        onBlur={handleEnquiryBlur}
                        aria-invalid={enquiryErrors.service ? 'true' : 'false'}
                        className={`form-input form-select ${
                          enquiryErrors.service ? 'input-error' : ''
                        } ${enquiryShaking === 'service' ? 'field-shake' : ''}`}
                        required
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {enquiryErrors.service && (
                        <span className="field-error">{enquiryErrors.service}</span>
                      )}
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      className="form-field-group"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.24, duration: 0.35 }}
                    >
                      <label htmlFor="enquiry-message" className="form-label">
                        Message (optional)
                      </label>
                      <textarea
                        id="enquiry-message"
                        name="message"
                        rows={3}
                        value={enquiry.message}
                        onChange={handleEnquiryChange}
                        placeholder="Briefly describe your project..."
                        className="form-input form-textarea"
                      />
                    </motion.div>

                    {enquiryErrorMsg && (
                      <div className="field-error" style={{ marginBottom: '14px' }}>
                        {enquiryErrorMsg}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={enquirySubmitting}
                      className="btn btn-primary btn-full-gold"
                    >
                      {enquirySubmitting ? (
                        <>
                          <span className="submit-spinner" aria-hidden="true" />
                          <span>Sending enquiry...</span>
                        </>
                      ) : (
                        'Send Enquiry'
                      )}
                    </button>

                    <p className="form-footer-note">
                      Your enquiry goes straight to our business team and is logged in our CRM.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* RIGHT CARD: Book a Free Consultation */}
            <Reveal delay={0.2}>
              <div className="consultation-card">
                <span className="card-eyebrow card-eyebrow-amber">FREE CONSULTATION</span>
                <h3 className="card-heading-title">Book a free consultation</h3>
                <p className="card-note-muted">
                  A 15-minute introductory call with a Chartered Quantity Surveyor.
                </p>

                {consultSubmitted ? (
                  <motion.div
                    className="form-success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="success-circle">
                      <Check size={32} strokeWidth={2.5} />
                    </div>
                    <h4 className="success-title">Your consultation is booked!</h4>
                    <div className="consult-summary-card" style={{ width: '100%', maxWidth: '380px' }}>
                      <div className="consult-summary-row">
                        <span className="consult-summary-label">Name:</span>
                        <span className="consult-summary-val">{consultData.name}</span>
                      </div>
                      <div className="consult-summary-row">
                        <span className="consult-summary-label">Date:</span>
                        <span className="consult-summary-val">{consultData.dateObj.fullDate}</span>
                      </div>
                      <div className="consult-summary-row">
                        <span className="consult-summary-label">Time:</span>
                        <span className="consult-summary-val">
                          {consultData.time} ({consultData.timezone})
                        </span>
                      </div>
                    </div>
                    <p className="success-msg">
                      You will receive a confirmation by email and WhatsApp.
                    </p>
                    <button
                      type="button"
                      className="success-reset-btn"
                      onClick={handleResetConsult}
                    >
                      Book another consultation
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* 3-Step Indicator Bar */}
                    <div className="consult-step-nav" aria-label="Booking steps">
                      <div className={`consult-step-item ${consultStep === 1 ? 'active' : ''} ${consultStep > 1 ? 'completed' : ''}`}>
                        <span className="consult-step-num">
                          {consultStep > 1 ? <Check size={14} /> : 1}
                        </span>
                        <span>Your details</span>
                      </div>
                      <div className={`consult-step-divider ${consultStep >= 2 ? 'filled' : ''}`} />
                      <div className={`consult-step-item ${consultStep === 2 ? 'active' : ''} ${consultStep > 2 ? 'completed' : ''}`}>
                        <span className="consult-step-num">
                          {consultStep > 2 ? <Check size={14} /> : 2}
                        </span>
                        <span>Date & time</span>
                      </div>
                      <div className={`consult-step-divider ${consultStep >= 3 ? 'filled' : ''}`} />
                      <div className={`consult-step-item ${consultStep === 3 ? 'active' : ''}`}>
                        <span className="consult-step-num">3</span>
                        <span>Confirm</span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait" custom={consultDirection}>
                      {/* STEP 1: YOUR DETAILS */}
                      {consultStep === 1 && (
                        <motion.div
                          key="step1"
                          custom={consultDirection}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="consult-step-box">
                            <h4 className="consult-step-box-title">Step 1 - Your details</h4>

                            {/* Full Name */}
                            <div className="form-field-group">
                              <label htmlFor="consult-name" className="form-label">
                                Full name <span className="required-star">*</span>
                              </label>
                              <input
                                ref={consultNameRef}
                                type="text"
                                id="consult-name"
                                name="name"
                                value={consultData.name}
                                onChange={handleConsultChange}
                                onBlur={handleConsultBlur}
                                placeholder="Your full name"
                                aria-invalid={consultErrors.name ? 'true' : 'false'}
                                className={`form-input ${consultErrors.name ? 'input-error' : ''} ${
                                  consultShaking === 'name' ? 'field-shake' : ''
                                }`}
                                required
                              />
                              {consultErrors.name && (
                                <span className="field-error">{consultErrors.name}</span>
                              )}
                            </div>

                            {/* Email */}
                            <div className="form-field-group">
                              <label htmlFor="consult-email" className="form-label">
                                Email <span className="required-star">*</span>
                              </label>
                              <input
                                ref={consultEmailRef}
                                type="email"
                                id="consult-email"
                                name="email"
                                value={consultData.email}
                                onChange={handleConsultChange}
                                onBlur={handleConsultBlur}
                                placeholder="name@company.com"
                                aria-invalid={consultErrors.email ? 'true' : 'false'}
                                className={`form-input ${consultErrors.email ? 'input-error' : ''} ${
                                  consultShaking === 'email' ? 'field-shake' : ''
                                }`}
                                required
                              />
                              {consultErrors.email && (
                                <span className="field-error">{consultErrors.email}</span>
                              )}
                            </div>

                            {/* WhatsApp */}
                            <div className="form-field-group">
                              <label htmlFor="consult-whatsapp" className="form-label">
                                WhatsApp number <span className="required-star">*</span>
                              </label>
                              <input
                                ref={consultWhatsappRef}
                                type="tel"
                                id="consult-whatsapp"
                                name="whatsapp"
                                value={consultData.whatsapp}
                                onChange={handleConsultChange}
                                onBlur={handleConsultBlur}
                                placeholder="+94 77 000 0000"
                                aria-invalid={consultErrors.whatsapp ? 'true' : 'false'}
                                className={`form-input ${consultErrors.whatsapp ? 'input-error' : ''} ${
                                  consultShaking === 'whatsapp' ? 'field-shake' : ''
                                }`}
                                required
                              />
                              {consultErrors.whatsapp && (
                                <span className="field-error">{consultErrors.whatsapp}</span>
                              )}
                            </div>

                            {/* Company */}
                            <div className="form-field-group" style={{ marginBottom: 0 }}>
                              <label htmlFor="consult-company" className="form-label">
                                Company (optional)
                              </label>
                              <input
                                type="text"
                                id="consult-company"
                                name="company"
                                value={consultData.company}
                                onChange={handleConsultChange}
                                placeholder="Company name"
                                className="form-input"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleConsultNextStep1}
                            className="btn btn-primary btn-full-gold"
                          >
                            <span>Next: Pick Date & Time</span>
                            <ArrowRight size={16} />
                          </button>
                        </motion.div>
                      )}

                      {/* STEP 2: DATE & TIME */}
                      {consultStep === 2 && (
                        <motion.div
                          key="step2"
                          custom={consultDirection}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="consult-step-box">
                            <h4 className="consult-step-box-title">Step 2 - Pick a date and time</h4>

                            {/* Date Chips */}
                            <label className="chips-label">Select Date (Next 10 working days):</label>
                            <div className="date-chips-grid">
                              {workingDays.map((day) => {
                                const isSelected = consultData.dateObj?.iso === day.iso;
                                return (
                                  <button
                                    key={day.iso}
                                    type="button"
                                    onClick={() =>
                                      setConsultData((prev) => ({ ...prev, dateObj: day }))
                                    }
                                    className={`date-chip ${isSelected ? 'selected' : ''}`}
                                    aria-pressed={isSelected}
                                  >
                                    <span className="date-chip-weekday">{day.weekday}</span>
                                    <span className="date-chip-day">{day.dayNum}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Time Slot Chips */}
                            <label className="chips-label">Select Time Slot:</label>
                            <div className="time-chips-grid">
                              {TIME_SLOTS.map((slot) => {
                                const isSelected = consultData.time === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() =>
                                      setConsultData((prev) => ({ ...prev, time: slot }))
                                    }
                                    className={`time-chip ${isSelected ? 'selected' : ''}`}
                                    aria-pressed={isSelected}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Timezone Select */}
                            <div className="form-field-group" style={{ marginBottom: '10px' }}>
                              <label htmlFor="consult-timezone" className="form-label" style={{ fontSize: '13px' }}>
                                Time zone:
                              </label>
                              <select
                                id="consult-timezone"
                                name="timezone"
                                value={consultData.timezone}
                                onChange={handleConsultChange}
                                className="form-input form-select"
                                style={{ minHeight: '44px', padding: '8px 14px' }}
                              >
                                {TIMEZONES.map((tz) => (
                                  <option key={tz} value={tz}>
                                    {tz}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="consult-meta-row">
                              <span className="consult-duration-tag">
                                <Clock size={13} />
                                <span>{CONSULT_MINUTES} minutes</span>
                              </span>
                              <span>Direct Chartered QS Call</span>
                            </div>
                          </div>

                          <div className="step-buttons-row">
                            <button
                              type="button"
                              onClick={handleConsultBack}
                              className="btn btn-back"
                            >
                              <ArrowLeft size={16} />
                              <span>Back</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleConsultNextStep2}
                              className="btn btn-primary"
                              style={{ flex: 1.5 }}
                            >
                              <span>Next: Review</span>
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: CONFIRM */}
                      {consultStep === 3 && (
                        <motion.div
                          key="step3"
                          custom={consultDirection}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="consult-step-box">
                            <h4 className="consult-step-box-title">Step 3 - Confirm your consultation</h4>

                            <div className="consult-summary-card">
                              <div className="consult-summary-row">
                                <span className="consult-summary-label">Name:</span>
                                <span className="consult-summary-val">{consultData.name}</span>
                              </div>
                              <div className="consult-summary-row">
                                <span className="consult-summary-label">Email:</span>
                                <span className="consult-summary-val">{consultData.email}</span>
                              </div>
                              <div className="consult-summary-row">
                                <span className="consult-summary-label">WhatsApp:</span>
                                <span className="consult-summary-val">{consultData.whatsapp}</span>
                              </div>
                              {consultData.company && (
                                <div className="consult-summary-row">
                                  <span className="consult-summary-label">Company:</span>
                                  <span className="consult-summary-val">{consultData.company}</span>
                                </div>
                              )}
                              <div className="consult-summary-row">
                                <span className="consult-summary-label">Date & Time:</span>
                                <span className="consult-summary-val" style={{ color: '#7A5A00' }}>
                                  {consultData.dateObj.fullDate} at {consultData.time}
                                </span>
                              </div>
                              <div className="consult-summary-row">
                                <span className="consult-summary-label">Time zone:</span>
                                <span className="consult-summary-val">{consultData.timezone}</span>
                              </div>
                              <div className="consult-summary-highlight">
                                <Clock size={16} />
                                <span>15-minute introductory call with a Chartered Quantity Surveyor</span>
                              </div>
                            </div>

                            {consultErrorMsg && (
                              <div className="field-error" style={{ marginBottom: '12px' }}>
                                {consultErrorMsg}
                              </div>
                            )}

                            <div className="step-buttons-row">
                              <button
                                type="button"
                                onClick={handleConsultBack}
                                className="btn btn-back"
                              >
                                <ArrowLeft size={16} />
                                <span>Back</span>
                              </button>
                              <button
                                type="button"
                                disabled={consultSubmitting}
                                onClick={handleConsultSubmit}
                                className="btn btn-primary"
                                style={{ flex: 2 }}
                              >
                                {consultSubmitting ? (
                                  <>
                                    <span className="submit-spinner" aria-hidden="true" />
                                    <span>Confirming...</span>
                                  </>
                                ) : (
                                  'Confirm Consultation'
                                )}
                              </button>
                            </div>

                            <p className="form-footer-note">
                              You will receive a confirmation by email and WhatsApp.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Lower Cream Section: Contact Details + UK Branch Card (LEFT) & Email Directory (RIGHT), then Map */}
      <section className="section contact-directory-section">
        <div className="container">
          <div className="contact-details-grid">
            {/* LEFT COLUMN: Contact Details Card + UK Branch Card */}
            <div className="contact-details-left-col">
              <Reveal delay={0.1}>
                <div className="contact-card contact-details-card">
                  <h3 className="card-heading-title" style={{ fontSize: '24px', marginBottom: '20px' }}>
                    Contact details
                  </h3>

                  <div className="contact-detail-group">
                    <span className="contact-detail-label">Mobile</span>
                    <a href={`tel:${PHONE_LINK}`} className="contact-detail-value contact-phone-link">
                      {PHONE_DISPLAY}
                    </a>
                  </div>

                  <div className="contact-detail-group">
                    <span className="contact-detail-label">Email</span>
                    <a href={`mailto:${PRIMARY_EMAIL}`} className="contact-detail-value contact-email-link">
                      {PRIMARY_EMAIL}
                    </a>
                  </div>

                  <div className="contact-detail-group">
                    <span className="contact-detail-label">Address</span>
                    <p className="contact-detail-value">{ADDRESS}</p>
                  </div>

                  <div className="contact-badge-wrap">
                    <span className="contact-pill-badge">{BRAND.practice}</span>
                  </div>

                  {/* QR Code Slot (renders only if qr.png exists without placeholder) */}
                  <div className="contact-qr-wrapper">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/qr.png`}
                      alt="Crownstone Advisory Contact QR Code"
                      className="qr-img"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* UK Branch Contact Card */}
              <Reveal delay={0.2}>
                <div className="uk-branch-card">
                  <motion.div
                    className="uk-avatar"
                    initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                    whileInView={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <span>KB</span>
                  </motion.div>
                  <div className="uk-branch-info">
                    <span className="uk-branch-eyebrow">{UK_CONTACT.branch}</span>
                    <h4 className="uk-branch-name">{UK_CONTACT.name}</h4>
                    <span className="uk-branch-role">{UK_CONTACT.role}</span>
                    <div className="uk-branch-links">
                      <a href={`tel:${UK_CONTACT.phoneLink}`} className="uk-contact-link">
                        <Phone size={14} className="uk-contact-icon" />
                        <span>{UK_CONTACT.phone}</span>
                      </a>
                      <a href={`mailto:${UK_CONTACT.email}`} className="uk-contact-link">
                        <Mail size={14} className="uk-contact-icon" />
                        <span>{UK_CONTACT.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Email Directory */}
            <div className="contact-details-right-col">
              <Reveal delay={0.15}>
                <div className="email-directory-card">
                  <span className="card-eyebrow card-eyebrow-gold">EMAIL DIRECTORY</span>
                  <h3 className="card-heading-title" style={{ fontSize: '24px', marginBottom: '16px' }}>
                    Reach the right team
                  </h3>

                  <ul className="email-directory-list">
                    {DEPARTMENTS.map((dept, idx) => (
                      <motion.li
                        key={dept.label}
                        className="email-directory-item"
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                        whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx, duration: 0.35 }}
                      >
                        <div className="email-directory-icon-wrap" aria-hidden="true">
                          <Mail size={16} />
                        </div>
                        <div className="email-directory-content">
                          <span className="email-directory-label">{dept.label}</span>
                          <a href={`mailto:${dept.email}`} className="email-directory-email">
                            {dept.email}
                          </a>
                          <span className="email-directory-purpose">{dept.purpose}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

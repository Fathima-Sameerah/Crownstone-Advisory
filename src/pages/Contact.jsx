import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail } from 'lucide-react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import ImageWithFallback from '../components/ImageWithFallback';
import { BRAND } from '../data/content';
import {
  PRIMARY_EMAIL,
  PHONE_DISPLAY,
  PHONE_LINK,
  ADDRESS,
  DEPARTMENTS
} from '../config/contact';

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  // Form State
  const [formData, setFormData] = useState({
    department: DEPARTMENTS[0].label,
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.department) {
      errs.department = 'Please select a department.';
    }
    if (!formData.name.trim()) {
      errs.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    const selectedDept = DEPARTMENTS.find((d) => d.label === formData.department) || DEPARTMENTS[0];
    const targetEmail = selectedDept.email;
    const emailSubject = `Website enquiry - ${selectedDept.label}`;

    /**
     * =========================================================================
     * FORM SUBMISSION ENDPOINT CONFIGURATION:
     * -------------------------------------------------------------------------
     * To connect Formspree, replace the FORMSPREE_ENDPOINT below with your ID:
     * e.g., const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqkenvba";
     *
     * Or for EmailJS: integrate emailjs.sendForm(...) with your Service ID and Template ID.
     * =========================================================================
     */
    const FORMSPREE_ENDPOINT = ""; // <-- ADD YOUR FORMSPREE OR EMAILJS ENDPOINT URL HERE

    if (FORMSPREE_ENDPOINT) {
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            department_email: targetEmail,
            _subject: emailSubject
          })
        });

        if (response.ok) {
          setSubmitted(true);
          setStatusMessage("Thank you! Your inquiry has been sent successfully. We will get back to you shortly.");
          setFormData({ department: DEPARTMENTS[0].label, name: '', email: '', phone: '', message: '' });
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        // Fallback to mailto
        window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(
          `Department: ${selectedDept.label}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
        )}`;
        setSubmitted(true);
        setStatusMessage("Thank you! An email draft has been prepared to send your inquiry.");
      }
    } else {
      // Direct simulation & mailto fallback
      setTimeout(() => {
        setSubmitted(true);
        setStatusMessage(
          "Thank you for contacting Crownstone Advisory. Your message has been received and our team will get in touch with you promptly."
        );
        // Fallback mailto trigger
        window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(
          `Department: ${selectedDept.label}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
        )}`;
        setFormData({ department: DEPARTMENTS[0].label, name: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
      }, 600);
    }
  };

  return (
    <div className="page-wrapper contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with Crownstone Advisory for expert Quantity Surveying, Contract & Commercial Management, and Claims Advisory in Sri Lanka and the GCC."
      />

      {/* 1. Banner */}
      <Banner
        eyebrow="CONTACT US"
        title="Get in Touch"
        bgImage={`${import.meta.env.BASE_URL}assets/site.jpg`}
      />

      {/* 2. Main Two-Column Contact Section */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="contact-grid">
            {/* Left Card: Send a Message Form */}
            <Reveal className="contact-form-column">
              <div className="contact-card send-message-card">
                <h2 className="contact-card-heading">Send a message</h2>

                {submitted && (
                  <motion.div
                    className="form-success-banner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                  >
                    <span className="success-icon">✓</span>
                    <p>{statusMessage}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  {/* Hidden field for backend/Formspree/EmailJS routing */}
                  <input
                    type="hidden"
                    name="department_email"
                    value={(DEPARTMENTS.find((d) => d.label === formData.department) || DEPARTMENTS[0]).email}
                  />

                  {/* Department Field */}
                  <motion.div
                    className="form-field-group"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.04, duration: 0.4 }}
                  >
                    <label htmlFor="department" className="form-label">
                      Department <span className="required-star">*</span>
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`form-input form-select ${errors.department ? 'input-error' : ''}`}
                      aria-required="true"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.label} value={dept.label}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {errors.department && <span className="field-error">{errors.department}</span>}
                  </motion.div>

                  {/* Name Field */}
                  <motion.div
                    className="form-field-group"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                  >
                    <label htmlFor="name" className="form-label">
                      Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      aria-required="true"
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    className="form-field-group"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.16, duration: 0.4 }}
                  >
                    <label htmlFor="email" className="form-label">
                      Email <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      aria-required="true"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div
                    className="form-field-group"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.24, duration: 0.4 }}
                  >
                    <label htmlFor="phone" className="form-label">
                      Phone <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className={`form-input ${errors.phone ? 'input-error' : ''}`}
                      aria-required="true"
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    className="form-field-group"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.32, duration: 0.4 }}
                  >
                    <label htmlFor="message" className="form-label">
                      Message <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or commercial advisory needs..."
                      className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                      aria-required="true"
                    />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </motion.div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary form-submit-btn"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>

            {/* Right Card: Contact Details + QR Code + Email Directory + Google Map */}
            <div className="contact-details-column">
              <Reveal delay={0.2}>
                <div className="contact-card contact-details-card">
                  <h2 className="contact-card-heading">Contact details</h2>

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

                  {/* QR Code Slot */}
                  <div className="contact-qr-wrapper">
                    <div className="qr-box">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/qr.png`}
                        alt="Crownstone Advisory Contact QR Code"
                        className="qr-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = document.getElementById('qr-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div id="qr-placeholder" className="qr-placeholder" style={{ display: 'none' }}>
                        <span>[QR code]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Email Directory Card */}
              <Reveal delay={0.25}>
                <div className="contact-card email-directory-card">
                  <h2 className="contact-card-heading">Email Directory</h2>
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

              {/* Embedded Google Maps */}
              <Reveal delay={0.3} className="contact-map-wrapper">
                <div className="map-frame-card">
                  <iframe
                    title="Crownstone Advisory Location - Muthtagama, Kandy, Sri Lanka"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.545731110543!2d80.6063!3d7.2917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498abc%3A0x123456789!2sMuthtagama%2C%20Kandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1698500000000!5m2!1sen!2slk"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="map-iframe"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Reveal from '../components/Reveal';
import FocusBand from '../components/FocusBand';
import IconCircle from '../components/IconCircle';
import { CAREERS_EMAIL, CAREERS_ENDPOINT, MAX_CV_MB } from '../config/careers';

const POSITIONS = [
  'Junior Quantity Surveyor (QS)',
  'Graduate Internship – Quantity Surveying'
];

const CURRENCIES = ['LKR', 'USD', 'AED', 'QAR', 'SAR', 'GBP', 'EUR'];

const NOTICE_PERIODS = [
  'Immediate',
  '1 week',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months',
  'Other'
];

const JOB_OPENINGS = [
  {
    id: 1,
    num: '1',
    icon: 'HardHat',
    title: 'Junior Quantity Surveyor (QS)',
    requirements: [
      'Bachelor’s Degree or Diploma in Quantity Surveying or a related construction discipline.',
      '0–2 years of relevant industry experience.',
      'Basic knowledge of quantity take-offs, BOQ preparation, cost estimation, and tender documentation.',
      'Familiarity with MS Excel, AutoCAD, and quantity surveying software would be advantageous.',
      'Good communication, analytical, and organisational skills.',
      'Willingness to learn and work collaboratively within a professional consultancy environment.'
    ]
  },
  {
    id: 2,
    num: '2',
    icon: 'GraduationCap',
    title: 'Graduate Internship – Quantity Surveying',
    requirements: [
      'Recent graduate or final-year undergraduate pursuing a Degree or Diploma in Quantity Surveying.',
      'Basic understanding of construction measurement, cost estimation, and contract administration.',
      'Proficiency in MS Office applications, particularly Excel.',
      'Strong willingness to learn, take initiative, and develop professional skills.',
      'Good interpersonal, communication, and teamwork skills.',
      'Previous work experience is not required.'
    ]
  }
];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Careers() {
  const shouldReduceMotion = useReducedMotion();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    currentSalaryCurrency: 'LKR',
    currentSalaryAmount: '',
    expectedSalaryCurrency: 'LKR',
    expectedSalaryAmount: '',
    salaryPeriod: 'Per month',
    noticePeriod: '',
    _honey: ''
  });

  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [shakingField, setShakingField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Field Refs for Auto-Focus on Validation Error
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const positionRef = useRef(null);
  const currentSalaryRef = useRef(null);
  const expectedSalaryRef = useRef(null);
  const noticePeriodRef = useRef(null);
  const cvDropzoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle "Apply Now" button click on job cards
  const handleApplyNow = (positionTitle) => {
    setFormData((prev) => ({ ...prev, position: positionTitle }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.position;
      return updated;
    });

    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
    // Give focus to the form after scrolling
    setTimeout(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }, 400);
  };

  // Validation function
  const validateField = (fieldName, value, extraData = {}) => {
    switch (fieldName) {
      case 'name':
        if (!value || !value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Please enter your complete name';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'position':
        if (!value) return 'Please select a position';
        return '';
      case 'currentSalary':
        if (value === undefined || value === null || value.toString().trim() === '') {
          return 'Current salary is required (enter 0 if not applicable)';
        }
        return '';
      case 'expectedSalary':
        if (value === undefined || value === null || value.toString().trim() === '') {
          return 'Salary expectation is required';
        }
        return '';
      case 'noticePeriod':
        if (!value) return 'Please select your notice period';
        return '';
      case 'cv':
        if (!extraData.file) return 'Please upload your CV (PDF, DOC, or DOCX up to 5MB)';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    let err = '';
    if (field === 'name') err = validateField('name', formData.name);
    else if (field === 'email') err = validateField('email', formData.email);
    else if (field === 'position') err = validateField('position', formData.position);
    else if (field === 'currentSalary') err = validateField('currentSalary', formData.currentSalaryAmount);
    else if (field === 'expectedSalary') err = validateField('expectedSalary', formData.expectedSalaryAmount);
    else if (field === 'noticePeriod') err = validateField('noticePeriod', formData.noticePeriod);

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  // File Upload Handlers
  const handleFileSelect = (file) => {
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setErrors((prev) => ({
        ...prev,
        cv: 'Invalid file format. Please upload a PDF, DOC, or DOCX document.'
      }));
      setShakingField('cv');
      setTimeout(() => setShakingField(''), 450);
      return;
    }

    const maxBytes = MAX_CV_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        cv: `File exceeds maximum limit of ${MAX_CV_MB}MB. Please upload a smaller file.`
      }));
      setShakingField('cv');
      setTimeout(() => setShakingField(''), 450);
      return;
    }

    setCvFile(file);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.cv;
      return updated;
    });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Honeypot check
    if (formData._honey) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 500);
      return;
    }

    // Validate all fields
    const newErrors = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const posErr = validateField('position', formData.position);
    if (posErr) newErrors.position = posErr;

    const currSalErr = validateField('currentSalary', formData.currentSalaryAmount);
    if (currSalErr) newErrors.currentSalary = currSalErr;

    const expSalErr = validateField('expectedSalary', formData.expectedSalaryAmount);
    if (expSalErr) newErrors.expectedSalary = expSalErr;

    const noticeErr = validateField('noticePeriod', formData.noticePeriod);
    if (noticeErr) newErrors.noticePeriod = noticeErr;

    const cvErr = validateField('cv', null, { file: cvFile });
    if (cvErr) newErrors.cv = cvErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      setShakingField(firstKey);
      setTimeout(() => setShakingField(''), 450);

      // Focus first error field
      if (firstKey === 'name' && nameRef.current) nameRef.current.focus();
      else if (firstKey === 'email' && emailRef.current) emailRef.current.focus();
      else if (firstKey === 'position' && positionRef.current) positionRef.current.focus();
      else if (firstKey === 'currentSalary' && currentSalaryRef.current) currentSalaryRef.current.focus();
      else if (firstKey === 'expectedSalary' && expectedSalaryRef.current) expectedSalaryRef.current.focus();
      else if (firstKey === 'noticePeriod' && noticePeriodRef.current) noticePeriodRef.current.focus();
      else if (firstKey === 'cv' && cvDropzoneRef.current) cvDropzoneRef.current.focus();

      return;
    }

    setIsSubmitting(true);

    const periodLabel = formData.salaryPeriod.toLowerCase();
    const formattedCurrentSalary =
      formData.currentSalaryAmount === '0'
        ? '0 (Not applicable)'
        : `${formData.currentSalaryCurrency} ${formData.currentSalaryAmount} ${periodLabel}`;
    const formattedExpectedSalary = `${formData.expectedSalaryCurrency} ${formData.expectedSalaryAmount} ${periodLabel}`;

    const submissionData = new FormData();
    submissionData.append('name', formData.name.trim());
    submissionData.append('email', formData.email.trim());
    submissionData.append('position', formData.position);
    submissionData.append('current_salary', formattedCurrentSalary);
    submissionData.append('expected_salary', formattedExpectedSalary);
    submissionData.append('notice_period', formData.noticePeriod);
    submissionData.append('_subject', `Application: ${formData.position} - ${formData.name.trim()}`);
    submissionData.append('_template', 'table');
    submissionData.append('_captcha', 'false');
    submissionData.append('_honey', '');

    if (cvFile) {
      submissionData.append('attachment', cvFile);
    }

    try {
      const response = await fetch(CAREERS_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: submissionData
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback via iframe form submission or mailto
        triggerHiddenIframeFallback(formattedCurrentSalary, formattedExpectedSalary);
      }
    } catch (err) {
      // Network/CORS fallback
      triggerHiddenIframeFallback(formattedCurrentSalary, formattedExpectedSalary);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerHiddenIframeFallback = (currentSal, expectedSal) => {
    try {
      const form = document.createElement('form');
      form.action = `https://formsubmit.co/${CAREERS_EMAIL}`;
      form.method = 'POST';
      form.enctype = 'multipart/form-data';
      form.target = 'careers_formsubmit_iframe';
      form.style.display = 'none';

      const fields = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        position: formData.position,
        current_salary: currentSal,
        expected_salary: expectedSal,
        notice_period: formData.noticePeriod,
        _subject: `Application: ${formData.position} - ${formData.name.trim()}`,
        _template: 'table',
        _captcha: 'false',
        _honey: ''
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setIsSubmitted(true);
    } catch {
      setSubmitError(
        'Unable to send application automatically. Please retry or email your CV directly to careers@crownstone.com.'
      );
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      currentSalaryCurrency: 'LKR',
      currentSalaryAmount: '',
      expectedSalaryCurrency: 'LKR',
      expectedSalaryAmount: '',
      salaryPeriod: 'Per month',
      noticePeriod: '',
      _honey: ''
    });
    setCvFile(null);
    setErrors({});
    setIsSubmitted(false);
    setSubmitError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page-wrapper careers-page">
      <SEO
        title="Careers | Crownstone Advisory"
        description="Join Crownstone Advisory. Explore open positions for Junior Quantity Surveyor and Graduate Internship in our Sri Lanka and GCC practice."
      />

      {/* Hidden iframe for fallback form submission */}
      <iframe
        name="careers_formsubmit_iframe"
        id="careers_formsubmit_iframe"
        style={{ display: 'none' }}
        title="Form Submission Target"
      />

      {/* a) Banner */}
      <Banner
        eyebrow="CAREERS"
        title="Careers at Crownstone Advisory"
        bgImage={`${import.meta.env.BASE_URL}assets/team.jpg`}
      />

      {/* b) Intro Section */}
      <section className="section bg-ivory">
        <div className="container">
          <Reveal className="careers-intro-wrap" style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title">Build Your Career With Us</h2>
            <p className="body-text" style={{ fontSize: 17, lineHeight: 1.7, marginTop: 16 }}>
              Crownstone Advisory is committed to developing the next generation of construction professionals. We welcome motivated, enthusiastic, and talented individuals who are passionate about quantity surveying, cost management, and construction consultancy.
            </p>
            <p className="body-text" style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-navy)', marginTop: 14 }}>
              We are currently accepting applications for the following positions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* c) Open Positions */}
      <section className="section bg-cream" id="open-positions">
        <div className="container">
          <div className="careers-jobs-grid">
            {JOB_OPENINGS.map((job) => (
              <Reveal key={job.id} delay={job.id * 0.1}>
                <div className="job-card">
                  <div className="job-card-header">
                    <IconCircle iconName={job.icon} size={60} />
                    <span className="job-card-num">{job.num}</span>
                  </div>

                  <h3 className="job-card-title">{job.title}</h3>

                  <div className="job-req-heading">Minimum Requirements:</div>

                  <ul className="job-req-list">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="job-req-item">
                        <span className="gold-dot-bullet" aria-hidden="true" />
                        <span className="job-req-text">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="job-card-footer">
                    <button
                      type="button"
                      className="btn btn-gold job-apply-btn"
                      onClick={() => handleApplyNow(job.title)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* d) How to Apply & Application Form */}
      <section className="section bg-ivory" id="apply">
        <div className="container">
          <Reveal className="careers-apply-header" style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="eyebrow-badge">HOW TO APPLY</span>
            <h2 className="section-title">How to Apply</h2>
            <p className="careers-apply-intro">
              Interested candidates are invited to submit their updated CV through the form below to{' '}
              <a href={`mailto:${CAREERS_EMAIL}`} className="careers-email-link">
                {CAREERS_EMAIL}
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="careers-form-card">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    className="careers-success-card"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="careers-success-circle">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="22"
                          cy="22"
                          r="20"
                          stroke="#F2B632"
                          strokeWidth="3"
                          fill="none"
                        />
                        <path
                          d="M13 22.5L19 28.5L31 15.5"
                          stroke="#F2B632"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <h3 className="careers-success-title">Application Received</h3>
                    <p className="careers-success-msg">
                      Thank you for applying to Crownstone Advisory. We have received your application for{' '}
                      <strong>{formData.position || 'the selected position'}</strong> and will review your qualifications. Only shortlisted candidates will be contacted.
                    </p>
                    <button
                      type="button"
                      className="careers-success-reset"
                      onClick={handleResetForm}
                    >
                      Submit another application
                    </button>
                  </motion.div>
                ) : (
                  <form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="careers-form"
                  >
                    {/* Submission Error Banner */}
                    {submitError && (
                      <div className="careers-error-banner" role="alert">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600 }}>
                          <AlertCircle size={18} />
                          <span>Submission Notice</span>
                        </div>
                        <p>{submitError}</p>
                        <div style={{ marginTop: 10 }}>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-gold"
                            style={{ height: 36, padding: '0 16px', fontSize: 13 }}
                          >
                            Retry Submission
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Honeypot field for bot spam */}
                    <input
                      type="text"
                      name="_honey"
                      value={formData._honey}
                      onChange={(e) => setFormData({ ...formData, _honey: e.target.value })}
                      style={{ display: 'none' }}
                      tabIndex="-1"
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <div className="careers-form-grid">
                      {/* Full Name */}
                      <div className={`form-group ${shakingField === 'name' ? 'shake-field' : ''} ${errors.name ? 'has-error' : ''}`}>
                        <label htmlFor="careers-name" className="form-label">
                          Full name <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <input
                          ref={nameRef}
                          id="careers-name"
                          name="name"
                          type="text"
                          required
                          placeholder="e.g. Priyantha Silva"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onBlur={() => handleBlur('name')}
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'careers-name-err' : undefined}
                        />
                        {errors.name && (
                          <span id="careers-name-err" className="form-error" role="alert">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className={`form-group ${shakingField === 'email' ? 'shake-field' : ''} ${errors.email ? 'has-error' : ''}`}>
                        <label htmlFor="careers-email" className="form-label">
                          Email <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <input
                          ref={emailRef}
                          id="careers-email"
                          name="email"
                          type="email"
                          required
                          placeholder="e.g. name@example.com"
                          className="form-input"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onBlur={() => handleBlur('email')}
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'careers-email-err' : undefined}
                        />
                        {errors.email && (
                          <span id="careers-email-err" className="form-error" role="alert">
                            {errors.email}
                          </span>
                        )}
                      </div>

                      {/* Position applying for */}
                      <div className={`form-group form-col-full ${shakingField === 'position' ? 'shake-field' : ''} ${errors.position ? 'has-error' : ''}`}>
                        <label htmlFor="careers-position" className="form-label">
                          Position applying for <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <select
                          ref={positionRef}
                          id="careers-position"
                          name="position"
                          required
                          className="form-select"
                          value={formData.position}
                          onChange={(e) => {
                            setFormData({ ...formData, position: e.target.value });
                            if (errors.position) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.position;
                                return next;
                              });
                            }
                          }}
                          onBlur={() => handleBlur('position')}
                          aria-invalid={errors.position ? 'true' : 'false'}
                          aria-describedby={errors.position ? 'careers-position-err' : undefined}
                        >
                          <option value="">Select a position...</option>
                          {POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </select>
                        {errors.position && (
                          <span id="careers-position-err" className="form-error" role="alert">
                            {errors.position}
                          </span>
                        )}
                      </div>

                      {/* Shared Salary Toggle (Month vs Year) */}
                      <div className="form-col-full">
                        <div className="salary-toggle-row">
                          <span className="salary-toggle-text">Salary Frequency:</span>
                          <div className="segmented-toggle" role="radiogroup" aria-label="Salary Frequency">
                            {['Per month', 'Per year'].map((period) => (
                              <button
                                key={period}
                                type="button"
                                role="radio"
                                aria-checked={formData.salaryPeriod === period}
                                className={`segmented-toggle-btn ${formData.salaryPeriod === period ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, salaryPeriod: period })}
                              >
                                {period}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Current Salary */}
                      <div className={`form-group ${shakingField === 'currentSalary' ? 'shake-field' : ''} ${errors.currentSalary ? 'has-error' : ''}`}>
                        <label htmlFor="careers-current-salary" className="form-label">
                          Current salary <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <div className="salary-input-group">
                          <select
                            className="salary-currency-select"
                            value={formData.currentSalaryCurrency}
                            onChange={(e) =>
                              setFormData({ ...formData, currentSalaryCurrency: e.target.value })
                            }
                            aria-label="Current salary currency"
                          >
                            {CURRENCIES.map((curr) => (
                              <option key={curr} value={curr}>
                                {curr}
                              </option>
                            ))}
                          </select>
                          <input
                            ref={currentSalaryRef}
                            id="careers-current-salary"
                            name="current_salary"
                            type="text"
                            required
                            placeholder="e.g. 150,000"
                            className="salary-amount-input"
                            value={formData.currentSalaryAmount}
                            onChange={(e) =>
                              setFormData({ ...formData, currentSalaryAmount: e.target.value })
                            }
                            onBlur={() => handleBlur('currentSalary')}
                            aria-invalid={errors.currentSalary ? 'true' : 'false'}
                            aria-describedby="careers-current-salary-helper careers-curr-err"
                          />
                        </div>
                        <span id="careers-current-salary-helper" className="form-helper">
                          Enter 0 if not applicable.
                        </span>
                        {errors.currentSalary && (
                          <span id="careers-curr-err" className="form-error" role="alert">
                            {errors.currentSalary}
                          </span>
                        )}
                      </div>

                      {/* Salary Expectation */}
                      <div className={`form-group ${shakingField === 'expectedSalary' ? 'shake-field' : ''} ${errors.expectedSalary ? 'has-error' : ''}`}>
                        <label htmlFor="careers-expected-salary" className="form-label">
                          Salary expectation <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <div className="salary-input-group">
                          <select
                            className="salary-currency-select"
                            value={formData.expectedSalaryCurrency}
                            onChange={(e) =>
                              setFormData({ ...formData, expectedSalaryCurrency: e.target.value })
                            }
                            aria-label="Expected salary currency"
                          >
                            {CURRENCIES.map((curr) => (
                              <option key={curr} value={curr}>
                                {curr}
                              </option>
                            ))}
                          </select>
                          <input
                            ref={expectedSalaryRef}
                            id="careers-expected-salary"
                            name="expected_salary"
                            type="text"
                            required
                            placeholder="e.g. 200,000"
                            className="salary-amount-input"
                            value={formData.expectedSalaryAmount}
                            onChange={(e) =>
                              setFormData({ ...formData, expectedSalaryAmount: e.target.value })
                            }
                            onBlur={() => handleBlur('expectedSalary')}
                            aria-invalid={errors.expectedSalary ? 'true' : 'false'}
                            aria-describedby={errors.expectedSalary ? 'careers-exp-err' : undefined}
                          />
                        </div>
                        {errors.expectedSalary && (
                          <span id="careers-exp-err" className="form-error" role="alert">
                            {errors.expectedSalary}
                          </span>
                        )}
                      </div>

                      {/* Notice Period */}
                      <div className={`form-group form-col-full ${shakingField === 'noticePeriod' ? 'shake-field' : ''} ${errors.noticePeriod ? 'has-error' : ''}`}>
                        <label htmlFor="careers-notice-period" className="form-label">
                          Notice period <span className="form-required" aria-hidden="true">*</span>
                        </label>
                        <select
                          ref={noticePeriodRef}
                          id="careers-notice-period"
                          name="notice_period"
                          required
                          className="form-select"
                          value={formData.noticePeriod}
                          onChange={(e) => {
                            setFormData({ ...formData, noticePeriod: e.target.value });
                            if (errors.noticePeriod) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.noticePeriod;
                                return next;
                              });
                            }
                          }}
                          onBlur={() => handleBlur('noticePeriod')}
                          aria-invalid={errors.noticePeriod ? 'true' : 'false'}
                          aria-describedby={errors.noticePeriod ? 'careers-notice-err' : undefined}
                        >
                          <option value="">Select notice period...</option>
                          {NOTICE_PERIODS.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>
                        {errors.noticePeriod && (
                          <span id="careers-notice-err" className="form-error" role="alert">
                            {errors.noticePeriod}
                          </span>
                        )}
                      </div>

                      {/* CV Upload */}
                      <div className={`form-group form-col-full ${shakingField === 'cv' ? 'shake-field' : ''} ${errors.cv ? 'has-error' : ''}`}>
                        <label className="form-label">
                          Upload CV <span className="form-required" aria-hidden="true">*</span>
                        </label>

                        <input
                          ref={fileInputRef}
                          id="careers-cv-file"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleFileInputChange}
                        />

                        <div
                          ref={cvDropzoneRef}
                          tabIndex={0}
                          role="button"
                          aria-label="Upload CV: Click or drag and drop PDF, DOC, or DOCX document up to 5MB"
                          className={`cv-dropzone ${isDragging ? 'dragging' : ''} ${errors.cv ? 'has-error' : ''}`}
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              fileInputRef.current && fileInputRef.current.click();
                            }
                          }}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          {cvFile ? (
                            <div className="cv-file-pill">
                              <div className="cv-file-info">
                                <FileText size={20} className="cv-dropzone-icon" />
                                <span className="cv-file-name" title={cvFile.name}>
                                  {cvFile.name}
                                </span>
                                <span className="cv-file-size">({formatFileSize(cvFile.size)})</span>
                              </div>
                              <button
                                type="button"
                                className="cv-remove-btn"
                                onClick={handleRemoveFile}
                                aria-label="Remove uploaded CV"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload size={28} className="cv-dropzone-icon" />
                              <div className="cv-dropzone-title">
                                Drag and drop your CV here, or click to browse
                              </div>
                              <div className="cv-dropzone-hint">
                                Accepted formats: PDF, DOC, DOCX (Max {MAX_CV_MB}MB)
                              </div>
                            </>
                          )}
                        </div>

                        {errors.cv && (
                          <span className="form-error" role="alert">
                            {errors.cv}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="careers-submit-wrap">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-gold careers-submit-btn"
                      >
                        {isSubmitting ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Loader2 size={18} className="spin-animation" />
                            Submitting Application...
                          </span>
                        ) : (
                          'Submit Application'
                        )}
                      </button>

                      <p className="careers-legal-note">
                        Crownstone Advisory is an equal opportunities employer. Only shortlisted candidates will be contacted.
                      </p>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* e) Focus Band */}
      <FocusBand />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, BRAND } from '../data/content';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Track scroll position for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        className={`site-header ${scrolled ? 'header-scrolled' : 'header-top'}`}
        initial={shouldReduceMotion ? {} : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-container">
          {/* Left: Brand Identity */}
          <Link to="/" className="header-brand" aria-label="Crownstone Advisory Home">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.png`}
              alt="Crownstone Advisory Crest"
              className="header-logo"
              onError={(e) => {
                // Graceful fallback to inline crest if image fails
                e.target.style.display = 'none';
              }}
            />
            <div className="header-brand-text">
              <span className="brand-title">{BRAND.name}</span>
              <span className="brand-subtitle">{BRAND.subtitle}</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="header-nav" aria-label="Main Navigation">
            <ul className="nav-list">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path} className="nav-item">
                    <NavLink
                      to={link.path}
                      className={({ isActive: active }) =>
                        `nav-link ${active ? 'active' : ''}`
                      }
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavUnderline"
                          className="nav-active-underline"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Desktop CTA Button */}
          <div className="header-actions">
            <Link to="/contact" className="btn btn-primary header-cta-btn">
              Get in Touch
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={28} color="#F2B632" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="mobile-drawer-root">
            {/* Backdrop */}
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-drawer-header">
                <div className="header-brand-text">
                  <span className="brand-title" style={{ fontSize: '19px' }}>{BRAND.name}</span>
                  <span className="brand-subtitle" style={{ fontSize: '9.5px', marginTop: '3px' }}>{BRAND.subtitle}</span>
                </div>
                <button
                  type="button"
                  className="mobile-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={28} color="#F2B632" />
                </button>
              </div>

              <div className="mobile-drawer-body">
                <ul className="mobile-nav-list">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.li
                      key={link.path}
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * idx, duration: 0.3 }}
                      className="mobile-nav-item"
                    >
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `mobile-nav-link ${isActive ? 'active' : ''}`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <div className="mobile-drawer-footer">
                  <Link
                    to="/contact"
                    className="btn btn-primary mobile-cta-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

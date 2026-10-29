import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, NAV_LINKS } from '../data/content';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Column 1: Brand details */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-header">
            <img
              src="/assets/logo.png"
              alt="Crownstone Advisory Crest"
              className="footer-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="footer-brand-titles">
              <span className="footer-brand-name">{BRAND.name}</span>
              <span className="footer-brand-sub">{BRAND.subtitle}</span>
            </div>
          </div>
          <div className="footer-practice-badge">{BRAND.practice}</div>
          <p className="footer-tagline">{BRAND.tagline}</p>
        </div>

        {/* Column 2: Contact info */}
        <div className="footer-col footer-col-contact">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="footer-label">Mobile: </span>
              <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`} className="footer-link">
                {BRAND.phone}
              </a>
            </li>
            <li>
              <span className="footer-label">Email: </span>
              <a href={`mailto:${BRAND.email}`} className="footer-link">
                {BRAND.email}
              </a>
            </li>
            <li className="footer-address">
              <span className="footer-label">Address: </span>
              <span>{BRAND.address}</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Navigation Links */}
        <div className="footer-col footer-col-pages">
          <h4 className="footer-heading">Pages</h4>
          <ul className="footer-pages-list">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="footer-nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

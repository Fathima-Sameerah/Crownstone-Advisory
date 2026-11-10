import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../data/content';
import { PRIMARY_EMAIL, PHONE_DISPLAY, PHONE_LINK, ADDRESS } from '../config/contact';

const SOCIAL_LINKS = [
  { name: 'Instagram', href: '', Icon: Instagram }, // Add Instagram link here
  { name: 'LinkedIn', href: '', Icon: Linkedin }, // Add LinkedIn link here
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Column 1: Brand details */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-header">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.png`}
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
          <div className="footer-social-links" aria-label="Social media">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => {
              const icon = <Icon size={20} aria-hidden="true" />;

              return href ? (
                <a
                  key={name}
                  href={href}
                  className="footer-social-link"
                  aria-label={name}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                </a>
              ) : (
                <span
                  key={name}
                  className="footer-social-link"
                  role="img"
                  aria-label={`${name} link coming soon`}
                >
                  {icon}
                </span>
              );
            })}
          </div>
        </div>

        {/* Column 2: Contact info */}
        <div className="footer-col footer-col-contact">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="footer-label">Mobile: </span>
              <a href={`tel:${PHONE_LINK}`} className="footer-link">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <span className="footer-label">Email: </span>
              <a href={`mailto:${PRIMARY_EMAIL}`} className="footer-link">
                {PRIMARY_EMAIL}
              </a>
            </li>
            <li className="footer-address">
              <span className="footer-label">Address: </span>
              <span>{ADDRESS}</span>
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
          <div className="footer-more-emails">
            <Link to="/contact" className="footer-more-link">
              More emails on the Contact page
            </Link>
          </div>
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

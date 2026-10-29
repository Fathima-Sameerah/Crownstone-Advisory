import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function CtaBand({
  heading = "Need commercial clarity on your project?",
  buttonText = "Contact Us",
  buttonLink = "/contact"
}) {
  return (
    <section className="cta-band-section">
      <div className="container cta-band-inner">
        <Reveal y={20} className="cta-band-heading-wrap">
          <h2 className="cta-band-heading">{heading}</h2>
        </Reveal>
        <Reveal y={20} delay={0.1} className="cta-band-btn-wrap">
          <Link to={buttonLink} className="btn btn-primary cta-btn">
            {buttonText}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

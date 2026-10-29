import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FocusBand() {
  const shouldReduceMotion = useReducedMotion();

  const phrase1 = "Our focus is ";
  const phrase2 = "commercial clarity, entitlement protection,";
  const phrase3 = " and dispute prevention - before issues escalate.";

  if (shouldReduceMotion) {
    return (
      <section className="focus-band-section" aria-label="Our Focus">
        <div className="container focus-band-inner">
          <p className="focus-band-text">
            <span>{phrase1}</span>
            <span className="focus-gold-highlight">{phrase2}</span>
            <span>{phrase3}</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="focus-band-section" aria-label="Our Focus">
      <div className="container focus-band-inner">
        <motion.p
          className="focus-band-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.04, delayChildren: 0.1 }
            }
          }}
        >
          {phrase1.split(" ").map((w, i) => (
            <motion.span
              key={`p1-${i}`}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {w}
            </motion.span>
          ))}
          <span className="focus-gold-highlight-wrap">
            <span className="focus-gold-highlight">
              {phrase2.split(" ").map((w, i) => (
                <motion.span
                  key={`p2-${i}`}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  style={{ display: 'inline-block', marginRight: '0.28em' }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="focus-underline"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          {phrase3.split(" ").map((w, i) => (
            <motion.span
              key={`p3-${i}`}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}

import React, { useState } from 'react';

/**
 * ImageWithFallback component
 * If the image fails to load or hasn't been uploaded yet,
 * displays a navy-to-gold gradient placeholder with "Image placeholder" text.
 */
export default function ImageWithFallback({
  src,
  alt = "Crownstone Advisory",
  className = "",
  style = {},
  overlay = false,
  loading = "lazy",
  placeholderText = "Image placeholder"
}) {
  const [error, setError] = useState(false);

  return (
    <div className={`img-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setError(true)}
          className="img-cover"
        />
      ) : (
        <div className="img-placeholder" aria-label={placeholderText}>
          <div className="img-placeholder-content">
            <span className="placeholder-icon">❖</span>
            <span className="placeholder-text">{placeholderText}</span>
          </div>
        </div>
      )}
      {overlay && <div className="img-navy-overlay" aria-hidden="true" />}
    </div>
  );
}

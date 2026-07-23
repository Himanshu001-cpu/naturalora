import React, { useState } from 'react';

export default function OptimizedImage({
  src,
  webpSrc,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate WebP source path automatically if not explicitly provided
  const derivedWebp = webpSrc || (typeof src === 'string' && src.startsWith('/images/') && !src.endsWith('.webp')
    ? src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    : null);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}>
      {/* Skeleton loader background */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-amber-950/20 animate-pulse rounded-[inherit]" />
      )}

      <picture>
        {derivedWebp && <source srcSet={derivedWebp} type="image/webp" sizes={sizes} />}
        <img
          src={error ? '/images/honey-jar.png' : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      </picture>
    </div>
  );
}

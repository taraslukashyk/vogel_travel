import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  sizes = "(max-width: 768px) 100vw, 50vw",
  ...props 
}) => {
  // If it's an Unsplash URL, we can leverage their API for different sizes
  const isUnsplash = src.includes('images.unsplash.com');
  
  let srcSet = undefined;
  if (isUnsplash) {
    const baseUrl = src.split('?')[0];
    srcSet = `
      ${baseUrl}?auto=format&fit=crop&q=60&w=400 400w,
      ${baseUrl}?auto=format&fit=crop&q=70&w=800 800w,
      ${baseUrl}?auto=format&fit=crop&q=80&w=1200 1200w,
      ${baseUrl}?auto=format&fit=crop&q=80&w=1600 1600w
    `;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      srcSet={srcSet}
      sizes={sizes}
      {...props}
    />
  );
};

export default OptimizedImage;

import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  ...props
}) => {
  const isUnsplash = src.includes('images.unsplash.com');

  let srcSet = undefined;
  if (isUnsplash) {
    const baseUrl = src.split('?')[0];
    srcSet = `
      ${baseUrl}?auto=format&fm=webp&fit=crop&q=60&w=400 400w,
      ${baseUrl}?auto=format&fm=webp&fit=crop&q=70&w=800 800w,
      ${baseUrl}?auto=format&fm=webp&fit=crop&q=80&w=1200 1200w,
      ${baseUrl}?auto=format&fm=webp&fit=crop&q=80&w=1600 1600w
    `;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      {...props}
    />
  );
};

export default OptimizedImage;

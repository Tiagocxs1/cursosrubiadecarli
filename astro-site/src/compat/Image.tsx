import React, { forwardRef } from 'react';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
};

const Image = forwardRef<HTMLImageElement, ImageProps>(({
  fill,
  priority,
  sizes,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  style,
  loading,
  ...props
}, ref) => {
  const fillStyle: React.CSSProperties = fill ? {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: props.className?.includes('object-contain') ? 'contain' : 'cover',
  } : {};
  return <img ref={ref} sizes={sizes} loading={priority ? 'eager' : (loading ?? 'lazy')} decoding="async" style={{ ...fillStyle, ...style }} {...props} />;
});
Image.displayName = 'AstroNextImageCompat';
export default Image;

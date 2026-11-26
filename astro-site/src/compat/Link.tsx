import React, { forwardRef } from 'react';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string | URL;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ href, prefetch: _prefetch, replace: _replace, scroll: _scroll, ...props }, ref) => (
  <a ref={ref} href={String(href)} {...props} />
));
Link.displayName = 'AstroNextLinkCompat';
export default Link;

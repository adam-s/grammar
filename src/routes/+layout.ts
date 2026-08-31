export const prerender = true;
export const ssr = true;
/* Directory-style pages (lessons/01-introduction/index.html) — the shape
   S3 + CloudFront on adamsohn.com already serve, so deep links work with no
   rewrite rules at the edge. */
export const trailingSlash = 'always';

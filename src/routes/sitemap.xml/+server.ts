import { COURSE_LESSONS } from '$lib/course';
import { site } from '$lib/site';

export const prerender = true;

/**
 * The sitemap, in the same minimal shape as the one on adamsohn.com: one
 * entry per page a search engine should index. It is generated from
 * COURSE_LESSONS so a new lesson is listed without anyone remembering to add
 * it. No lastmod — we don't track per-page dates, and a made-up one is worse
 * than none. The dev-only surfaces (replay, node-variants) are deliberately
 * absent.
 */
export const GET = () => {
  const paths = ['/', ...COURSE_LESSONS.map((lesson) => `/lessons/${lesson.id}/`)];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${site.origin}${path}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

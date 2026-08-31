/**
 * What a link scraper reads before anyone opens the app. It never runs our
 * JavaScript, so these facts are baked into the prerendered HTML by the
 * layout — and og:image must be an absolute URL, which is why the deployed
 * origin has to be written down here rather than derived at runtime.
 */
export const site = {
  /* Where the app lives, no trailing slash. */
  origin: 'https://adamsohn.com/grammar',
  name: 'Grammar',
  description: 'Build sentence diagrams — and find out if you really know how.',
  /* Rendered by scripts/og.mjs from scripts/og.html into static/og.png;
     the diagram inside it is a real app capture from scripts/og-capture.mjs. */
  image: { path: '/og.png', width: 2400, height: 1260 },
  imageAlt:
    '“The horse raced past the barn fell.” — yes, that’s a sentence, and the app’s finished diagram beside the headline proves it: “raced past the barn” tucked inside the subject, “fell” as the predicate.',
};

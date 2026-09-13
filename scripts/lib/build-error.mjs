// Contentful embeds the request (including credentials) in JSON error messages.
// Report only a validated error name and HTTP status from those messages.
export function describeBuildError(error) {
  const message = error instanceof Error ? error.message : '';
  let details;
  try { details = JSON.parse(message); } catch { /* Non-SDK error. */ }
  const candidate = details?.sys?.id || error?.name;
  const name = typeof candidate === 'string' && /^[A-Za-z][A-Za-z0-9]{0,79}$/.test(candidate) ? candidate : 'BuildError';
  const status = details?.status || error?.status;
  if (Number.isInteger(status) && status >= 400 && status <= 599) {
    const guidance = {
      401: 'Check the Contentful delivery token configured for this build.',
      403: 'The delivery token cannot access the configured Contentful content.',
      404: 'Check the Contentful space and environment configured for this build.',
      429: 'Contentful rate limit reached; retry the build.',
    }[status] || 'The content request failed; retry or check Contentful availability.';
    return `${name} (HTTP ${status}). ${guidance}`;
  }
  // Only our own known validation messages may be logged verbatim.
  if (/^(Prerendering requires|Production prerendering|VITE_SITE_URL|Incomplete published CMS content|Invalid project slug|Missing project content|Missing SEO metadata|Incomplete prerender|Missing language counterpart|Prerender timed out)/.test(message)) {
    return message.split('\n')[0];
  }
  return `${name}. Check the build configuration and Contentful connectivity.`;
}

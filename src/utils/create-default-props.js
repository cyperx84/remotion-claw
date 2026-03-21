/**
 * Fill template-specific default props for `rclaw create`.
 * Keeps natural-language create flows usable without requiring explicit JSON props.
 */
export function buildCreateProps(templateName, description, baseProps = {}, options = {}) {
  const ttsText = options.tts || '';

  switch (templateName) {
    case 'announcement':
      return {
        ...baseProps,
        title: baseProps.title || description,
        body: baseProps.body || ttsText || description,
      };

    case 'social-clip':
      return {
        ...baseProps,
        title: baseProps.title || description,
        subtitle: baseProps.subtitle || ttsText || description,
      };

    case 'data-viz':
      return {
        ...baseProps,
        title: baseProps.title || description,
        subtitle: baseProps.subtitle || ttsText || '',
      };

    case 'product-demo':
      return {
        ...baseProps,
        title: baseProps.title || description,
        tagline: baseProps.tagline || ttsText || description,
      };

    default:
      return {
        ...baseProps,
        title: baseProps.title || description,
        description: baseProps.description || ttsText || description,
      };
  }
}

import mjml from 'mjml';

export default function viteMjml() {
  return {
    name: 'mjml-transform',
    transform(code, id) {
      // Only process files ending with .mjml or .hbs.mjml
      if (!id.endsWith('.mjml') && !id.endsWith('.hbs.mjml')) {
        return;
      }

      // Compile the MJML (with Handlebars already processed if applicable)
      const { html, errors } = mjml(code, { minify: true });

      // Log any errors and stop the build if there are issues
      if (errors && errors.length > 0) {
        errors.forEach((err) => console.error(err));
        throw new Error('MJML compilation failed');
      }

      return {
        code: html,
        map: null, // Optionally add a source map if needed
      };
    },
  };
}

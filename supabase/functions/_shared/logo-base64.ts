// Generate base64 encoded logo for email templates
// This reads the logo file once at module initialization and caches the base64 string

const logoPath = new URL('./logo.png', import.meta.url).pathname;
const logoFile = await Deno.readFile(logoPath);
const base64 = btoa(String.fromCharCode(...logoFile));

export const LOGO_BASE64 = `data:image/png;base64,${base64}`;

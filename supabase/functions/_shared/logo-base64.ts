// Hardcoded base64 encoded logo for email templates
// This avoids runtime file I/O issues in Deno edge functions

// Small transparent PNG placeholder - replace with actual logo base64 if needed
// Or better yet, use a public URL from your storage bucket or CDN
export const LOGO_BASE64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;

// Alternative: Use a public URL instead of base64
// This is more efficient and avoids embedding large images in code
export const LOGO_URL = 'https://relqmhrzyqckoaebscgx.supabase.co/storage/v1/object/public/heartlines-icon.png';

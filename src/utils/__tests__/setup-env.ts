// Importing PageTemplatePreview transitively pulls in the Supabase browser
// client (via RequestServiceModal), which throws at module load when these are
// unset. The values are never used - no test makes a network call - they only
// need to be present so the module graph can be imported.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||= "test-publishable-key";

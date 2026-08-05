const supabaseEnvTemplate = () => {
  return 'SUPABASE_URL=your_supabase_url\nSUPABASE_ANON_KEY=your_supabase_anon_key\n';
};

module.exports = {
  supabaseEnvTemplate
};

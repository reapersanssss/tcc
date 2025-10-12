import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://jwmbpltpmpkqczxdoave.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("❌ Erro ao entrar: " + error.message);
    return;
  }

  const user = data.user;

  // busca dados do perfil na tabela
  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  alert(`👋 Olá, ${perfil.username}! Bem-vindo(a) de volta.`);
  window.location.href = "index.html";
});

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://jwmbpltpmpkqczxdoave.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = email.split("@")[0]; // cria um nome simples

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("❌ Erro: " + error.message);
    return;
  }

  // salva o nome do usuário no perfil
  const user = data.user;
  await supabase.from("profiles").insert([{ id: user.id, email: user.email, username }]);

  alert("✅ Conta criada com sucesso!");
  window.location.href = "index.html"; // volta para home
});

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://jwmbpltpmpkqczxdoave.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("signup-form");
const message = document.getElementById("message");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

// Mostrar/Ocultar senha
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

// Cadastro com Supabase
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = passwordInput.value;

  message.style.color = "#00ffbf";
  message.textContent = "Criando conta...";

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    message.style.color = "#ff4c4c";
    message.textContent = "❌ Erro ao criar conta: " + error.message;
    console.error(error);
  } else {
    message.style.color = "#00ffbf";
    message.textContent = `✅ Conta criada com sucesso! Bem-vindo, ${data.user.email}. Redirecionando...`;

    setTimeout(() => {
      window.location.href = "index.html"; // volta à home
    }, 1500);
  }
});

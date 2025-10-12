import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://jwmbpltpmpkqczxdoave.supabase.co";
const SUPABASE_ANON_KEY = "SUA_CHAVE_ANONIMA_AQUI";

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

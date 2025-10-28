// 🔹 Inicializa o Supabase
const SUPABASE_URL = "https://jwmbpltpmpkqczxdoave.supabase.co"; // coloque sua URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q"; // coloque sua chave pública
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 Captura o formulário de login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // 🔸 Faz o login com Supabase
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Erro ao fazer login: " + error.message);
  } else {
    // 🔹 Salva o usuário localmente (opcional)
    localStorage.setItem("usuario", JSON.stringify(data.user));

    // 🔹 Mostra mensagem e redireciona para a Home
    alert("✅ Login realizado com sucesso! Bem-vindo(a), " + data.user.email);
    window.location.href = "index.html"; // Redireciona para a Home
  }
});

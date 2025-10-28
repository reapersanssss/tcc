import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://jwmbpltpmpkqczxdoave.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 🔹 Mantém o login ativo mesmo se fechar o navegador
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    localStorage.setItem('supabaseSession', JSON.stringify(session))
  } else {
    localStorage.removeItem('supabaseSession')
  }
})

// 🔹 Se já estiver logado, redireciona direto pra home
const session = JSON.parse(localStorage.getItem('supabaseSession'))
if (session) {
  window.location.href = 'index.html'
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

  if (error) {
    alert('Erro ao fazer login: ' + error.message)
  } else {
    localStorage.setItem('supabaseSession', JSON.stringify(data.session))
    alert('Login realizado com sucesso!')
    window.location.href = 'index.html'
  }
})

document.getElementById('frmLogin').addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = { email: fd.get('email'), password: fd.get('password') };
  const res = await fetch('/api/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const j = await res.json();
  if (res.ok) {
    window.location = '/profile.html';
  } else {
    alert(j.error || 'Erro');
  }
});

// Exemplo de login com Supabase
async function fazerLogin(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    alert("Erro ao fazer login: " + error.message);
  } else {
    // 🔹 Redireciona para a Home automaticamente
    window.location.href = "/index.html";
  }
}

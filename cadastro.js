import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔹 coloque aqui seus dados do Supabase
const SUPABASE_URL = 'https://jwmbpltpmpkqczxdoave.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('nome').value
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value
  const confirmarSenha = document.getElementById('confirmarSenha').value
  const idade = document.getElementById('idade').value
  const sexo = document.getElementById('sexo').value
  const objetivo = document.getElementById('objetivo').value

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!')
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, idade, sexo, objetivo }
    }
  })

  if (error) {
    alert('Erro ao cadastrar: ' + error.message)
  } else {
    alert('Cadastro realizado! Verifique seu e-mail para confirmar.')
    window.location.href = 'index.html'
  }
})

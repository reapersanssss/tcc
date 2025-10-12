// 🔑 Conexão com Supabase
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_CHAVE_ANON_PUBLIC";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === CALCULADORA DE IMC ===
if (document.getElementById('imcForm')) {
  document.getElementById('imcForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let peso = parseFloat(document.getElementById('peso').value);
    let alturaCm = parseFloat(document.getElementById('altura').value);
    let altura = alturaCm / 100; // cm -> m

    let imc = peso / (altura * altura);
    imc = imc.toFixed(2);
    document.getElementById('resultadoIMC').textContent = `Seu IMC é ${imc}`;
  });
}

// === CONTATO ===
if (document.getElementById('contatoForm')) {
  document.getElementById('contatoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('msgContato').textContent = "Mensagem enviada com sucesso!";
    this.reset();
  });
}

// === LOGIN COM SUPABASE ===
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let senha = document.getElementById('password').value;

    const { data, error } = await client.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      document.getElementById('msgLogin').textContent = "Erro: " + error.message;
      document.getElementById('msgLogin').style.color = "red";
    } else {
      document.getElementById('msgLogin').textContent = "Login realizado com sucesso!";
      document.getElementById('msgLogin').style.color = "green";
      setTimeout(() => window.location.href = "index.html", 1000);
    }
  });
}

// === CADASTRO COM SUPABASE ===
if (document.getElementById('cadastroForm')) {
  document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmaSenha = document.getElementById('confirmaSenha').value;
    let idade = document.getElementById('idade')?.value || null;
    let genero = document.getElementById('genero')?.value || null;

    if (senha !== confirmaSenha) {
      document.getElementById('msgCadastro').textContent = "As senhas não coincidem!";
      document.getElementById('msgCadastro').style.color = "red";
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password: senha
    });

    if (error) {
      document.getElementById('msgCadastro').textContent = "Erro: " + error.message;
      document.getElementById('msgCadastro').style.color = "red";
    } else {
      const user = data.user;

      // salva dados extras na tabela profiles
      if (user) {
        await client.from("profiles").insert([
          { id: user.id, nome, idade, genero }
        ]);
      }

      document.getElementById('msgCadastro').textContent = "Cadastro realizado com sucesso!";
      document.getElementById('msgCadastro').style.color = "#1abc9c";

      setTimeout(() => window.location.href = "index.html", 1000);
    }
  });
}

// ===============================
// INTERAÇÕES GERAIS DO SITE
// ===============================

// 👉 Animação suave ao rolar a página
window.addEventListener("scroll", () => {
  document.querySelectorAll(".fade-in").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
});

// 👉 Efeito de botão pulsante em "Começar Agora"
const startBtn = document.querySelector(".start-btn");
if (startBtn) {
  startBtn.addEventListener("mouseenter", () => startBtn.classList.add("pulse"));
  startBtn.addEventListener("mouseleave", () => startBtn.classList.remove("pulse"));
}

// 👉 Animação de navegação ao passar o mouse
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("mouseenter", () => link.classList.add("hover"));
  link.addEventListener("mouseleave", () => link.classList.remove("hover"));
});

// 👉 Botão "Voltar ao topo"
const backToTop = document.createElement("button");
backToTop.textContent = "↑";
backToTop.id = "backToTop";
backToTop.title = "Voltar ao topo";
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 👉 Modo escuro/claro (salva no localStorage)
const modeToggle = document.createElement("button");
modeToggle.textContent = "🌓";
modeToggle.id = "modeToggle";
document.body.appendChild(modeToggle);

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
});

// 👉 Saudação personalizada no login
const user = localStorage.getItem("username");
const loginHeader = document.querySelector("#login-header");
if (user && loginHeader) {
  loginHeader.innerHTML = `👋 Olá, <strong>${user}</strong>! Bem-vindo de volta.`;
}

// 👉 Simulação de login (apenas para testar)
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    localStorage.setItem("username", username);
    alert(`Login bem-sucedido! Bem-vindo, ${username}!`);
    window.location.href = "index.html";
  });
}

// 👉 Ocultar / mostrar senha
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁" : "🙈";
  });
}

// 👉 Animação de progresso nas aulas
document.querySelectorAll(".progress-bar").forEach(bar => {
  const progress = bar.dataset.progress;
  setTimeout(() => {
    bar.style.width = progress + "%";
  }, 500);
});

// 👉 Efeito de destaque nos planos ao passar o mouse
document.querySelectorAll(".plan-card").forEach(card => {
  card.addEventListener("mouseenter", () => card.classList.add("active"));
  card.addEventListener("mouseleave", () => card.classList.remove("active"));
});

const form = document.querySelector("#form-contato");
const mensagemSucesso = document.querySelector("#mensagem-sucesso");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  mensagemSucesso.classList.remove("oculto");

  setTimeout(() => {
    mensagemSucesso.classList.add("oculto");
    form.reset();
  }, 4000);
});

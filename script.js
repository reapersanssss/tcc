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

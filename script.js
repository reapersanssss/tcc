// Calculadora de IMC
if(document.getElementById('imcForm')){
    document.getElementById('imcForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let peso = parseFloat(document.getElementById('peso').value);
        let altura = parseFloat(document.getElementById('altura').value);
        let imc = peso / (altura * altura);
        imc = imc.toFixed(2);
        document.getElementById('resultadoIMC').textContent = `Seu IMC é ${imc}`;
    });
}

// Contato
if(document.getElementById('contatoForm')){
    document.getElementById('contatoForm').addEventListener('submit', function(e){
        e.preventDefault();
        document.getElementById('msgContato').textContent = "Mensagem enviada com sucesso!";
        this.reset();
    });
}

// Login simples
if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        let usuario = this.querySelector('input[type="text"]').value;
        let senha = this.querySelector('input[type="password"]').value;

        if(usuario === "admin" && senha === "1234"){
            document.getElementById('msgLogin').textContent = "Login realizado com sucesso!";
        } else {
            document.getElementById('msgLogin').textContent = "Usuário ou senha incorretos!";
        }
    });
}

// Calculadora de IMC
if(document.getElementById('imcForm')){
    document.getElementById('imcForm').addEventListener('submit', function(e) {
        e.preventDefault();
       let peso = parseFloat(document.getElementById('peso').value);
let alturaCm = parseFloat(document.getElementById('altura').value);
let altura = alturaCm / 100; // converte cm para m

        let imc = peso / (altura * altura);
        imc = imc.toFixed(2);
        document.getElementById('resultadoIMC').textContent = `Seu IMC é ${imc}`;
    });
}

// Contato
if(document.getElementById('contatoForm')){
    document.getElementById('contatoForm').addEventListener('submit', function(e){
        e.preventDefault();
        document.getElementById('msgContato').textContent = "Mensagem enviada com sucesso!";
        this.reset();
    });
}

// Login simples
if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        let usuario = this.querySelector('input[type="text"]').value;
        let senha = this.querySelector('input[type="password"]').value;

        // Aqui você pode integrar com banco ou armazenamento local
        if(usuario === "admin" && senha === "1234"){
            document.getElementById('msgLogin').textContent = "Login realizado com sucesso!";
        } else {
            document.getElementById('msgLogin').textContent = "Usuário ou senha incorretos!";
        }
    });
}

// Cadastro simples
if(document.getElementById('cadastroForm')){
    document.getElementById('cadastroForm').addEventListener('submit', function(e){
        e.preventDefault();

        let nome = document.getElementById('nome').value;
        let email = document.getElementById('email').value;
        let usuario = document.getElementById('usuario').value;
        let senha = document.getElementById('senha').value;
        let confirmaSenha = document.getElementById('confirmaSenha').value;

        if(senha !== confirmaSenha){
            document.getElementById('msgCadastro').textContent = "As senhas não coincidem!";
            document.getElementById('msgCadastro').style.color = "red";
            return;
        }

        // Armazenar usuário no localStorage (exemplo simples)
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push({nome, email, usuario, senha});
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        document.getElementById('msgCadastro').textContent = "Cadastro realizado com sucesso!";
        document.getElementById('msgCadastro').style.color = "#1abc9c";
        this.reset();
    });
}



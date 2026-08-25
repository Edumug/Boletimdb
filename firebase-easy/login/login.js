const loginInput = document.getElementById("login");
const senhaInput = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");
const btnCriarConta = document.getElementById("btnCriarConta");

let erro = 0;

const logins = [
    ["admin", "1234"],
    ["professor", "abc"],
    ["abner", "tompearl"]
];

btnMostrarSenha.addEventListener("click", () => {
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        btnMostrarSenha.src = "../imgs/olho (1).png";
    } else {
        senhaInput.type = "password";
        btnMostrarSenha.src = "../imgs/olho.png";
    }
});

btnEntrar.addEventListener("click", () => {
    const login = loginInput.value.trim();
    const senha = senhaInput.value;
    const contasCriadas = JSON.parse(localStorage.getItem("contasBoletim") || "[]");

    const usuario = logins.find(u => u[0] === login && u[1] === senha) ||
        contasCriadas.find(u => u.login === login && u.senha === senha);

    if (usuario) {
        sessionStorage.setItem("logado", "true");
        window.location.replace("../main/main.html");
    } else {
        erro++;
        alert("Login ou senha incorretos! Tentativas restantes: " + Math.max(0, 3 - erro));

        if (erro >= 3) {
            btnEntrar.disabled = true;

            const recuperacao = prompt(
                "Número máximo de tentativas excedido.\nDigite a senha de recuperação:"
            );

            if (recuperacao === "senha123") {
                alert("Senha de recuperação aceita. Você pode tentar fazer login novamente.");
                erro = 0;
                btnEntrar.disabled = false;
            } else {
                alert("Senha de recuperação incorreta.");
            }
        }
    }
});

if (btnCriarConta) {
    btnCriarConta.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });
}

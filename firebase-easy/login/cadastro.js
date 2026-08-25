const novoLogin = document.getElementById("novoLogin");
const novaSenha = document.getElementById("novaSenha");
const confirmarSenha = document.getElementById("confirmarSenha");
const btnCriar = document.getElementById("btnCriar");
const btnVoltar = document.getElementById("btnVoltar");

btnCriar.addEventListener("click", () => {
  const login = novoLogin.value.trim();
  const senha = novaSenha.value;
  const confirmacao = confirmarSenha.value;

  if (!login || !senha || !confirmacao) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmacao) {
    alert("As senhas não são iguais.");
    return;
  }

  const contas = JSON.parse(localStorage.getItem("contasBoletim") || "[]");

  if (contas.some(conta => conta.login === login)) {
    alert("Esse usuário já existe.");
    return;
  }

  contas.push({ login, senha });
  localStorage.setItem("contasBoletim", JSON.stringify(contas));

  alert("Conta criada com sucesso!");
  window.location.replace("login.html");
});

btnVoltar.addEventListener("click", () => {
  window.location.replace("login.html");
});

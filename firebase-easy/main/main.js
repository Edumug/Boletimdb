import { salvar, buscarTodos, editar, deletar } from "../crud.js";

if (sessionStorage.getItem("logado") !== "true") {
  window.location.replace("../login/login.html");
}

const nomeInput = document.getElementById("nome");
const turmaInput = document.getElementById("turma");
const nota1Input = document.getElementById("nota1");
const nota2Input = document.getElementById("nota2");
const nota3Input = document.getElementById("nota3");
const btnSalvar = document.getElementById("btnSalvar");
const lista = document.getElementById("lista");
const buscaInput = document.getElementById("busca");
const filtroTurma = document.getElementById("filtroTurma");
const ordenacao = document.getElementById("ordenacao");
const semResultados = document.getElementById("semResultados");
const btnSair = document.getElementById("btnSair");
const btnTema = document.getElementById("btnTema");

let alunosCache = {};

function notaValida(valor) {
  return Number.isFinite(Number(valor)) && Number(valor) >= 0 && Number(valor) <= 10;
}

function calcularMedia(n1, n2, n3) {
  return ((Number(n1) + Number(n2) + Number(n3)) / 3).toFixed(2);
}

function resultado(media) {
  return Number(media) >= 7 ? "Aprovado" : "Reprovado";
}

btnSalvar.addEventListener("click", async () => {
  const nome = nomeInput.value.trim();
  const turma = turmaInput.value.trim();
  const nota1 = Number(nota1Input.value);
  const nota2 = Number(nota2Input.value);
  const nota3 = Number(nota3Input.value);

  if (!nome || !turma || !notaValida(nota1) || !notaValida(nota2) || !notaValida(nota3)) {
    alert("Preencha todos os campos corretamente. As notas devem estar entre 0 e 10.");
    return;
  }

  const mediafinal = calcularMedia(nota1, nota2, nota3);

  try {
    await salvar(nome, turma, nota1, nota2, nota3, mediafinal);
    nomeInput.value = "";
    turmaInput.value = "";
    nota1Input.value = "";
    nota2Input.value = "";
    nota3Input.value = "";
    await carregarDados();
  } catch (err) {
    console.error("Erro ao salvar:", err);
    alert("Ocorreu um erro ao salvar os dados.");
  }
});

buscaInput.addEventListener("input", aplicarFiltros);
filtroTurma.addEventListener("change", aplicarFiltros);
ordenacao.addEventListener("change", aplicarFiltros);

async function carregarDados() {
  try {
    alunosCache = await buscarTodos();
    atualizarFiltroTurmas();
    atualizarDashboard();
    aplicarFiltros();
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    alert("Não foi possível carregar a lista.");
  }
}

function atualizarFiltroTurmas() {
  const turmaAtual = filtroTurma.value;
  const turmas = [...new Set(Object.values(alunosCache).map(a => a.turma).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b)));

  filtroTurma.innerHTML = '<option value="">Todas as turmas</option>';
  turmas.forEach(turma => {
    const option = document.createElement("option");
    option.value = turma;
    option.textContent = turma;
    filtroTurma.appendChild(option);
  });

  if (turmas.includes(turmaAtual)) filtroTurma.value = turmaAtual;
}

function atualizarDashboard() {
  const alunos = Object.values(alunosCache);
  const aprovados = alunos.filter(a => a.resul === "Aprovado").length;
  const reprovados = alunos.filter(a => a.resul === "Reprovado").length;
  const media = alunos.length
    ? alunos.reduce((soma, a) => soma + Number(a.mediafinal || 0), 0) / alunos.length
    : 0;

  document.getElementById("totalAlunos").textContent = alunos.length;
  document.getElementById("totalAprovados").textContent = aprovados;
  document.getElementById("totalReprovados").textContent = reprovados;
  document.getElementById("mediaTurma").textContent = media.toFixed(2).replace(".", ",");
}

function aplicarFiltros() {
  const busca = buscaInput.value.trim().toLowerCase();
  const turma = filtroTurma.value;
  const modo = ordenacao.value;

  let alunos = Object.entries(alunosCache).filter(([, aluno]) => {
    const nomeOk = String(aluno.nome || "").toLowerCase().includes(busca);
    const turmaOk = !turma || aluno.turma === turma;
    return nomeOk && turmaOk;
  });

  alunos.sort((a, b) => {
    if (modo === "nome-desc") return String(b[1].nome).localeCompare(String(a[1].nome));
    if (modo === "media-desc") return Number(b[1].mediafinal) - Number(a[1].mediafinal);
    if (modo === "media-asc") return Number(a[1].mediafinal) - Number(b[1].mediafinal);
    return String(a[1].nome).localeCompare(String(b[1].nome));
  });

  lista.innerHTML = "";
  semResultados.style.display = alunos.length ? "none" : "block";
  alunos.forEach(([id, aluno]) => renderItem(id, aluno));
}

function criarInput(type, value) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value ?? "";
  input.className = "campo-editar";

  if (type === "number") {
    input.min = "0";
    input.max = "10";
    input.step = "0.01";
  }

  return input;
}

function renderItem(id, pessoa) {
  const li = document.createElement("li");
  li.className = "aluno-item";

  const nome = criarInput("text", pessoa.nome);
  const turma = criarInput("text", pessoa.turma);
  const nota1 = criarInput("number", pessoa.nota1);
  const nota2 = criarInput("number", pessoa.nota2);
  const nota3 = criarInput("number", pessoa.nota3);

  const media = document.createElement("span");
  media.className = "media";
  media.textContent = `Média: ${pessoa.mediafinal}`;

  const resultadoSpan = document.createElement("span");
  resultadoSpan.className = `resultado ${pessoa.resul === "Aprovado" ? "aprovado" : "reprovado"}`;
  resultadoSpan.textContent = pessoa.resul;

  const btnAlterar = document.createElement("button");
  btnAlterar.textContent = "Salvar alterações";
  btnAlterar.className = "btn-salvar-alteracoes";

  btnAlterar.addEventListener("click", async () => {
    const novoNome = nome.value.trim();
    const novaTurma = turma.value.trim();
    const novaNota1 = Number(nota1.value);
    const novaNota2 = Number(nota2.value);
    const novaNota3 = Number(nota3.value);

    if (!novoNome || !novaTurma || !notaValida(novaNota1) || !notaValida(novaNota2) || !notaValida(novaNota3)) {
      alert("Preencha os dados corretamente. As notas devem estar entre 0 e 10.");
      return;
    }

    const novaMedia = calcularMedia(novaNota1, novaNota2, novaNota3);
    const novoResultado = resultado(novaMedia);

    try {
      await editar(id, novoNome, novaTurma, novaNota1, novaNota2, novaNota3, novaMedia, novoResultado);
      await carregarDados();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Ocorreu um erro ao salvar as alterações.");
    }
  });

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.className = "btn-excluir";

  btnExcluir.addEventListener("click", async () => {
    if (!confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) return;

    try {
      await deletar(id);
      await carregarDados();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Ocorreu um erro ao excluir o cadastro.");
    }
  });

  li.append(nome, turma, nota1, nota2, nota3, media, resultadoSpan, btnAlterar, btnExcluir);
  lista.appendChild(li);
}

btnSair.addEventListener("click", () => {
  sessionStorage.removeItem("logado");
  window.location.replace("../login/login.html");
});

const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "escuro") document.body.classList.add("tema-escuro");

function atualizarBotaoTema() {
  btnTema.textContent = document.body.classList.contains("tema-escuro") ? "☀️" : "🌙";
}

atualizarBotaoTema();

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("tema-escuro");
  localStorage.setItem("tema", document.body.classList.contains("tema-escuro") ? "escuro" : "claro");
  atualizarBotaoTema();
});

carregarDados();

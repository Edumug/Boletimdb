import { salvar, buscarTodos, editar, deletar } from "./crud.js";

const nomeInput = document.getElementById("nome");
const turmaInput = document.getElementById("turma");
const nota1Input = document.getElementById("nota1");
const nota2Input = document.getElementById("nota2");
const nota3Input = document.getElementById("nota3");

const lista = document.getElementById("lista");
const buscaInput = document.getElementById("busca");
const btnSalvar = document.getElementById("btnSalvar");

let idEditando = null;

btnSalvar.addEventListener("click", async (event) => {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const turma = turmaInput.value.trim();
  const nota1 = nota1Input.value.trim();
  const nota2 = nota2Input.value.trim();
  const nota3 = nota3Input.value.trim();
  let resul = "";
  if (!nome || !turma || !nota1 || !nota2 || !nota3) {
    alert("Preencha todos os campos!");
    return;
  }

  const mediafinal = (
    (parseFloat(nota1) +
      parseFloat(nota2) +
      parseFloat(nota3)) / 3
  ).toFixed(2);

  if(mediafinal < 7) {
    resul = "Reprovado";
  }
  else{
    resul = "Aprovado";
  }
  try {
    if (idEditando) {
      await editar(
        idEditando,
        nome,
        turma,
        nota1,
        nota2,
        nota3,
        mediafinal,
        resul
      );

      idEditando = null;
      btnSalvar.textContent = "Salvar";
    } else {
      await salvar(
        nome,
        turma,
        nota1,
        nota2,
        nota3,
        mediafinal,
        resul
      );
    }

    nomeInput.value = "";
    turmaInput.value = "";
    nota1Input.value = "";
    nota2Input.value = "";
    nota3Input.value = "";

    await atualizarLista(buscaInput.value.toLowerCase());

  } catch (err) {
    console.error("Erro ao salvar/atualizar:", err);
    alert("Ocorreu um erro ao salvar os dados.");
  }
});


buscaInput.addEventListener("input", () => {
  atualizarLista(buscaInput.value.toLowerCase());
});


function renderItem(id, p, filtro) {

  if (!p.nome.toLowerCase().includes(filtro)) {
    return;
  }

  const li = document.createElement("li");

  li.innerHTML = `
  <span>
    <strong>${p.nome}</strong>
    |Turma: ${p.turma}|
    |1º Nota: ${p.nota1}|
    |2º Nota: ${p.nota2}|
    |3º Nota: ${p.nota3}|
    |Média: ${p.mediafinal}|
  </span>

  <div>
    <span style="
      color: ${p.resul === "Aprovado" ? "green" : "red"};
      font-weight: bold;
      margin-right: 10px;
    ">
      ${p.resul}
    </span>

    <button class="btn-editar">Editar</button>
    <button class="btn-excluir">Excluir</button>
  </div>
`;


  li.querySelector(".btn-editar").addEventListener("click", () => {

    nomeInput.value = p.nome;
    turmaInput.value = p.turma;
    nota1Input.value = p.nota1;
    nota2Input.value = p.nota2;
    nota3Input.value = p.nota3;

    idEditando = id;

    btnSalvar.textContent = "Atualizar";
  });


  li.querySelector(".btn-excluir").addEventListener("click", async () => {

    if (confirm("Excluir este cadastro?")) {

      try {

        await deletar(id);

        await atualizarLista(filtro);

      } catch (err) {

        console.error("Erro ao excluir:", err);

        alert("Ocorreu um erro ao excluir o cadastro.");
      }
    }
  });


  lista.appendChild(li);
}


async function atualizarLista(filtro = "") {

  try {

    const dados = await buscarTodos();

    lista.innerHTML = "";

    for (let id in dados) {

      const pessoa = dados[id];

      if (
        pessoa.nome &&
        pessoa.nome.toLowerCase().includes(filtro.toLowerCase())
      ) {
        renderItem(id, pessoa, filtro);
      }
    }

  } catch (err) {

    console.error("Erro ao buscar dados:", err);

    alert("Não foi possível carregar a lista.");
  }
}


window.addEventListener("load", () => {
  atualizarLista();
});
import { salvar, buscarTodos, editar, deletar } from "../crud.js";
if (sessionStorage.getItem("logado") !== "true") {
    window.location.replace("../login/login.html");
}
const nomeInput = document.getElementById("nome");
const turmaInput = document.getElementById("turma");
const nota1Input = document.getElementById("nota1");
const nota2Input = document.getElementById("nota2");
const nota3Input = document.getElementById("nota3");

const lista = document.getElementById("lista");
const buscaInput = document.getElementById("busca");
const btnSalvar = document.getElementById("btnSalvar");


/* =========================
   CADASTRAR NOVO ALUNO
========================= */

btnSalvar.addEventListener("click", async (event) => {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const turma = turmaInput.value.trim();
  const nota1 = nota1Input.value.trim();
  const nota2 = nota2Input.value.trim();
  const nota3 = nota3Input.value.trim();

  if (!nome || !turma || !nota1 || !nota2 || !nota3) {
    alert("Preencha todos os campos!");
    return;
  }

  const mediafinal = (
    (Number(nota1) +
      Number(nota2) +
      Number(nota3)) / 3
  ).toFixed(2);

  const resul =
    Number(mediafinal) >= 7
      ? "Aprovado"
      : "Reprovado";

  try {

    await salvar(
      nome,
      turma,
      nota1,
      nota2,
      nota3,
      mediafinal,
      resul
    );

    nomeInput.value = "";
    turmaInput.value = "";
    nota1Input.value = "";
    nota2Input.value = "";
    nota3Input.value = "";

    await atualizarLista(
      buscaInput.value.toLowerCase()
    );

  } catch (err) {

    console.error("Erro ao salvar:", err);

    alert("Ocorreu um erro ao salvar os dados.");

  }
});


/* =========================
   PESQUISA
========================= */

buscaInput.addEventListener("input", () => {

  atualizarLista(
    buscaInput.value.toLowerCase()
  );

});


/* =========================
   RENDERIZAR ALUNO
========================= */

function renderItem(id, pessoa, filtro) {

  if (
    !pessoa.nome ||
    !pessoa.nome.toLowerCase().includes(filtro)
  ) {
    return;
  }


  const li = document.createElement("li");


  /* =========================
     NOME
  ========================= */

  const nome = document.createElement("input");

  nome.type = "text";
  nome.value = pessoa.nome;
  nome.className = "campo-editar";

  li.appendChild(nome);


  /* =========================
     TURMA
  ========================= */

  const turma = document.createElement("input");

  turma.type = "text";
  turma.value = pessoa.turma;
  turma.className = "campo-editar";

  li.appendChild(turma);


  /* =========================
     NOTA 1
  ========================= */

  const nota1 = document.createElement("input");

  nota1.type = "number";
  nota1.value = pessoa.nota1;
  nota1.className = "campo-editar";

  li.appendChild(nota1);


  /* =========================
     NOTA 2
  ========================= */

  const nota2 = document.createElement("input");

  nota2.type = "number";
  nota2.value = pessoa.nota2;
  nota2.className = "campo-editar";

  li.appendChild(nota2);


  /* =========================
     NOTA 3
  ========================= */

  const nota3 = document.createElement("input");

  nota3.type = "number";
  nota3.value = pessoa.nota3;
  nota3.className = "campo-editar";

  li.appendChild(nota3);


  /* =========================
     MÉDIA
  ========================= */

  const media = document.createElement("span");

  media.textContent =
    ` Média: ${pessoa.mediafinal} `;

  media.className = "media";

  li.appendChild(media);


  /* =========================
     RESULTADO
  ========================= */

  const resultado = document.createElement("span");

  resultado.textContent = pessoa.resul;

  resultado.style.fontWeight = "bold";

  resultado.style.color =
    pessoa.resul === "Aprovado"
      ? "green"
      : "red";

  li.appendChild(resultado);


  /* =========================
     BOTÃO SALVAR ALTERAÇÕES
  ========================= */

  const btnAlterar =
    document.createElement("button");

  btnAlterar.textContent =
    "Salvar alterações";

  btnAlterar.className =
    "btn-salvar-alteracoes";


  btnAlterar.addEventListener(
    "click",
    async () => {

      const novoNome =
        nome.value.trim();

      const novaTurma =
        turma.value.trim();

      const novaNota1 =
        nota1.value.trim();

      const novaNota2 =
        nota2.value.trim();

      const novaNota3 =
        nota3.value.trim();


      if (
        !novoNome ||
        !novaTurma ||
        !novaNota1 ||
        !novaNota2 ||
        !novaNota3
      ) {

        alert(
          "Preencha todos os campos!"
        );

        return;

      }


      /* Calcular nova média */

      const novaMedia = (
        (Number(novaNota1) +
          Number(novaNota2) +
          Number(novaNota3)) / 3
      ).toFixed(2);


      /* Calcular resultado */

      const novoResultado =
        Number(novaMedia) >= 7
          ? "Aprovado"
          : "Reprovado";


      try {

        await editar(
          id,
          novoNome,
          novaTurma,
          novaNota1,
          novaNota2,
          novaNota3,
          novaMedia,
          novoResultado
        );

        await atualizarLista(
          buscaInput.value.toLowerCase()
        );


      } catch (err) {

        console.error(
          "Erro ao atualizar:",
          err
        );

        alert(
          "Ocorreu um erro ao salvar as alterações."
        );

      }

    }
  );


  li.appendChild(btnAlterar);


  /* =========================
     BOTÃO EXCLUIR
  ========================= */

  const btnExcluir =
    document.createElement("button");

  btnExcluir.textContent =
    "Excluir";

  btnExcluir.className =
    "btn-excluir";


  btnExcluir.addEventListener(
    "click",
    async () => {

      if (
        confirm(
          "Tem certeza que deseja excluir este cadastro?"
        )
      ) {

        try {

          await deletar(id);

          await atualizarLista(
            buscaInput.value.toLowerCase()
          );

        } catch (err) {

          console.error(
            "Erro ao excluir:",
            err
          );

          alert(
            "Ocorreu um erro ao excluir o cadastro."
          );

        }

      }

    }
  );


  li.appendChild(btnExcluir);

  lista.appendChild(li);
}


/* =========================
   ATUALIZAR LISTA
========================= */

async function atualizarLista(filtro = "") {
  try {
    const dados = await buscarTodos();

    lista.innerHTML = "";

    const alunos = Object.entries(dados);

    alunos.sort((a, b) =>
      a[1].nome.localeCompare(b[1].nome)
    );

    for (const [id, pessoa] of alunos) {
      renderItem(
        id,
        pessoa,
        filtro.toLowerCase()
      );
    }

  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    alert("Não foi possível carregar a lista.");
  }
};


/* =========================
   CARREGAR PÁGINA
========================= */

window.addEventListener(
  "load",
  () => {
    atualizarLista();
  }
);
const btnSair = document.getElementById("btnSair");

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("logado");
    window.location.replace("../login/login.html");
});
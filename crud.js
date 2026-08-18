import { database } from "./firebaseConfig.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const pessoasRef = collection(database, "pessoas");

// Salvar
export async function salvar(nome, turma, nota1, nota2, nota3, mediafinal) {
  await addDoc(pessoasRef, {
    nome: nome,
    turma: turma,
    nota1: nota1,
    nota2: nota2,
    nota3: nota3,
    mediafinal: mediafinal,
    resul: mediafinal < 7 ? "Reprovado" : "Aprovado"
  });
}

// Buscar todos
export async function buscarTodos() {
  const snapshot = await getDocs(pessoasRef);

  const pessoas = {};

  snapshot.forEach((documento) => {
    pessoas[documento.id] = documento.data();
  });

  return pessoas;
}

// Editar
export async function editar(
  id,
  nome,
  turma,
  nota1,
  nota2,
  nota3,
  mediafinal,
  resul
) {
  const itemRef = doc(database, "pessoas", id);

  await updateDoc(itemRef, {
    nome: nome,
    turma: turma,
    nota1: nota1,
    nota2: nota2,
    nota3: nota3,
    mediafinal: mediafinal,
    resul: resul
  });
}

// Deletar
export async function deletar(id) {
  const itemRef = doc(database, "pessoas", id);

  await deleteDoc(itemRef);
}
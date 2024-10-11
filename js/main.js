import ui from "./ui.js";
import api from "./api.js";

function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '');
}

const regexConteudo = /^[A-Za-z\s]{10,}$/;
const regexAutoria = /^[A-Za-z]{3,15}$/;

function validarConteudo(conteudo) {
    return regexConteudo.test(conteudo);
}
function validarAutoria(autoria) {
    return regexAutoria.test(autoria);
}

document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos();

    const formularioPensamento = document.getElementById("pensamento-form");
    const botaoCancelar = document.getElementById("botao-cancelar");
    const inputBusca = document.getElementById("campo-busca");

    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
    botaoCancelar.addEventListener("click", manipularCancelamento);
    inputBusca.addEventListener("input", manipularBusca);
})

    async function manipularSubmissaoFormulario (event) {
        event.preventDefault();
        const id = document.getElementById("pensamento-id").value;
        const conteudo = document.getElementById("pensamento-conteudo").value;
        const autoria = document.getElementById("pensamento-autoria").value;
        const data = document.getElementById("pensamento-data").value;

        const conteudoSemEspacos = removerEspacos(conteudo);
        const autoriaSemEspacos = removerEspacos(autoria);

        if(!validarConteudo(conteudoSemEspacos)) {
            alert("A inclusão de pensamentos permite somente letras e no mínimo 10 caracteres");
            return;
        }
        
        if(!validarAutoria(autoriaSemEspacos)) {
            alert("O autor deve conter somente letras e ter no mínimo 3 e no máximo 15 caracteres");
            return
        }

        if (!validarData(data)) {
            alert("Não é permitido o cadastro de datas futuras. Selecione outra data.")
            return
        }

        try{
            if (id) {
                await api.editarPensamento({ id, conteudo, autoria, data });
            } else {
                await api.salvarPensamento({ conteudo, autoria, data });
            }
            ui.renderizarPensamentos();
        }
        catch{
            alert("Erro ao salvar pensamento");
        }
}

function manipularCancelamento () {
    ui.limparFormulario();
}

async function manipularBusca() {
    const termoDeBusca = document.getElementById("campo-busca").value;
    try {
        const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoDeBusca);
        ui.renderizarPensamentos(pensamentosFiltrados);
    } catch (error) {
        alert("Erro ao realizar busca")
    }
}

function validarData (data) {
    const dataAtual = new Date();
    const dataInserida = new Date(data);
    return dataInserida <= dataAtual;
}
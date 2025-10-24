// ----------------- CONTROLE DE LOGIN -----------------
let usuarioLogado = false;

const usuarioValido = "admin";
const senhaValida = "123456";

// Login
document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (usuario === usuarioValido && senha === senhaValida) {
        alert("Login realizado com sucesso!");
        usuarioLogado = true; // usuário logado
        showSection('dashboard');
    } else {
        alert("Usuário ou senha inválidos!");
    }
});

// ----------------- CHAMADOS -----------------
// Carrega chamados do localStorage ou usa mock inicial
let chamados = JSON.parse(localStorage.getItem("chamados")) || [
    { id: 1, titulo: "Erro no computador", descricao: "O PC não liga", categoria: "Hardware", prioridade: "Alta", status: "Aberto" },
    { id: 2, titulo: "Falha no software", descricao: "Erro ao abrir o Word", categoria: "Software", prioridade: "Média", status: "Aberto" }
];

// Salva no localStorage
function salvarLocal() {
    localStorage.setItem("chamados", JSON.stringify(chamados));
}

// ----------------- NAVEGAÇÃO ENTRE TELAS -----------------
function showSection(sectionId) {
    // Bloqueia acesso ao dashboard e novo chamado se não estiver logado
    if ((sectionId === 'dashboard' || sectionId === 'novo') && !usuarioLogado) {
        alert("Você precisa fazer login para acessar esta seção!");
        sectionId = 'login';
    }

    document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    if (sectionId === 'dashboard') renderChamados();
}

// ----------------- DASHBOARD -----------------
function renderChamados() {
    const container = document.getElementById("listaChamados");
    container.innerHTML = "";

    let filtroCategoria = document.getElementById("filtroCategoria")?.value || "Todos";
    let filtroPrioridade = document.getElementById("filtroPrioridade")?.value || "Todos";

    let filtrados = chamados.filter(c =>
        (filtroCategoria === "Todos" || c.categoria === filtroCategoria) &&
        (filtroPrioridade === "Todos" || c.prioridade === filtroPrioridade)
    );

    if (filtrados.length === 0) {
        container.innerHTML = "<p>Nenhum chamado encontrado.</p>";
        return;
    }

    filtrados.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("chamado");
        div.innerHTML = `<strong>${c.titulo}</strong> [${c.prioridade}] - <em>${c.status}</em><br>
                         Categoria: ${c.categoria}<br>
                         ${c.descricao}<br>
                         <button onclick="fecharChamado(${c.id})">Fechar</button>`;
        container.appendChild(div);
    });
}

// Fechar chamado
function fecharChamado(id) {
    chamados = chamados.map(c => c.id === id ? { ...c, status: "Fechado" } : c);
    salvarLocal();
    renderChamados();
}

// ----------------- FORMULÁRIO DE NOVO CHAMADO -----------------
document.getElementById("formChamado").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!usuarioLogado) {
        alert("Você precisa fazer login para abrir um chamado!");
        showSection('login');
        return;
    }

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const categoria = document.getElementById("categoria").value;
    const prioridade = document.getElementById("prioridade").value;

    const novoChamado = {
        id: chamados.length + 1,
        titulo,
        descricao,
        categoria,
        prioridade,
        status: "Aberto"
    };

    chamados.push(novoChamado);
    salvarLocal();
    alert("Chamado salvo com sucesso!");
    this.reset();
    showSection('dashboard');
});

// ----------------- FILTROS -----------------
document.addEventListener("DOMContentLoaded", () => {
    const dashboard = document.getElementById("dashboard");
    const filtroDiv = document.createElement("div");
    filtroDiv.innerHTML = `
        <label>Filtrar Categoria:</label>
        <select id="filtroCategoria" onchange="renderChamados()">
            <option>Todos</option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Redes</option>
            <option>Outro</option>
        </select>
        <label>Filtrar Prioridade:</label>
        <select id="filtroPrioridade" onchange="renderChamados()">
            <option>Todos</option>
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
        </select>
    `;
    dashboard.prepend(filtroDiv);
    renderChamados();
});

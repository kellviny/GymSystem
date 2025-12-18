class AppController {
    constructor() {
        this.user = db.getUsuarioLogado();
        if (!this.user) db.logout();

        // 1. Polimorfismo Visual: Muda cor e título baseada na classe
        const info = this.user.getDashboardInfo();
        document.getElementById('tituloPainel').innerText = info.titulo;
        const badge = document.getElementById('badgeUser');
        badge.innerText = this.user.constructor.name; // "Admin", "Instrutor" ou "Aluno"
        badge.style.background = info.cor;
        document.getElementById('nomeUser').innerText = this.user.nome;

        this.rotearVisualizacao();
    }

    rotearVisualizacao() {
        // Verifica instância (instanceof) para mostrar a div correta
        if (this.user instanceof Admin) {
            document.getElementById('viewAdmin').classList.remove('hidden');
        } 
        else if (this.user instanceof Instrutor) {
            document.getElementById('viewInstrutor').classList.remove('hidden');
            this.carregarSelectAlunos();
        } 
        else if (this.user instanceof Aluno) {
            document.getElementById('viewAluno').classList.remove('hidden');
            this.carregarTreinosAluno();
        }
    }

    // Lógica de Admin
    cadastrarUsuario() {
        const tipo = document.getElementById('novoTipo').value;
        const nome = document.getElementById('novoNome').value;
        const email = document.getElementById('novoEmail').value;
        const senha = document.getElementById('novoSenha').value;
        const extra = document.getElementById('novoExtra').value; // Matrícula ou CREF

        let novo;
        if (tipo === 'aluno') novo = new Aluno(nome, email, senha, extra);
        else novo = new Instrutor(nome, email, senha, extra);

        const lista = db.getUsuarios();
        lista.push(novo);
        db.salvarUsuarios(lista);
        alert("Cadastrado com sucesso!");
        location.reload();
    }

    // Lógica de Instrutor
    carregarSelectAlunos() {
        const users = db.getUsuarios();
        const alunos = users.filter(u => u instanceof Aluno);
        const select = document.getElementById('selectAlunos');
        alunos.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.email;
            opt.innerText = `${a.nome} (${a.matricula})`;
            select.appendChild(opt);
        });
    }

    criarTreino() {
        const emailAluno = document.getElementById('selectAlunos').value;
        const desc = document.getElementById('descTreino').value;
        const treino = new Treino(emailAluno, desc, this.user.nome);
        db.salvarTreino(treino);
        alert("Treino enviado!");
        document.getElementById('descTreino').value = '';
    }

    // Lógica de Aluno
    carregarTreinosAluno() {
        const todosTreinos = db.getTreinos();
        // Filtra apenas os treinos deste aluno
        const meus = todosTreinos.filter(t => t.emailAluno === this.user.email);
        const div = document.getElementById('listaTreinos');
        
        if(meus.length === 0) div.innerHTML = "<p>Sem treinos ainda.</p>";
        else {
            div.innerHTML = meus.map(t => `
                <div class="card">
                    <strong>Instrutor: ${t.instrutor}</strong> <small>(${t.data})</small>
                    <p>${t.descricao}</p>
                </div>
            `).join('');
        }
    }
}
const app = new AppController();
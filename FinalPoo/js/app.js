class AppController {
    constructor() {
        this.user = db.getUsuarioLogado();
        if (!this.user) db.logout();

        // Muda cor e título baseada na classe
        const info = this.user.getDashboardInfo();
        document.getElementById('tituloPainel').innerText = info.titulo;
        const badge = document.getElementById('badgeUser');
        badge.innerText = this.user.constructor.name; // "Admin", "Instrutor" ou "Aluno"
        badge.style.background = info.cor;
        document.getElementById('nomeUser').innerText = this.user.nome;

        this.rotearVisualizacao();
    }

    rotearVisualizacao() {
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
        if (this.user instanceof Admin) {
        document.getElementById('viewAdmin').classList.remove('hidden');
        this.renderizarListaUsuarios(); // Nova chamada para carregar a lista
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
        this.renderizarListaUsuarios();
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

    calcularIMC() {
    const peso = parseFloat(document.getElementById('pesoIMC').value);
    const altura = parseFloat(document.getElementById('alturaIMC').value);
    const visor = document.getElementById('resultadoIMC');
    const valorSpan = document.getElementById('valorIMC');
    const classifSpan = document.getElementById('classificacaoIMC');

    if (peso > 0 && altura > 0) {
        const imc = (peso / (altura * altura)).toFixed(2);
        let classificacao = "";

        if (imc < 18.5) classificacao = "Abaixo do peso";
        else if (imc < 24.9) classificacao = "Peso normal";
        else if (imc < 29.9) classificacao = "Sobrepeso";
        else classificacao = "Obesidade";

        valorSpan.innerText = imc;
        classifSpan.innerText = classificacao;
        visor.style.display = 'block';
    } else {
        alert("Por favor, insira valores válidos para peso e altura.");
        }
    }

    renderizarListaUsuarios() {
    const container = document.getElementById('listaUsuariosAdm');
    const usuarios = db.getUsuarios(); // Recupera todos os usuários do banco
    
    container.innerHTML = '';

    usuarios.forEach(u => {
        const div = document.createElement('div');
        div.className = 'card';
        
        // Define uma cor de borda ou ícone baseada no tipo (Polimorfismo)
        let icone = 'fa-user';
        let cor = '#3498db';
        
        if (u instanceof Admin) {
            icone = 'fa-user-shield';
            cor = '#e74c3c';
        } else if (u instanceof Instrutor) {
            icone = 'fa-chalkboard-teacher';
            cor = '#f39c12';
        }

        div.style.borderLeftColor = cor;
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${icone}" style="color: ${cor}; font-size: 1.2rem;"></i>
                <div>
                    <strong>${u.nome}</strong><br>
                    <small>${u.email}</small><br>
                    <span class="badge" style="background: ${cor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">
                        ${u.constructor.name.toUpperCase()}
                    </span>
                </div>
            </div>
        `;
        container.appendChild(div);
        });
    }
}
const app = new AppController();
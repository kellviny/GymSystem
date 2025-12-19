class BancoDeDados {
    constructor() {
        this.KEY_USERS = 'gym_simple_users';
        this.KEY_TREINOS = 'gym_simple_treinos';
        this.KEY_SESSAO = 'gym_simple_session';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.KEY_USERS)) {
            const seed = [
                new Admin("Admin Geral", "admin@gym.com", "123"),
                new Instrutor("João Treinador", "instrutor@gym.com", "123", "CREF-001"),
                new Aluno("Maria Aluna", "aluno@gym.com", "123", "202401")
            ];
            this.salvarUsuarios(seed);
        }
    }

    // Recupera e REIDRATA os objetos 
    getUsuarios() {
        const raw = JSON.parse(localStorage.getItem(this.KEY_USERS) || '[]');
        return raw.map(u => {
            if (u.tipo === 'Admin') return new Admin(u.nome, u.email, u.senha);
            if (u.tipo === 'Instrutor') return new Instrutor(u.nome, u.email, u.senha, u.cref);
            if (u.tipo === 'Aluno') return new Aluno(u.nome, u.email, u.senha, u.matricula);
        });
    }

    salvarUsuarios(lista) {
        localStorage.setItem(this.KEY_USERS, JSON.stringify(lista.map(u => u.toJSON())));
    }

    getTreinos() { return JSON.parse(localStorage.getItem(this.KEY_TREINOS) || '[]'); }
    
    salvarTreino(treino) {
        const lista = this.getTreinos();
        lista.push(treino);
        localStorage.setItem(this.KEY_TREINOS, JSON.stringify(lista));
    }

    // Sessão
    login(usuario) { sessionStorage.setItem(this.KEY_SESSAO, JSON.stringify(usuario.toJSON())); }
    
    logout() { 
        sessionStorage.removeItem(this.KEY_SESSAO); 
        window.location.href = 'index.html'; 
    }

    getUsuarioLogado() {
        const u = JSON.parse(sessionStorage.getItem(this.KEY_SESSAO));
        if (!u) return null;
        if (u.tipo === 'Admin') return new Admin(u.nome, u.email, u.senha);
        if (u.tipo === 'Instrutor') return new Instrutor(u.nome, u.email, u.senha, u.cref);
        if (u.tipo === 'Aluno') return new Aluno(u.nome, u.email, u.senha, u.matricula);
    }
}
const db = new BancoDeDados();
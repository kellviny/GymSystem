// CLASSE BASE (ABSTRAÇÃO E ENCAPSULAMENTO)
class Usuario {
    #nome;
    #email;
    #senha;

    constructor(nome, email, senha) {
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
    }

    // Getters para acessar dados privados (ENCAPSULAMENTO)
    get nome() { return this.#nome; }
    get email() { return this.#email; }
    
    autenticar(senhaInput) {
        return this.#senha === senhaInput;
    }

    // Método que será sobrescrito (POLIMORFISMO)
    getDashboardInfo() {
        return { titulo: "Usuário", cor: "#ccc" };
    }

    // Serialização para salvar no LocalStorage
    toJSON() {
        return {
            tipo: this.constructor.name,
            nome: this.#nome,
            email: this.#email,
            senha: this.#senha
        };
    }
}

// HERANÇA: Admin é um Usuário
class Admin extends Usuario {
    constructor(nome, email, senha) {
        super(nome, email, senha);
    }

    getDashboardInfo() {
        return { titulo: "Painel Administrativo", cor: "#e74c3c" }; // Vermelho
    }
}

// HERANÇA: Instrutor é um Usuário
class Instrutor extends Usuario {
    #cref;

    constructor(nome, email, senha, cref) {
        super(nome, email, senha);
        this.#cref = cref;
    }

    get cref() { return this.#cref; }

    getDashboardInfo() {
        return { titulo: "Área do Treinador", cor: "#f39c12" }; // Laranja
    }

    toJSON() {
        return { ...super.toJSON(), cref: this.#cref };
    }
}

// HERANÇA: Aluno é um Usuário
class Aluno extends Usuario {
    #matricula;

    constructor(nome, email, senha, matricula) {
        super(nome, email, senha);
        this.#matricula = matricula;
    }

    get matricula() { return this.#matricula; }

    getDashboardInfo() {
        return { titulo: "Área do Aluno", cor: "#2ecc71" }; // Verde
    }

    toJSON() {
        return { ...super.toJSON(), matricula: this.#matricula };
    }
}

// CLASSE DE DADOS (TREINO)
class Treino {
    constructor(emailAluno, descricao, instrutor) {
        this.emailAluno = emailAluno;
        this.descricao = descricao;
        this.instrutor = instrutor;
        this.data = new Date().toLocaleDateString('pt-BR');
    }
}
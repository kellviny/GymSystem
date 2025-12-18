function validar() {
    const input = document.getElementById('inputAcesso').value;
    const visor = document.getElementById('visor');
    const usuarios = db.getUsuarios();

    // Busca polimórfica: Procura se o input bate com email OU matrícula
    const user = usuarios.find(u => {
        // Se for Aluno, verifica matrícula (acesso a campo privado via getter)
        if (u instanceof Aluno && u.matricula === input) return true;
        return u.email === input;
    });

    if (user) {
        visor.innerText = `BEM-VINDO, ${user.nome.toUpperCase()}`;
        visor.className = "visor";
    } else {
        visor.innerText = "ACESSO NEGADO";
        visor.className = "visor bloqueado";
    }

    // Reseta após 2s
    setTimeout(() => {
        visor.innerText = "AGUARDANDO...";
        visor.className = "visor";
        document.getElementById('inputAcesso').value = '';
    }, 2000);
}
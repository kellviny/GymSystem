function validar() {
    const input = document.getElementById('inputAcesso').value;
    const visor = document.getElementById('visor');
    const usuarios = db.getUsuarios();

    const user = usuarios.find(u => {
        if (u instanceof Aluno && u.matricula === input) return true;
        if (u instanceof Instrutor && u.cref === input) return true;
        return u.email === input;
    });

    if (user) {
        visor.innerText = `BEM-VINDO, ${user.nome.toUpperCase()}`;
        visor.className = "visor success";
    } else {
        visor.innerText = "ACESSO NEGADO";
        visor.className = "visor error"; 
    }

    setTimeout(() => {
        visor.innerText = "AGUARDANDO...";
        visor.className = "visor";
        document.getElementById('inputAcesso').value = '';
    }, 2000);
}
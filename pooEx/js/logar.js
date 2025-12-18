function logar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const usuarios = db.getUsuarios();
    
    // Abstração: O método autenticar encapsula a comparação
    const user = usuarios.find(u => u.email === email && u.autenticar(senha));

    if (user) {
        db.login(user);
        window.location.href = 'painel.html';
    } else {
        alert('Acesso negado');
    }
}
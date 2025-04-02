// Adiciona evento ao botão de login
document.getElementById('login-button').addEventListener('click', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do clique

    // Obtém os valores do formulário
    const email = document.querySelector('input[name="email"]').value;
    const senha = document.querySelector('input[name="password"]').value;

    // Elemento para exibir erros
    const passwordErrorElement = document.getElementById('password-error');

    // Validações simples
    if (!email || !senha) {
        passwordErrorElement.textContent = 'Email e senha são obrigatórios!';
        passwordErrorElement.style.color = 'red';
        return;
    }

    try {
        // Faz a requisição ao backend
        const response = await fetch('https://localhost:3300/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            // Exibe mensagem de erro no caso de falha
            passwordErrorElement.textContent = data.mensagem;
            passwordErrorElement.style.color = 'red';
            return;
        }

        // Login bem-sucedido: Salva o token e redireciona
        localStorage.setItem('authToken', data.token);
        alert('Login bem-sucedido!');
        window.location.href = './home.html'; // Redireciona para outra página
    } catch (error) {
        console.error('Erro na requisição:', error);
        passwordErrorElement.textContent = 'Erro ao conectar ao servidor.';
        passwordErrorElement.style.color = 'red';
    }
});

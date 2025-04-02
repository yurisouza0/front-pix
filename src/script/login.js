document.getElementById('login-button').addEventListener('click', async (event) => {
    event.preventDefault(); 

    const email = document.querySelector('input[name="email"]').value.trim();
    const senha = document.querySelector('input[name="password"]').value.trim();

    const passwordErrorElement = document.getElementById('password-error');
    passwordErrorElement.textContent = ''; 

    if (!email || !senha) {
        passwordErrorElement.textContent = 'Email e senha são obrigatórios!';
        passwordErrorElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:3300/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            passwordErrorElement.textContent = data.mensagem || 'Erro no login!';
            passwordErrorElement.style.color = 'red';
            console.log('Erro no login:', data.mensagem);
            return;
        }

        localStorage.setItem('authToken', data.token);
        console.log('Login bem-sucedido. Token salvo:', data.token);

        alert('Login bem-sucedido!');
        window.location.href = './home.html';
    } catch (error) {
        console.error('Erro na requisição:', error);
        passwordErrorElement.textContent = 'Erro ao conectar ao servidor.';
        passwordErrorElement.style.color = 'red';
    }
});

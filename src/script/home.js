document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const passwordErrorElement = document.getElementById('password-error');

    if (!token) {
        passwordErrorElement.textContent = 'Você precisa fazer login!';
        passwordErrorElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:3300/rota-protegida', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            passwordErrorElement.textContent = data.mensagem;
            passwordErrorElement.style.color = 'red';
            return;
        }

    } catch (error) {
        passwordErrorElement.textContent = 'Erro ao conectar ao servidor.';
        passwordErrorElement.style.color = 'red';
    }
});

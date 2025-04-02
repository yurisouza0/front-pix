document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken'); // Recupera o token JWT armazenado

    if (!token) {
        Swal.fire({
            title: 'Acesso negado!',
            text: 'Você precisa fazer login para acessar esta página!',
            icon: 'error',
            timer: 3000, // O alerta fecha automaticamente após 3 segundos
            showConfirmButton: false // Remove o botão "OK"
        });
    
        setTimeout(() => {
            window.location.href = '/src/login.html'; // Redireciona para login
        }, 2000); // Aguarda 3 segundos antes de redirecionar
        return;
    }
    try {
        // Faz a verificação do token com a API
        const response = await fetch('http://localhost:3300/rota-protegida', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        });

        const data = await response.json();
        if (!response.ok) {
            Swal.fire({
                title: 'Erro de autenticação!',
                text: data.mensagem, // Mensagem retornada do servidor
                icon: 'warning', // Alerta do tipo "warning"
                timer: 3000, // O alerta fecha automaticamente após 3 segundos
                showConfirmButton: false // Remove o botão "OK"
            });
        
            setTimeout(() => {
                window.location.href = '/src/login.html'; // Redireciona para a página de login após o alerta
            }, 3000); // Aguarda o tempo do alerta antes de redirecionar
            return;
        }

        // Estabelece a conexão WebSocket após autenticação bem-sucedida
        const socket = new WebSocket('ws://localhost:3300'); // Substitua pela URL do servidor WebSocket

        socket.onopen = () => {
            console.log('Conexão WebSocket estabelecida!');
            // Envia o token JWT ao servidor para autenticar a conexão WebSocket
            socket.send(JSON.stringify({ type: 'auth', token }));
        };

        socket.onmessage = (event) => {
            console.log('Mensagem do servidor:', event.data);
            // Trate mensagens recebidas do WebSocket aqui
        };

        socket.onerror = (error) => {
            console.error('Erro na conexão WebSocket:', error);
        };

        socket.onclose = () => {
            console.log('Conexão WebSocket fechada!');
        };

    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        alert('Erro ao conectar ao servidor.');
    }
});

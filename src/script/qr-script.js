document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3300'); // URL do servidor WebSocket

    // Evento ao abrir a conexão WebSocket
    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida!');

        // Recupera o token do localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            // Envia o token para autenticar
            socket.send(JSON.stringify({ type: 'auth', token }));
            console.log('Token enviado para autenticação:', token);
        } else {
            console.error('Token não encontrado no localStorage. Você precisa fazer login.');
        }
    };

    // Evento ao receber mensagens do servidor
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Mensagem recebida do servidor:', data);

            // Confirmação de autenticação
            if (data.mensagem === 'Autenticação bem-sucedida!') {
                console.log('Autenticação realizada com sucesso!');
                // Após autenticação, solicita o QR Code inicial
                socket.send(JSON.stringify({ type: 'fetch-qr' }));
            }

            // Atualiza automaticamente o QR Code ao receber mensagem com QR Code
            if (data.qrCode) {
                const qrCodeImg = document.getElementById('qr-code');
                if (qrCodeImg) {
                    qrCodeImg.src = data.qrCode; // Define o QR Code no elemento <img>
                    console.log('QR Code atualizado no frontend!');
                } else {
                    console.error('Elemento <img> com id "qr-code" não encontrado!');
                }
            }

            // Exibe mensagens adicionais do servidor
            if (data.mensagem && !data.qrCode) {
                console.log('Mensagem do servidor:', data.mensagem);
                const errorElement = document.getElementById('error-message');
                errorElement.textContent = data.mensagem || 'Erro desconhecido.';
            }
        } catch (error) {
            console.error('Erro ao processar mensagem do servidor:', error);
        }
    };

    // Evento ao fechar a conexão WebSocket
    socket.onclose = () => {
        console.warn('Conexão WebSocket fechada.');
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'Conexão perdida com o servidor. Tente novamente mais tarde.';
    };

    // Evento ao ocorrer erro na conexão WebSocket
    socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'Erro na conexão com o servidor. Verifique sua rede.';
    };
});

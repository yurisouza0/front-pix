document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3300'); // Substitua pela URL do servidor WebSocket

    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida!');
        // Enviar uma solicitação para o QR Code (se necessário)
        socket.send(JSON.stringify({ type: 'fetch-qr' }));
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.qrCode) {
                // Atualiza o src da imagem com a Base64 retornada
                document.getElementById('qr-code').src = data.qrCode;
            } else if (data.mensagem) {
                // Exibe mensagem de erro se o QR Code não estiver disponível
                document.getElementById('error-message').textContent = data.mensagem;
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
            document.getElementById('error-message').textContent = 'Erro ao conectar ao servidor.';
        }
    };

    socket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        document.getElementById('error-message').textContent = 'Erro na conexão WebSocket.';
    };

    socket.onclose = () => {
        console.log('Conexão WebSocket fechada.');
    };
});

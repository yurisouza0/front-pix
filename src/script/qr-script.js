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

        // Atualiza o QR Code no elemento <img> se recebido do servidor
        if (data.qrCode) {
            const qrCodeImg = document.getElementById('qr-code');
            if (qrCodeImg) {
                qrCodeImg.src = data.qrCode; // Atualiza o atributo "src" com o QR Code base64
                console.log('QR Code atualizado com sucesso!');
            } else {
                console.error('Elemento <img> com id "qr-code" não foi encontrado no HTML!');
            }
        }

        // Exibe mensagens adicionais, se houver
        if (data.mensagem) {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.textContent = data.mensagem;
            }
        }
    } catch (error) {
        console.error('Erro ao processar mensagem do servidor:', error);
    }
};

    socket.onclose = () => {
        console.log('Conexão WebSocket fechada.');
    };
});

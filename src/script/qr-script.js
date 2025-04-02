document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3300'); // Substitua pela URL do servidor WebSocket

    // Evento ao abrir a conexão WebSocket
    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida!');
        // Solicita o QR Code ao servidor
        socket.send(JSON.stringify({ type: 'fetch-qr' }));
    };

    // Evento ao receber mensagens do servidor WebSocket
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data); // Tenta processar os dados recebidos
            console.log('Mensagem recebida do servidor:', data);

            if (data.qrCode) {
                const qrCodeImg = document.getElementById('qr-code');
                if (qrCodeImg) {
                    qrCodeImg.src = data.qrCode; // Atualiza o elemento <img> com o QR Code
                    console.log('QR Code atualizado no frontend!');
                } else {
                    console.error('Elemento <img> com id "qr-code" não encontrado!');
                }
            } else if (data.mensagem) {
                const errorElement = document.getElementById('error-message');
                errorElement.textContent = data.mensagem || 'Erro desconhecido.';
                console.error('Mensagem do servidor:', data.mensagem);
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

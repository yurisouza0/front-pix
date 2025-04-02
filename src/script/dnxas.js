document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken'); 

    if (!token) {
        Swal.fire({
            title: 'Acesso negado!',
            text: 'Você precisa fazer login para acessar esta página!',
            icon: 'error',
            timer: 2000, 
            showConfirmButton: false
        });
    
        setTimeout(() => {
            window.location.href = '/src/login.html'; 
        }, 2000);
        return;
    }

    try {

        const response = await fetch('https://back-pix.onrender.com/rota-protegida', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            Swal.fire({
                title: 'Erro de autenticação!',
                text: data.mensagem,
                icon: 'warning',
                timer: 3000,
                showConfirmButton: false
            });

            setTimeout(() => {
                window.location.href = '/src/login.html';
            }, 3000);
            return;
        }


        const socket = new WebSocket('wss://back-pix.onrender.com');

        socket.onopen = () => {
            console.log('Conexão WebSocket estabelecida!');
            socket.send(JSON.stringify({ type: 'auth', token }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

 
            if (data.mensagem === 'Token inválido. Conexão será encerrada.') {
                Swal.fire({
                    title: 'Sessão Expirada!',
                    text: 'Por favor, faça login novamente.',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '/src/login.html';
                }, 3000);
                socket.close();
                return;
            }

            if (data.qrCode) {
                const qrCodeImg = document.getElementById('qr-code');
                if (qrCodeImg) {
                    qrCodeImg.src = data.qrCode;
                } else {
                    console.error('Elemento <img> para QR Code não encontrado!');
                }
            }

            if (data.mensagem) {
                document.getElementById('error-message').textContent = data.mensagem;
            }

            console.log('Mensagem recebida do servidor:', data);
        };

        socket.onerror = (error) => {
            console.error('Erro na conexão WebSocket:', error);
            Swal.fire({
                title: 'Erro de Conexão!',
                text: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        };

        socket.onclose = () => {
            console.log('Conexão WebSocket fechada!');
        };

    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao conectar ao servidor.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        });
    }
});

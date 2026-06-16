document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginScreen = document.getElementById("login-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");
    
    const usernameInput = document.getElementById("username-input");
    const welcomeUser = document.getElementById("welcome-user");

    // ADICIONADO: Captura o botão de voltar para a tela de login
    const logoutBtn = document.getElementById("logout-btn");

    // AÇÃO 1: Fazer Login (Ir para a Dashboard)
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nomeUsuario = usernameInput.value.trim().toUpperCase();

            if (nomeUsuario) {
                welcomeUser.textContent = `OLÁ, ${nomeUsuario}`;
            }

            loginScreen.classList.add("hidden");
            dashboardScreen.classList.remove("hidden");
        });
    }

    // AÇÃO 2: Fazer Logout (Voltar para a Tela de Login)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            // Impede o link de tentar navegar para outra página real (#)
            event.preventDefault();

            // Esconde a Dashboard
            dashboardScreen.classList.add("hidden");

            // Exibe a Tela de Login novamente
            loginScreen.classList.remove("hidden");

            // Opcional: Limpa o campo de senha para o próximo login por segurança
            const passwordInput = loginForm.querySelector('input[type="password"]');
            if (passwordInput) passwordInput.value = "";
        });
    }
});
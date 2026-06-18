document.addEventListener("DOMContentLoaded", () => {
    // Telas
    const loginScreen = document.getElementById("login-screen");
    const forgotScreen = document.getElementById("forgot-screen");
    const signupScreen = document.getElementById("signup-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");

    // Formulários e Inputs
    const loginForm = document.getElementById("login-form");
    const forgotForm = document.getElementById("forgot-form");
    const signupForm = document.getElementById("signup-form");
    const usernameInput = document.getElementById("username-input");
    const welcomeUser = document.getElementById("welcome-user");

    // Links de Redirecionamento da Tela de Login
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const registerLink = document.getElementById("register-link");
    
    // Botões de Voltar
    const backToLoginButtons = document.querySelectorAll(".back-to-login");
    const logoutBtn = document.getElementById("logout-btn");

    // --- NAVEGAÇÃO DA TELA DE LOGIN ---

    // Ir para tela de Esqueceu a Senha
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.classList.add("hidden");
        forgotScreen.classList.remove("hidden");
    });

    // Ir para tela de Cadastre-se
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.classList.add("hidden");
        signupScreen.classList.remove("hidden");
    });

    // Função universal para as setas voltarem para o Login
    backToLoginButtons.forEach(button => {
        button.addEventListener("click", () => {
            forgotScreen.classList.add("hidden");
            signupScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            
            // Limpa os formulários ao voltar
            forgotForm.reset();
            signupForm.reset();
        });
    });

    // --- ENVIOS DE FORMULÁRIO (SUBMITS) ---

    // Submit: Entrar na Dashboard
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

    // Submit: Alterar Senha (Esqueceu a senha)
    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            // Exibe mensagem de sucesso solicitada
            alert("A troca de senha foi concluída com sucesso!");
            
            // Redireciona de volta para a tela de login
            forgotScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            forgotForm.reset();
        });
    }

    // Submit: Cadastrar Nova Conta
    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            // Exibe mensagem de sucesso
            alert("Cadastro concluído com sucesso! Agora você já pode fazer login.");
            
            // Redireciona de volta para a tela de login
            signupScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            signupForm.reset();
        });
    }

    // --- LOGOUT (DASHBOARD PARA LOGIN) ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            dashboardScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            loginForm.reset(); // Limpa dados da sessão anterior
        });
    }
});
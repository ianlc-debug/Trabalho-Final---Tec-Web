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
    
    // Botões de Voltar e Logout
    const backToLoginButtons = document.querySelectorAll(".back-to-login");
    const logoutBtn = document.getElementById("logout-btn");

    // --- NAVEGAÇÃO DA TELA DE LOGIN ---
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.classList.add("hidden");
        forgotScreen.classList.remove("hidden");
    });

    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.classList.add("hidden");
        signupScreen.classList.remove("hidden");
    });

    backToLoginButtons.forEach(button => {
        button.addEventListener("click", () => {
            forgotScreen.classList.add("hidden");
            signupScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            forgotForm.reset();
            signupForm.reset();
        });
    });

    // --- ENVIOS DE FORMULÁRIO (SUBMITS) ---
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

    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            alert("A troca de senha foi concluída com sucesso!");
            forgotScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            forgotForm.reset();
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            alert("Cadastro concluído com sucesso! Agora você já pode fazer login.");
            signupScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            signupForm.reset();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            dashboardScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            loginForm.reset();
        });
    }


    // ================= MODAL E RENDERIZAÇÃO DE ATÉ 5 GRUPOS =================
    
    const createGroupBtn = document.querySelector(".btn-create");
    const modalOverlay = document.getElementById("create-group-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const createGroupForm = document.getElementById("create-group-form");
    
    const emptyGroupsState = document.getElementById("empty-groups-state");
    const groupsGrid = document.getElementById("groups-grid");

    // Cores pastéis baseadas na sua identidade visual
    const cardColors = ["#e3f6e6", "#fde3ed", "#fce9b7", "#e3f1fd"];
    let totalGroupsCreated = 0;

    // Abrir o modal
    if (createGroupBtn && modalOverlay) {
        createGroupBtn.addEventListener("click", () => {
            modalOverlay.classList.remove("hidden");
        });
    }

    // Fechar o modal no X
    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener("click", () => {
            modalOverlay.classList.add("hidden");
        });
    }

    // Fechar o modal clicando fora da caixa
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (event) => {
            if (event.target === modalOverlay) {
                modalOverlay.classList.add("hidden");
            }
        });
    }

    // Formulário de Criação Concluído
    if (createGroupForm) {
        createGroupForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const groupName = createGroupForm.querySelector('input[placeholder="Nome do Grupo"]').value.trim();
            const groupSubject = createGroupForm.querySelector('input[placeholder="Matéria/Curso"]').value.trim();

            // Esconde a mensagem de "Nenhum grupo no momento"
            if (totalGroupsCreated === 0 && emptyGroupsState) {
                emptyGroupsState.classList.add("hidden");
            }

            // AJUSTE: O operador % faz as 4 cores pastéis girarem infinitamente sem dar erro
            const colorIndex = totalGroupsCreated % cardColors.length;
            const currentCardColor = cardColors[colorIndex];

            // AJUSTE: Permite criar infinitamente, mas só bota no HTML se tiver menos de 5 na tela
            if (totalGroupsCreated < 5) {
                const cardHTML = `
                    <div class="custom-group-card" style="background-color: ${currentCardColor};">
                        <div class="group-card-icon-circle">📖</div>
                        <h4>${groupName}</h4>
                        <p>${groupSubject}</p>
                    </div>
                `;
                groupsGrid.insertAdjacentHTML("beforeend", cardHTML);
            }

            // Sempre soma o total de grupos criados pelo usuário
            totalGroupsCreated++;

            // Mensagem de sucesso aparece SEMPRE, sem limites de criação!
            alert("O grupo foi criado com sucesso!");

            // Reseta o modal
            modalOverlay.classList.add("hidden");
            createGroupForm.reset();
        });
    }
});
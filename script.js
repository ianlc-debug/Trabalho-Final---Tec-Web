document.addEventListener("DOMContentLoaded", () => {
    // ================= SELECTORES DE TELAS E AUTENTICAÇÃO =================
    const loginScreen = document.getElementById("login-screen");
    const signupScreen = document.getElementById("signup-screen");
    const forgotScreen = document.getElementById("forgot-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const forgotForm = document.getElementById("forgot-form");

    const usernameInput = document.getElementById("username-input");
    const welcomeUserText = document.getElementById("welcome-user");

    // Links de transição de tela
    const registerLink = document.getElementById("register-link");
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const backToLoginButtons = document.querySelectorAll(".back-to-login");
    const logoutBtn = document.getElementById("logout-btn");

    // ================= COMPORTAMENTO: FLUXO DE TELAS (AUTH) =================

    // Ir para tela de Cadastro
    if (registerLink) {
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginScreen.classList.add("hidden");
            signupScreen.classList.remove("hidden");
        });
    }

    // Ir para tela de Recuperar Senha
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginScreen.classList.add("hidden");
            forgotScreen.classList.remove("hidden");
        });
    }

    // Botões de voltar (setinhas) para o Login
    backToLoginButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            signupScreen.classList.add("hidden");
            forgotScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
        });
    });

    // Simulação de Login (Entrar na Dashboard)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userValue = usernameInput.value.trim() || "ALUNO(A)";
            
            // Personaliza o banner de boas-vindas com o nome digitado
            if (welcomeUserText) {
                welcomeUserText.textContent = `OLÁ, ${userValue.toUpperCase()}`;
            }

            loginScreen.classList.add("hidden");
            dashboardScreen.classList.remove("hidden");
        });
    }

    // Simulação de Cadastro bem-sucedido
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Conta criada com sucesso! Faça seu login.");
            signupScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            signupForm.reset();
        });
    }

    // Simulação de Troca de Senha
    if (forgotForm) {
        forgotForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Senha alterada com sucesso!");
            forgotScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            forgotForm.reset();
        });
    }

    // Botão de Logout (Sair da Dashboard)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            dashboardScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            if (loginForm) loginForm.reset();
        });
    }


    // ================= NAVEGAÇÃO ENTRE ABAS DA DASHBOARD =================
    const navInicioBtn = document.getElementById("nav-inicio-btn");
    const navGruposBtn = document.getElementById("nav-grupos-btn");
    const viewInicio = document.getElementById("view-inicio");
    const viewGrupos = document.getElementById("view-grupos");

    function resetActiveNav() {
        navInicioBtn.classList.remove("active");
        navGruposBtn.classList.remove("active");
    }

    if (navInicioBtn && navGruposBtn) {
        navInicioBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navInicioBtn.classList.add("active");
            viewGrupos.classList.add("hidden");
            viewInicio.classList.remove("hidden");
        });

        navGruposBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navGruposBtn.classList.add("active");
            viewInicio.classList.add("hidden");
            viewGrupos.classList.remove("hidden");
        });
    }


    // ================= GERENCIAMENTO DINÂMICO DOS GRUPOS =================
    const createGroupBtn = document.querySelector(".btn-create");
    const modalOverlay = document.getElementById("create-group-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const createGroupForm = document.getElementById("create-group-form");
    
    // Containers da aba Início (Destaques)
    const emptyGroupsState = document.getElementById("empty-groups-state");
    const groupsGrid = document.getElementById("groups-grid");

    // Containers da aba Grupos: Seção Meus Grupos
    const emptyMyGroupsState = document.getElementById("empty-my-groups-state");
    const myGroupsGrid = document.getElementById("my-groups-grid");

    // Containers da aba Grupos: Seção Grupos Privados
    const joinPrivateGroupForm = document.getElementById("join-private-group-form");
    const privateGroupCodeInput = document.getElementById("private-group-code-input");
    const emptyPrivateGroupsState = document.getElementById("empty-private-groups-state");
    const privateGroupsGrid = document.getElementById("private-groups-grid");

    // Paleta de Cores Pasteis Rotativas para os Cards de Grupo
    const cardColors = ["#e3f6e6", "#fde3ed", "#fce9b7", "#e3f1fd"];
    let totalGroupsCreated = 0;
    let totalPrivateGroupsJoined = 0;

    // Controladores do Modal de Criação
    if (createGroupBtn && modalOverlay) {
        createGroupBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
    }
    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
    }
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
        });
    }

    // AÇÃO: Usuário CRIA um grupo no Modal
    if (createGroupForm) {
        createGroupForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Captura os dados internos do Form
            const groupName = createGroupForm.querySelector('input[placeholder="Nome do Grupo"]').value.trim();
            const groupSubject = createGroupForm.querySelector('input[placeholder="Matéria/Curso"]').value.trim();
            const currentCardColor = cardColors[totalGroupsCreated % cardColors.length];

            // 1. Renderiza no Início (Destaques) -> Limite estético de até 5 cards no painel inicial
            if (totalGroupsCreated < 5) {
                if (totalGroupsCreated === 0 && emptyGroupsState) {
                    emptyGroupsState.classList.add("hidden");
                }
                const featuredCardHTML = `
                    <div class="custom-group-card" style="background-color: ${currentCardColor};">
                        <div class="group-card-icon-circle">📖</div>
                        <h4>${groupName}</h4>
                        <p>${groupSubject}</p>
                    </div>
                `;
                if (groupsGrid) groupsGrid.insertAdjacentHTML("beforeend", featuredCardHTML);
            }

            // 2. Renderiza na Seção "Meus Grupos" (Na aba de Grupos) -> Sem limite de cards
            if (totalGroupsCreated === 0 && emptyMyGroupsState) {
                emptyMyGroupsState.classList.add("hidden");
            }
            const myGroupCardHTML = `
                <div class="custom-group-card" style="background-color: ${currentCardColor};">
                    <div class="group-card-icon-circle">📖</div>
                    <h4>${groupName}</h4>
                    <p>${groupSubject}</p>
                </div>
            `;
            if (myGroupsGrid) myGroupsGrid.insertAdjacentHTML("beforeend", myGroupCardHTML);

            totalGroupsCreated++;
            alert("O grupo foi criado com sucesso!");
            modalOverlay.classList.add("hidden");
            createGroupForm.reset();
        });
    }

    // AÇÃO: Usuário INGRESSA em um grupo privado digitando o código
    if (joinPrivateGroupForm) {
        joinPrivateGroupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const groupCode = privateGroupCodeInput.value.trim().toUpperCase();
            const currentCardColor = cardColors[totalPrivateGroupsJoined % cardColors.length];

            // Esconde a mensagem de lista vazia da seção de Grupos Privados
            if (totalPrivateGroupsJoined === 0 && emptyPrivateGroupsState) {
                emptyPrivateGroupsState.classList.add("hidden");
            }

            // Constrói o card correspondente ao código digitado
            const privateCardHTML = `
                <div class="custom-group-card" style="background-color: ${currentCardColor};">
                    <div class="group-card-icon-circle">🔒</div>
                    <h4>Grupo ${groupCode}</h4>
                    <p>Código Privado</p>
                </div>
            `;

            if (privateGroupsGrid) {
                privateGroupsGrid.insertAdjacentHTML("beforeend", privateCardHTML);
            }
            
            totalPrivateGroupsJoined++;
            alert(`Você ingressou no grupo privado ${groupCode} com sucesso!`);
            joinPrivateGroupForm.reset();
        });
    }
});
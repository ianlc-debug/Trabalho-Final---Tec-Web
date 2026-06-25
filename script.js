document.addEventListener("DOMContentLoaded", () => {
    // ================= SELETORES DE TELAS E AUTENTICAÇÃO =================
    const loginScreen = document.getElementById("login-screen");
    const signupScreen = document.getElementById("signup-screen");
    const forgotScreen = document.getElementById("forgot-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const usernameInput = document.getElementById("username-input");
    const welcomeUserText = document.getElementById("welcome-user");
    const logoutBtn = document.getElementById("logout-btn");

    const navUserBtn = document.getElementById("nav-user-btn");
    const viewUser = document.getElementById("view-user");
    const profilePic = document.querySelector(".profile-pic");

    const navMensagensBtn = document.getElementById("nav-mensagens-btn");
    const viewMensagens = document.getElementById("view-mensagens");
    const btnAddContact = document.getElementById("btn-add-contact");
    const contactsList = document.getElementById("contacts-list");

    const navAgendaBtn = document.getElementById("nav-agenda-btn");
    const viewAgenda = document.getElementById("view-agenda");
    const monthSelect = document.getElementById("agenda-month-select");
    const daysGrid = document.getElementById("calendar-days-grid"); 

    if (btnAddContact) {
    btnAddContact.addEventListener("click", () => {
        if (contactInput) contactInput.value = "";
    });
}

    let currentUser = "ALUNO(A)";

    if (document.getElementById("register-link")) {
        document.getElementById("register-link").addEventListener("click", (e) => {
            e.preventDefault(); 
            loginScreen.classList.add("hidden"); 
            signupScreen.classList.remove("hidden");
        });
    }
    if (document.getElementById("forgot-password-link")) {
        document.getElementById("forgot-password-link").addEventListener("click", (e) => {
            e.preventDefault(); 
            loginScreen.classList.add("hidden"); 
            forgotScreen.classList.remove("hidden");
        });
    }
    document.querySelectorAll(".back-to-login").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); 
            signupScreen.classList.add("hidden"); 
            forgotScreen.classList.add("hidden"); 
            loginScreen.classList.remove("hidden");
        });
    });

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            currentUser = usernameInput.value.trim() || "ALUNO(A)";
            if (welcomeUserText) welcomeUserText.textContent = `OLÁ, ${currentUser.toUpperCase()}`;
            loginScreen.classList.add("hidden"); 
            dashboardScreen.classList.remove("hidden");
            
            if (profilePic) {
                profilePic.textContent = currentUser.charAt(0).toUpperCase();
            }
            renderGlobalTasks();
            renderHomeSchedules();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            dashboardScreen.classList.add("hidden"); 
            loginScreen.classList.remove("hidden");
            if (loginForm) loginForm.reset();
        });
    }

    // ================= NAVEGAÇÃO INTERNA =================
    const navInicioBtn = document.getElementById("nav-inicio-btn");
    const navGruposBtn = document.getElementById("nav-grupos-btn");
    const viewInicio = document.getElementById("view-inicio");
    const viewGrupos = document.getElementById("view-grupos");
    const viewClassroom = document.getElementById("view-group-classroom");

function resetActiveNav() {
    // 1. Remove a classe ativa de ABSOLUTAMENTE todos os botões do menu
    if (navInicioBtn) navInicioBtn.classList.remove("active"); 
    if (navGruposBtn) navGruposBtn.classList.remove("active");
    if (navMensagensBtn) navMensagensBtn.classList.remove("active");
    if (navUserBtn) navUserBtn.classList.remove("active");
    if (navAgendaBtn) navAgendaBtn.classList.remove("active");

    // 2. Esconde todas as telas do painel central
    if (viewInicio) viewInicio.classList.add("hidden");
    if (viewGrupos) viewGrupos.classList.add("hidden");
    if (viewClassroom) viewClassroom.classList.add("hidden");
    if (viewMensagens) viewMensagens.classList.add("hidden");
    if (viewUser) viewUser.classList.add("hidden");
    if (viewAgenda) viewAgenda.classList.add("hidden");
}

    if (navInicioBtn) {
        navInicioBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav(); 
            navInicioBtn.classList.add("active");
            if (viewInicio) viewInicio.classList.remove("hidden");
        });
    }

    if (navGruposBtn) {
        navGruposBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navGruposBtn.classList.add("active");
            if (viewGrupos) viewGrupos.classList.remove("hidden");
        });
    }

    if (navMensagensBtn) {
        navMensagensBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navMensagensBtn.classList.add("active");
            if (viewMensagens) viewMensagens.classList.remove("hidden");
        });
    }

    if (navUserBtn) {
        navUserBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navUserBtn.classList.add("active");
            if (viewUser) viewUser.classList.remove("hidden");

            if (document.getElementById("profile-name")) {
                document.getElementById("profile-name").textContent = currentUser.toUpperCase();
            }
            if (document.getElementById("profile-avatar")) {
                document.getElementById("profile-avatar").textContent = currentUser.charAt(0).toUpperCase();
            }
            const totalGroupsCount = Object.keys(groupMemoryDatabase).length;
            if (document.getElementById("profile-groups-joined")) {
                document.getElementById("profile-groups-joined").textContent = totalGroupsCount;
            }
            if (document.getElementById("profile-groups-created")) {
                document.getElementById("profile-groups-created").textContent = totalGroupsCount;
            }
            if (document.getElementById("profile-groups")) {
                document.getElementById("profile-groups").textContent = totalGroupsCount;
            }
        });
    }

    if (profilePic && navUserBtn) {
        profilePic.addEventListener("click", () => {
            navUserBtn.click();
        });
    }

    const verTodosLink = document.querySelector(".see-all");
    if (verTodosLink) {
        verTodosLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            if (navGruposBtn) navGruposBtn.classList.add("active");
            if (viewGrupos) viewGrupos.classList.remove("hidden");
        });
    }

    // ================= BANCOS DE DADOS EM MEMÓRIA SIMULADOS =================
    const groupMemoryDatabase = {};
    let globalEventsDatabase = []; // Mudado para 'let' para permitir reatribuição na filtragem de remoção

    const createGroupBtn = document.querySelector(".btn-create");
    const modalOverlay = document.getElementById("create-group-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const createGroupForm = document.getElementById("create-group-form");
    const groupsGrid = document.getElementById("groups-grid");
    const myGroupsGrid = document.getElementById("my-groups-grid");
    const globalTasksContainer = document.getElementById("global-tasks-container");

    const classroomGroupName = document.getElementById("classroom-group-name");
    const classroomGroupSubject = document.getElementById("classroom-group-subject");
    const classroomGroupType = document.getElementById("classroom-group-type");
    const classroomGroupCode = document.getElementById("classroom-group-code");
    const classroomBannerSchedules = document.getElementById("classroom-banner-schedules");
    const classroomMemberCount = document.getElementById("classroom-member-count");
    const btnDeleteGroup = document.getElementById("btn-delete-group");

    const btnViewMembers = document.getElementById("btn-view-members");
    const btnCloseMembers = document.getElementById("btn-close-members");
    const btnInviteMemberModal = document.getElementById("btn-invite-member-modal");
    const btnCloseInvite = document.getElementById("btn-close-invite");
    
    const classroomMainWidgets = document.getElementById("classroom-main-widgets");
    const classroomMembersSection = document.getElementById("classroom-members-section");
    const classroomMembersList = document.getElementById("classroom-members-list");
    const classroomInviteSection = document.getElementById("classroom-invite-section");
    const groupInviteForm = document.getElementById("group-invite-form");

    const selectDay = document.getElementById("classroom-day-select");
    const selectTime = document.getElementById("classroom-time-select");
    const scheduleListElement = document.getElementById("classroom-schedule-list");
    const btnAddSchedule = document.getElementById("btn-add-schedule");

    const inputTask = document.getElementById("classroom-task-input");
    const btnPostTask = document.getElementById("btn-post-task");
    const tasksFeed = document.getElementById("classroom-tasks-list-feed");
    const btnMockUpload = document.getElementById("btn-mock-upload");
    const textareaMessage = document.getElementById("classroom-message-textarea");
    const btnPostMessage = document.getElementById("btn-post-message");
    const messagesFeed = document.getElementById("classroom-messages-feed");

    let currentEditingGroupId = null;
    let totalGroupsCreated = 0;
    const cardColors = ["#e3f6e6", "#fde3ed", "#fce9b7", "#e3f1fd"];

    if (btnMockUpload) {
        btnMockUpload.addEventListener("click", () => {
            btnMockUpload.style.opacity = "0.7";
            setTimeout(() => btnMockUpload.style.opacity = "1", 150);
        });
    }

    if (createGroupBtn) createGroupBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
    if (closeModalBtn) closeModalBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
    
    if (createGroupForm) {
        createGroupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const groupName = createGroupForm.querySelectorAll("input")[0].value.trim();
            const groupSubject = createGroupForm.querySelectorAll("input")[1].value.trim();
            const privacyValue = createGroupForm.querySelector("select").value;
            const privacyText = privacyValue === "privado" ? "Apenas convidados" : "Aberto para todos";
      
            const uniqueId = `group-${Date.now()}`;
            const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

            groupMemoryDatabase[uniqueId] = {
                id: uniqueId,
                name: groupName,
                subject: groupSubject,
                privacy: privacyText,
                code: randomCode,
                schedules: [], 
                tasks: [],     
                messages: [],
                invitedMembers: []
            };

            rebuildGridsHTML();
            modalOverlay.classList.add("hidden");
            createGroupForm.reset();
            
            const searchBarInput = document.querySelector(".search-bar");
            if (searchBarInput) searchBarInput.value = "";
        });
    }

    function rebuildGridsHTML() {
        if (groupsGrid) groupsGrid.innerHTML = "";
        if (myGroupsGrid) myGroupsGrid.innerHTML = "";

        const keys = Object.keys(groupMemoryDatabase);
        totalGroupsCreated = keys.length;

        if (totalGroupsCreated === 0) {
            if (document.getElementById("empty-groups-state")) document.getElementById("empty-groups-state").classList.remove("hidden");
            if (document.getElementById("empty-my-groups-state")) document.getElementById("empty-my-groups-state").classList.remove("hidden");
            renderHomeSchedules();
            return;
        }

        if (document.getElementById("empty-groups-state")) document.getElementById("empty-groups-state").classList.add("hidden");
        if (document.getElementById("empty-my-groups-state")) document.getElementById("empty-my-groups-state").classList.add("hidden");

        keys.forEach((key, idx) => {
            const gData = groupMemoryDatabase[key];
            const currentCardColor = cardColors[idx % cardColors.length];
            const cardHTML = `
                <div class="custom-group-card" id="${gData.id}" style="background-color: ${currentCardColor}; cursor: pointer;">
                    <div class="group-card-icon-circle">📖</div>
                    <h4>${gData.name}</h4>
                    <p>${gData.subject}</p>
                </div>
            `;
            if (idx < 5 && groupsGrid) groupsGrid.insertAdjacentHTML("beforeend", cardHTML);
            if (myGroupsGrid) myGroupsGrid.insertAdjacentHTML("beforeend", cardHTML);
        });

        keys.forEach(key => {
            document.querySelectorAll(`[id="${key}"]`).forEach(card => {
                card.addEventListener("click", () => abrirClassroom(key));
            });
        });
        renderHomeSchedules();
    }

    function abrirClassroom(groupId) {
        currentEditingGroupId = groupId;
        const gData = groupMemoryDatabase[groupId];

        resetActiveNav();
        if (viewClassroom) viewClassroom.classList.remove("hidden");
        
        if (classroomMainWidgets) classroomMainWidgets.classList.remove("hidden");
        if (classroomMembersSection) classroomMembersSection.classList.add("hidden");
        if (classroomInviteSection) classroomInviteSection.classList.add("hidden");

        if (classroomGroupName) classroomGroupName.textContent = gData.name;
        if (classroomGroupSubject) classroomGroupSubject.textContent = gData.subject;
        if (classroomGroupType) classroomGroupType.textContent = gData.privacy;
        if (classroomGroupCode) classroomGroupCode.textContent = gData.code;

        if (textareaMessage) textareaMessage.value = "";
        if (inputTask) inputTask.value = "";
        if (btnPostTask) {
            btnPostTask.removeAttribute("data-edit-index");
            btnPostTask.textContent = "Cadastrar Atividade";
        }

        updateMemberCountDisplay();
        renderSchedules();
        renderTasks();
        renderMessages();
    }

    function updateMemberCountDisplay() {
        if (!currentEditingGroupId) return;
        const gData = groupMemoryDatabase[currentEditingGroupId];
        const totalMembers = 1 + gData.invitedMembers.length;
        if (classroomMemberCount) classroomMemberCount.textContent = totalMembers;
    }

    // ================= BARRA DE PESQUISA COM SUGESTÕES FLUTUANTES =================
    const searchBar = document.querySelector(".search-bar");
    const suggestionsBox = document.getElementById("search-suggestions");

    if (searchBar && suggestionsBox) {
        searchBar.addEventListener("input", (e) => {
            const queryValue = e.target.value.toLowerCase().trim();
            suggestionsBox.innerHTML = ""; 

            if (queryValue === "") {
                suggestionsBox.classList.add("hidden");
                return;
            }

            const matchedGroups = Object.values(groupMemoryDatabase).filter(group => 
                group.name.toLowerCase().includes(queryValue) || 
                group.subject.toLowerCase().includes(queryValue)
            );

            if (matchedGroups.length > 0) {
                suggestionsBox.classList.remove("hidden");

                matchedGroups.forEach(group => {
                    const item = document.createElement("div");
                    item.className = "suggestion-item";
                    item.style.cursor = "pointer";
                    item.innerHTML = `
                        <span class="suggestion-icon">📖</span>
                        <div class="suggestion-info">
                            <strong>${group.name}</strong>
                            <small>${group.subject} • ${group.privacy}</small>
                        </div>
                    `;
                    item.addEventListener("click", () => {
                        abrirClassroom(group.id);
                        searchBar.value = ""; 
                        suggestionsBox.classList.add("hidden");
                    });
                    suggestionsBox.appendChild(item);
                });
            } else {
                suggestionsBox.classList.remove("hidden");
                suggestionsBox.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: #64748b; font-size: 0.85rem; font-weight: 500;">
                        Nenhum grupo correspondente encontrado
                    </div>
                `;
            }
        });

        document.addEventListener("click", (e) => {
            if (!searchBar.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.classList.add("hidden");
            }
        });
    }

    // ================= INGRESSO DE GRUPOS =================
    const joinPrivateForm = document.getElementById("join-private-group-form");
    const privateCodeInput = document.getElementById("private-group-code-input");
    const privateErrorMsg = document.getElementById("private-group-error-msg");

    const joinPublicForm = document.getElementById("join-public-group-form");
    const publicCodeInput = document.getElementById("public-group-code-input");
    const publicErrorMsg = document.getElementById("public-group-error-msg");

    if (joinPrivateForm) {
        joinPrivateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const codeValue = privateCodeInput.value.trim();
            const targetGroupKey = Object.keys(groupMemoryDatabase).find(
                key => groupMemoryDatabase[key].code === codeValue && groupMemoryDatabase[key].privacy.includes("convidados")
            );

            if (targetGroupKey) {
                privateErrorMsg.style.color = "#10b981";
                privateErrorMsg.textContent = "Solicitação enviada com sucesso!";
                privateCodeInput.value = "";
                setTimeout(() => { privateErrorMsg.textContent = ""; }, 3000);
            } else {
                privateErrorMsg.style.color = "#ef4444";
                privateErrorMsg.textContent = "Código privado não encontrado ou inválido.";
            }
        });
    }

    if (joinPublicForm) {
        joinPublicForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const codeValue = publicCodeInput.value.trim();
            const targetGroupKey = Object.keys(groupMemoryDatabase).find(
                key => groupMemoryDatabase[key].code === codeValue && !groupMemoryDatabase[key].privacy.includes("convidados")
            );

            if (targetGroupKey) {
                publicErrorMsg.style.color = "#10b981";
                publicErrorMsg.textContent = "Você ingressou no grupo com sucesso!";
                publicCodeInput.value = "";
                setTimeout(() => { 
                    publicErrorMsg.textContent = ""; 
                    abrirClassroom(targetGroupKey);
                }, 1500);
            } else {
                publicErrorMsg.style.color = "#ef4444";
                publicErrorMsg.textContent = "Código de grupo aberto não encontrado.";
            }
        });
    }

    // ================= CONTROLE DE CONVITES E EXCLUSÃO =================
    if (btnInviteMemberModal) {
        btnInviteMemberModal.addEventListener("click", () => {
            if (classroomInviteSection) classroomInviteSection.classList.remove("hidden");
            const inviteUsername = document.getElementById("invite-username");
            if (inviteUsername) inviteUsername.focus();
        });
    }
    if (btnCloseInvite) {
        btnCloseInvite.addEventListener("click", () => {
            if (classroomInviteSection) classroomInviteSection.classList.add("hidden");
            if (groupInviteForm) groupInviteForm.reset();
        });
    }
    if (groupInviteForm) {
        groupInviteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputName = document.getElementById("invite-username").value.trim();
            const inputEmail = document.getElementById("invite-email").value.trim();
            
            const currentGroup = groupMemoryDatabase[currentEditingGroupId];
            currentGroup.invitedMembers.push({ name: inputName, email: inputEmail });
            
            groupInviteForm.reset();
            if (classroomInviteSection) classroomInviteSection.classList.add("hidden");
            updateMemberCountDisplay();

            if (classroomMembersSection && !classroomMembersSection.classList.contains("hidden")) {
                btnViewMembers.click();
            }
        });
    }

    if (btnDeleteGroup) {
        btnDeleteGroup.addEventListener("click", () => {
            if (!currentEditingGroupId) return;
            if (confirm(`Tem certeza que deseja excluir o grupo "${groupMemoryDatabase[currentEditingGroupId].name}"?`)) {
                delete groupMemoryDatabase[currentEditingGroupId];
                currentEditingGroupId = null;
                rebuildGridsHTML();
                renderGlobalTasks();
                resetActiveNav();
                if (navGruposBtn) navGruposBtn.classList.add("active");
                if (viewGrupos) viewGrupos.classList.remove("hidden");
            }
        });
    }

    // ================= VISUALIZAÇÃO DE INTEGRANTES =================
    if (btnViewMembers) {
        btnViewMembers.addEventListener("click", () => {
            if (classroomMainWidgets) classroomMainWidgets.classList.add("hidden");
            if (classroomMembersSection) classroomMembersSection.classList.remove("hidden");
            
            const gData = groupMemoryDatabase[currentEditingGroupId];
            
            let listHTML = `
                <div style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="width: 36px; height: 36px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;">
                        ${currentUser.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <strong style="color: #1e293b; font-size: 0.95rem;">${currentUser.toUpperCase()}</strong>
                        <span style="font-size: 0.75rem; background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Você (Coordenador)</span>
                    </div>
                </div>
            `;

            gData.invitedMembers.forEach(member => {
                listHTML += `
                    <div style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px;">
                        <div style="width: 36px; height: 36px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;">
                            ${member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong style="color: #1e293b; font-size: 0.95rem;">${member.name.toUpperCase()}</strong>
                            <span style="font-size: 0.75rem; color: #64748b; margin-left: 8px;">(${member.email})</span>
                            <span style="font-size: 0.75rem; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Convidado</span>
                        </div>
                    </div>
                `;
            });

            if (classroomMembersList) classroomMembersList.innerHTML = listHTML;
        });
    }

    if (btnCloseMembers) {
        btnCloseMembers.addEventListener("click", () => {
            if (classroomMembersSection) classroomMembersSection.classList.add("hidden");
            if (classroomMainWidgets) classroomMainWidgets.classList.remove("hidden");
        });
    }

    // ================= GERENCIADOR DE REUNIÕES DA SESSÃO =================
    if (btnAddSchedule) {
        btnAddSchedule.addEventListener("click", () => {
            const day = selectDay.value;
            const timeValue = selectTime.value; 
            if (!day || !timeValue) return alert("Selecione um dia e um horário válidos.");

            const parts = timeValue.split("-");
            const formattedTime = `${parts[0]}:00 - ${parts[1]}:00`;

            const record = `${day} às ${formattedTime}`;
            const currentList = groupMemoryDatabase[currentEditingGroupId].schedules;
            if (currentList.includes(record)) return alert("Esse horário já está vinculado ao grupo!");

            currentList.push(record);
            renderSchedules();
        });
    }

    function renderSchedules() {
        if (!scheduleListElement || !classroomBannerSchedules) return;
        scheduleListElement.innerHTML = "";
        classroomBannerSchedules.innerHTML = "";
        const list = groupMemoryDatabase[currentEditingGroupId].schedules;

        if (list.length === 0) {
            classroomBannerSchedules.innerHTML = `<span style="opacity:0.75; font-style: italic;">Nenhum horário definido</span>`;
        }

        list.forEach((item, index) => {
            const bannerItem = document.createElement("p");
            bannerItem.innerHTML = `<i class="fa-regular fa-calendar-check" style="margin-right: 6px;"></i> ${item}`;
            classroomBannerSchedules.appendChild(bannerItem);

            const chip = document.createElement("div");
            chip.className = "schedule-chip";
            chip.innerHTML = `${item} <button class="btn-remove-chip" style="background:none; border:none; margin-left:5px; cursor:pointer;">&times;</button>`;
            chip.querySelector(".btn-remove-chip").addEventListener("click", () => {
                list.splice(index, 1);
                renderSchedules();
            });
            scheduleListElement.appendChild(chip);
        });
        renderHomeSchedules();
    }

    // ================= RECONSTRUTOR DE SESSÕES NA HOME =================
    function renderHomeSchedules() {
        const homeSessionsContainer = document.querySelector("#view-inicio .dashboard-section:last-of-type");
        if (!homeSessionsContainer) return;

        const sectionHeader = homeSessionsContainer.querySelector(".section-header");
        homeSessionsContainer.innerHTML = "";
        if (sectionHeader) homeSessionsContainer.appendChild(sectionHeader);

        let hasSchedules = false;
        const listContainer = document.createElement("div");
        listContainer.style.display = "flex";
        listContainer.style.flexDirection = "column";
        listContainer.style.gap = "10px";
        listContainer.style.marginTop = "15px";

        Object.keys(groupMemoryDatabase).forEach(key => {
            const group = groupMemoryDatabase[key];
            if (group.schedules && group.schedules.length > 0) {
                hasSchedules = true;
                group.schedules.forEach(schedule => {
                    const sessionItem = document.createElement("div");
                    sessionItem.style.background = "#ffffff";
                    sessionItem.style.padding = "14px 18px";
                    sessionItem.style.borderRadius = "10px";
                    sessionItem.style.border = "1px solid #e2e8f0";
                    sessionItem.style.display = "flex";
                    sessionItem.style.justifyContent = "space-between";
                    sessionItem.style.alignItems = "center";
                    sessionItem.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                    sessionItem.style.cursor = "pointer";

                    sessionItem.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #eff6ff; color: #2563eb; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fa-regular fa-clock"></i>
                            </div>
                            <div>
                                <strong style="color: #1e293b; font-size: 0.95rem; display: block; margin-bottom: 2px;">${schedule}</strong>
                                <small style="color: #64748b; font-weight: 500;">Grupo: ${group.name} (${group.subject})</small>
                            </div>
                        </div>
                        <span style="color: #2563eb; font-weight: 600; font-size: 0.85rem;">Ir para o Grupo →</span>
                    `;

                    sessionItem.addEventListener("click", () => {
                        abrirClassroom(group.id);
                    });

                    listContainer.appendChild(sessionItem);
                });
            }
        });

        if (!hasSchedules) {
            const emptyBox = document.createElement("div");
            emptyBox.className = "empty-state-box";
            emptyBox.innerHTML = `<p>Você não possui nenhuma sessão de estudo agendada no momento.</p>`;
            homeSessionsContainer.appendChild(emptyBox);
        } else {
            homeSessionsContainer.appendChild(listContainer);
        }
    }

    // ================= GERENCIADOR DE TAREFAS =================
    if (btnPostTask) {
        btnPostTask.addEventListener("click", () => {
            const taskText = inputTask.value.trim();
            if (!taskText) return;

            const targetArray = groupMemoryDatabase[currentEditingGroupId].tasks;
            const isEditingIdx = btnPostTask.getAttribute("data-edit-index");
            
            if (isEditingIdx !== null) {
                targetArray[parseInt(isEditingIdx)].text = taskText;
                btnPostTask.removeAttribute("data-edit-index");
                btnPostTask.textContent = "Cadastrar Atividade";
            } else {
                targetArray.push({
                    author: currentUser,
                    text: taskText,
                    completed: false
                });
            }

            inputTask.value = "";
            renderTasks();
            renderGlobalTasks();
        });
    }

    function renderTasks() {
        if (!tasksFeed) return;
        tasksFeed.innerHTML = "";
        const list = groupMemoryDatabase[currentEditingGroupId].tasks;
        list.forEach((task, idx) => {
            const card = document.createElement("div");
            card.className = "mural-post-card";
            
            const textStyleClass = task.completed ? "task-completed-text" : "";
            const isChecked = task.completed ? "checked" : "";

            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px; margin-top:10px;">
                    <input type="checkbox" class="task-checkbox-trigger" ${isChecked} style="transform: scale(1.2); margin-top: 4px; cursor: pointer;">
                    <div style="flex: 1;">
                        <div class="mural-post-meta">📍 Cadastrado por: <strong>${task.author.toUpperCase()}</strong></div>
                        <p class="${textStyleClass}" style="margin: 5px 0; font-weight: 500;">${task.text}</p>
                        <div class="mural-card-actions">
                            <button class="mural-post-btn-edit" style="cursor:pointer; background:none; border:none; color:#2563eb; font-size:0.85rem; margin-right:10px;">✏️ Editar</button>
                            <button class="mural-post-btn-delete" style="cursor:pointer; background:none; border:none; color:#ef4444; font-size:0.85rem;">🗑️ Excluir</button>
                        </div>
                    </div>
                </div>
            `;
            card.querySelector(".task-checkbox-trigger").addEventListener("change", (e) => {
                task.completed = e.target.checked;
                renderTasks();
                renderGlobalTasks();
            });
            card.querySelector(".mural-post-btn-edit").addEventListener("click", () => {
                inputTask.value = task.text;
                inputTask.focus();
                btnPostTask.setAttribute("data-edit-index", idx);
                btnPostTask.textContent = "Salvar Alterações";
            });
            card.querySelector(".mural-post-btn-delete").addEventListener("click", () => {
                list.splice(idx, 1);
                renderTasks();
                renderGlobalTasks();
            });
            tasksFeed.appendChild(card);
        });
    }

    function renderGlobalTasks() {
        if (!globalTasksContainer) return;
        globalTasksContainer.innerHTML = "";

        let pendingCount = 0;

        Object.keys(groupMemoryDatabase).forEach(key => {
            const group = groupMemoryDatabase[key];
            group.tasks.forEach(task => {
                if (!task.completed) {
                    pendingCount++;
                    const itemHTML = `
                        <div class="global-task-item" style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                            <span>${task.text}</span><br>
                            <small style="color:#64748b;"><i class="fa-solid fa-graduation-cap"></i> Grupo: ${group.name}</small>
                        </div>
                    `;
                    globalTasksContainer.insertAdjacentHTML("beforeend", itemHTML);
                }
            });
        });

        if (pendingCount === 0) {
            globalTasksContainer.innerHTML = `
                <div class="empty-tasks" style="padding: 5px 0;">
                    <p style="color: #64748b; font-size: 0.9rem;">Nenhuma tarefa pendente</p>
                </div>
            `;
        }
    }

    // ================= GERENCIADOR DO MURAL DE AVISOS =================
    if (btnPostMessage) {
        btnPostMessage.addEventListener("click", () => {
            const messageText = textareaMessage.value.trim();
            if (!messageText) return;

            const targetArray = groupMemoryDatabase[currentEditingGroupId].messages;
            const isEditingIdx = btnPostMessage.getAttribute("data-edit-index");

            if (isEditingIdx !== null) {
                targetArray[parseInt(isEditingIdx)].text = messageText;
                btnPostMessage.removeAttribute("data-edit-index");
                btnPostMessage.textContent = "Publicar no Mural";
            } else {
                targetArray.push({
                    author: currentUser,
                    text: messageText
                });
            }

            textareaMessage.value = "";
            renderMessages();
        });
    }

    function renderMessages() {
        if (!messagesFeed) return;
        messagesFeed.innerHTML = "";
        const list = groupMemoryDatabase[currentEditingGroupId].messages;
        list.forEach((msg, idx) => {
            const card = document.createElement("div");
            card.className = "mural-post-card";
            card.style.marginTop = "10px";
            card.innerHTML = `
                <div class="mural-post-meta">👤 Enviado por: <strong>${msg.author.toUpperCase()}</strong></div>
                <p style="margin: 5px 0;">${msg.text}</p>
                <div class="mural-card-actions">
                    <button class="mural-post-btn-edit" style="cursor:pointer; background:none; border:none; color:#2563eb; font-size:0.85rem; margin-right:10px;">✏️ Editar recado</button>
                    <button class="mural-post-btn-delete" style="cursor:pointer; background:none; border:none; color:#ef4444; font-size:0.85rem;">🗑️ Excluir</button>
                </div>
            `;

            card.querySelector(".mural-post-btn-edit").addEventListener("click", () => {
                textareaMessage.value = msg.text;
                textareaMessage.focus();
                btnPostMessage.setAttribute("data-edit-index", idx);
                btnPostMessage.textContent = "Salvar Mudanças";
            });

            card.querySelector(".mural-post-btn-delete").addEventListener("click", () => {
                list.splice(idx, 1);
                renderMessages();
            });

            messagesFeed.appendChild(card);
        });
    }

    if (document.getElementById("btn-back-to-groups")) {
        document.getElementById("btn-back-to-groups").addEventListener("click", () => {
            if (viewClassroom) viewClassroom.classList.add("hidden"); 
            if (viewGrupos) viewGrupos.classList.remove("hidden");
            if (navInicioBtn) navInicioBtn.classList.remove("active");
            if (navGruposBtn) navGruposBtn.classList.add("active");
        });
    }

    // ================= SISTEMA DE CALENDÁRIO DINÂMICO E EVENTOS DO DIA =================
    const weekdaysMap = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ];

    if (navAgendaBtn) {
        navAgendaBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            navAgendaBtn.classList.add("active");
            if (viewAgenda) viewAgenda.classList.remove("hidden");
            
            if (monthSelect) {
                const currentMonth = new Date().getMonth();
                monthSelect.value = currentMonth;
                renderCalendar(currentMonth);
            }
        });
    }

    if (monthSelect) {
        monthSelect.addEventListener("change", (e) => {
            renderCalendar(parseInt(e.target.value));
        });
    }

    // Fecha o modal da agenda ao clicar no botão 'X'
    if (closeAgendaModalBtn) {
        closeAgendaModalBtn.addEventListener("click", () => {
            agendaDayModal.classList.add("hidden");
            if (agendaModalForm) agendaModalForm.reset();
        });
    }

    // Captura o submit do formulário de novo evento dentro do quadradinho/modal
    if (agendaModalForm) {
        agendaModalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const titleText = agendaModalInputTitle.value.trim();
            if (!titleText) return;

            // Insere o evento no banco global independente com um ID único para remoção posterior
            globalEventsDatabase.push({
                id: `evt-${Date.now()}`,
                year: selectedYearContext,
                month: selectedMonthContext,
                day: selectedDayContext,
                title: titleText
            });

            agendaModalForm.reset();
            
            // Re-renderiza a lista interna do modal para mostrar o que acabou de ser criado
            openDayDetailsModal(selectedDayContext, selectedMonthContext, selectedYearContext);
            
            // Re-renderiza o calendário de fundo para aplicar o novo badge verde
            renderCalendar(selectedMonthContext);
        });
    }

    // Função central que monta a lista de previsões do dia selecionado e exibe o modal
    function openDayDetailsModal(day, monthIndex, year) {
        selectedDayContext = day;
        selectedMonthContext = monthIndex;
        selectedYearContext = year;

        if (agendaModalDateTitle) {
            agendaModalDateTitle.textContent = `Previsões para o Dia ${day}/${monthIndex + 1}/${year}`;
        }

        if (!agendaModalEventsList) return;
        agendaModalEventsList.innerHTML = "";

        let matchingItemsCount = 0;

        // 1. Busca Reuniões dos Grupos vinculadas ao dia da semana
        const specificDate = new Date(year, monthIndex, day);
        const dayOfWeekName = weekdaysMap[specificDate.getDay()];

        Object.values(groupMemoryDatabase).forEach(group => {
            if (group.schedules) {
                group.schedules.forEach(sched => {
                    if (sched.includes(dayOfWeekName)) {
                        matchingItemsCount++;
                        const item = document.createElement("div");
                        item.style.padding = "8px 12px";
                        item.style.background = "#eff6ff";
                        item.style.borderLeft = "4px solid #2563eb";
                        item.style.borderRadius = "4px";
                        item.style.fontSize = "0.85rem";
                        item.innerHTML = `<strong style="color:#1e40af;">👥 Grupo: ${group.name}</strong><br><span style="color:#1e293b;">${sched}</span>`;
                        agendaModalEventsList.appendChild(item);
                    }
                });
            }
        });

        // 2. Busca Eventos Pessoais Independentes criados para essa data exata
        globalEventsDatabase.forEach(evt => {
            if (evt.day === day && evt.month === monthIndex && evt.year === year) {
                matchingItemsCount++;
                const item = document.createElement("div");
                item.style.padding = "8px 12px";
                item.style.background = "#ecfdf5";
                item.style.borderLeft = "4px solid #10b981";
                item.style.borderRadius = "4px";
                item.style.fontSize = "0.85rem";
                item.style.display = "flex";
                item.style.justifyContent = "space-between";
                item.style.alignItems = "center";
                item.style.gap = "10px";

                item.innerHTML = `
                    <div>
                        <strong style="color:#047857;">⭐ Evento Pessoal:</strong><br>
                        <span style="color:#1e293b;">${evt.title}</span>
                    </div>
                    <button class="btn-delete-event" data-id="${evt.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; padding: 4px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s;" title="Remover Evento">🗑️</button>
                `;

                // Adiciona o evento de remoção ao botão recém-criado
                item.querySelector(".btn-delete-event").addEventListener("click", (e) => {
                    const eventId = e.currentTarget.getAttribute("data-id");
                    if (confirm("Deseja realmente remover este compromisso?")) {
                        // Filtra o banco de dados removendo o item correspondente
                        globalEventsDatabase = globalEventsDatabase.filter(event => event.id !== eventId);
                        
                        // Atualiza a visualização do modal atualizado e do calendário de fundo
                        openDayDetailsModal(day, monthIndex, year);
                        renderCalendar(monthIndex);
                    }
                });

                agendaModalEventsList.appendChild(item);
            }
        });

        // 3. Se não houver nada previsto, exibe a mensagem informativa
        if (matchingItemsCount === 0) {
            agendaModalEventsList.innerHTML = `
                <div style="text-align: center; color: #64748b; font-style: italic; padding: 15px; font-size: 0.9rem; background: #f8fafc; border-radius: 6px; border: 1px dashed #cbd5e1;">
                    Não há nada previsto para este dia.
                </div>
            `;
        }

        // Exibe o modal na tela removendo a classe hidden
        if (agendaDayModal) agendaDayModal.classList.remove("hidden");
    }

    function renderCalendar(monthIndex) {
        if (!daysGrid) return;
        daysGrid.innerHTML = "";

        const currentYear = new Date().getFullYear();
        const firstDayOfMonth = new Date(currentYear, monthIndex, 1).getDay();
        const totalDaysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div");
            daysGrid.appendChild(emptyCell);
        }

        let allActiveSchedules = [];
        Object.values(groupMemoryDatabase).forEach(group => {
            if (group.schedules) {
                group.schedules.forEach(sched => {
                    allActiveSchedules.push({
                        text: sched, 
                        groupName: group.name
                    });
                });
            }
        });

        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.style.background = "#f8fafc";
            dayCell.style.border = "1px solid #e2e8f0";
            dayCell.style.borderRadius = "8px";
            dayCell.style.padding = "10px";
            dayCell.style.minHeight = "85px";
            dayCell.style.display = "flex";
            dayCell.style.flexDirection = "column";
            dayCell.style.justifyContent = "flex-start";
            dayCell.style.gap = "4px";
            dayCell.style.position = "relative";
            dayCell.style.cursor = "pointer";

            dayCell.innerHTML = `<span style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">${day}</span>`;
            
            const specificDate = new Date(currentYear, monthIndex, day);
            const dayOfWeekName = weekdaysMap[specificDate.getDay()];

            // Adiciona marcadores de reuniões de grupos no layout do calendário
            allActiveSchedules.forEach(sched => {
                if (sched.text.includes(dayOfWeekName)) {
                    const badge = document.createElement("div");
                    badge.style.background = "#2563eb";
                    badge.style.color = "white";
                    badge.style.fontSize = "0.7rem";
                    badge.style.padding = "2px 4px";
                    badge.style.borderRadius = "4px";
                    badge.style.fontWeight = "bold";
                    badge.style.overflow = "hidden";
                    badge.style.textOverflow = "ellipsis";
                    badge.style.whiteSpace = "nowrap";
                    badge.textContent = `👥 ${sched.groupName}`;
                    
                    dayCell.appendChild(badge);
                    dayCell.style.background = "#eff6ff"; 
                    dayCell.style.borderColor = "#bfdbfe";
                }
            });

            // Adiciona marcadores para os eventos cadastrados de forma independente
            globalEventsDatabase.forEach(evt => {
                if (evt.day === day && evt.month === monthIndex && evt.year === currentYear) {
                    const badge = document.createElement("div");
                    badge.style.background = "#10b981";
                    badge.style.color = "white";
                    badge.style.fontSize = "0.7rem";
                    badge.style.padding = "2px 4px";
                    badge.style.borderRadius = "4px";
                    badge.style.fontWeight = "bold";
                    badge.style.overflow = "hidden";
                    badge.style.textOverflow = "ellipsis";
                    badge.style.whiteSpace = "nowrap";
                    badge.textContent = `⭐ ${evt.title}`;
                    
                    dayCell.appendChild(badge);
                }
            });

            // --- NOVO COMPORTAMENTO DE CLIQUE: SEM PROMPTS, ABRE O MODAL CENTRALIZADO ---
            dayCell.addEventListener("click", (e) => {
                if (e.target !== dayCell && e.target.tagName !== 'SPAN') return;
                
                openDayDetailsModal(day, monthIndex, currentYear);
            });

            daysGrid.appendChild(dayCell);
        }
    }
});
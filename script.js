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

    let currentUser = "ALUNO(A)";

    if (document.getElementById("register-link")) {
        document.getElementById("register-link").addEventListener("click", (e) => {
            e.preventDefault(); loginScreen.classList.add("hidden"); signupScreen.classList.remove("hidden");
        });
    }
    if (document.getElementById("forgot-password-link")) {
        document.getElementById("forgot-password-link").addEventListener("click", (e) => {
            e.preventDefault(); loginScreen.classList.add("hidden"); forgotScreen.classList.remove("hidden");
        });
    }
    document.querySelectorAll(".back-to-login").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); signupScreen.classList.add("hidden"); forgotScreen.classList.add("hidden"); loginScreen.classList.remove("hidden");
        });
    });

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            currentUser = usernameInput.value.trim() || "ALUNO(A)";
            if (welcomeUserText) welcomeUserText.textContent = `OLÁ, ${currentUser.toUpperCase()}`;
            loginScreen.classList.add("hidden"); dashboardScreen.classList.remove("hidden");
            renderGlobalTasks();
            renderHomeSchedules();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); dashboardScreen.classList.add("hidden"); loginScreen.classList.remove("hidden");
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
        navInicioBtn.classList.remove("active"); navGruposBtn.classList.remove("active");
    }
    if (navInicioBtn && navGruposBtn) {
        navInicioBtn.addEventListener("click", (e) => {
            e.preventDefault(); resetActiveNav(); navInicioBtn.classList.add("active");
            viewClassroom.classList.add("hidden"); viewGrupos.classList.add("hidden"); viewInicio.classList.remove("hidden");
        });
        navGruposBtn.addEventListener("click", (e) => {
            e.preventDefault(); resetActiveNav(); navGruposBtn.classList.add("active");
            viewClassroom.classList.add("hidden"); viewInicio.classList.add("hidden"); viewGrupos.classList.remove("hidden");
        });
    }

    const verTodosLink = document.querySelector(".see-all");
    if (verTodosLink) {
        verTodosLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveNav();
            if (navGruposBtn) navGruposBtn.classList.add("active");
            viewClassroom.classList.add("hidden");
            viewInicio.classList.add("hidden");
            viewGrupos.classList.remove("hidden");
        });
    }

    // ================= BANCO DE DADOS EM MEMÓRIA SIMULADO =================
    const groupMemoryDatabase = {};

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
    
    // Seções e Botões de Membros / Convites
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

    // Clique comportamental para anexar arquivos
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
                <div class="custom-group-card" id="${gData.id}" style="background-color: ${currentCardColor};">
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

        viewInicio.classList.add("hidden");
        viewGrupos.classList.add("hidden");
        viewClassroom.classList.remove("hidden");
        
        classroomMainWidgets.classList.remove("hidden");
        classroomMembersSection.classList.add("hidden");
        classroomInviteSection.classList.add("hidden");

        classroomGroupName.textContent = gData.name;
        classroomGroupSubject.textContent = gData.subject;
        classroomGroupType.textContent = gData.privacy;
        classroomGroupCode.textContent = gData.code;

        textareaMessage.value = "";
        inputTask.value = "";
        btnPostTask.removeAttribute("data-edit-index");
        btnPostTask.textContent = "Cadastrar Atividade";

        updateMemberCountDisplay();
        renderSchedules();
        renderTasks();
        renderMessages();
    }

    function updateMemberCountDisplay() {
        const gData = groupMemoryDatabase[currentEditingGroupId];
        const totalMembers = 1 + gData.invitedMembers.length;
        classroomMemberCount.textContent = totalMembers;
    }

    // ================= BARRA DE PESQUISA COM SUGESTÕES FLUTUANTES (LETRA A LETRA) =================
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

    // ================= SELEÇÃO E INGRESSO DE GRUPOS (PRIVADOS E ABERTOS) =================
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

    // ================= CONTROLE DE CONVITES =================
    if (btnInviteMemberModal) {
        btnInviteMemberModal.addEventListener("click", () => {
            classroomInviteSection.classList.remove("hidden");
            document.getElementById("invite-username").focus();
        });
    }
    if (btnCloseInvite) {
        btnCloseInvite.addEventListener("click", () => {
            classroomInviteSection.classList.add("hidden");
            groupInviteForm.reset();
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
            classroomInviteSection.classList.add("hidden");
            updateMemberCountDisplay();

            if (!classroomMembersSection.classList.contains("hidden")) {
                btnViewMembers.click();
            }
        });
    }

    // Excluir Grupo
    if (btnDeleteGroup) {
        btnDeleteGroup.addEventListener("click", () => {
            if (confirm(`Tem certeza que deseja excluir o grupo "${groupMemoryDatabase[currentEditingGroupId].name}"?`)) {
                delete groupMemoryDatabase[currentEditingGroupId];
                currentEditingGroupId = null;
                rebuildGridsHTML();
                renderGlobalTasks();
                viewClassroom.classList.add("hidden");
                viewGrupos.classList.remove("hidden");
                resetActiveNav();
                navGruposBtn.classList.add("active");
            }
        });
    }

    // Alternar Visualização de Integrantes
    if (btnViewMembers) {
        btnViewMembers.addEventListener("click", () => {
            classroomMainWidgets.classList.add("hidden");
            classroomMembersSection.classList.remove("hidden");
            
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
                    <div style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
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

            classroomMembersList.innerHTML = listHTML;
        });
    }

    if (btnCloseMembers) {
        btnCloseMembers.addEventListener("click", () => {
            classroomMembersSection.classList.add("hidden");
            classroomMainWidgets.classList.remove("hidden");
        });
    }

    // ================= GERENCIADOR DE REUNIÕES (FORMATADO) =================
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
            chip.innerHTML = `${item} <button class="btn-remove-chip">&times;</button>`;
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
        homeSessionsContainer.appendChild(sectionHeader);

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
        tasksFeed.innerHTML = "";
        const list = groupMemoryDatabase[currentEditingGroupId].tasks;
        list.forEach((task, idx) => {
            const card = document.createElement("div");
            card.className = "mural-post-card";
            
            const textStyleClass = task.completed ? "task-completed-text" : "";
            const isChecked = task.completed ? "checked" : "";

            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <input type="checkbox" class="task-checkbox-trigger" ${isChecked} style="transform: scale(1.2); margin-top: 4px; cursor: pointer;">
                    <div style="flex: 1;">
                        <div class="mural-post-meta">📍 Cadastrado por: <strong>${task.author.toUpperCase()}</strong></div>
                        <p class="${textStyleClass}" style="margin: 0; font-weight: 500;">${task.text}</p>
                        <div class="mural-card-actions">
                            <button class="mural-post-btn-edit">✏️ Editar</button>
                            <button class="mural-post-btn-delete"><i class="fa-solid fa-trash-can"></i> Excluir</button>
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

    // ================= RE-RENDERIZADOR DE TAREFAS GLOBAIS =================
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
                        <div class="global-task-item">
                            <span>${task.text}</span>
                            <small><i class="fa-solid fa-graduation-cap"></i> Grupo: ${group.name}</small>
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
        messagesFeed.innerHTML = "";
        const list = groupMemoryDatabase[currentEditingGroupId].messages;
        list.forEach((msg, idx) => {
            const card = document.createElement("div");
            card.className = "mural-post-card";
            card.innerHTML = `
                <div class="mural-post-meta">👤 Enviado por: <strong>${msg.author.toUpperCase()}</strong></div>
                <p>${msg.text}</p>
                <div class="mural-card-actions">
                    <button class="mural-post-btn-edit">✏️ Editar recado</button>
                    <button class="mural-post-btn-delete"><i class="fa-solid fa-trash-can"></i> Excluir</button>
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
            viewClassroom.classList.add("hidden"); viewGrupos.classList.remove("hidden");
            document.getElementById("nav-inicio-btn").classList.remove("active");
            document.getElementById("nav-grupos-btn").classList.add("active");
        });
    }
});
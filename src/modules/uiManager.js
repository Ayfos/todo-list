// src/modules/uiManager.js
import { formatDate, getDateStatus } from '../utils/dateUtils.js';
import { TodoItem } from '../factories/TodoItem.js';

export class UIManager {
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.currentProject = todoApp.currentProject;

        this.filters = {
            searchText: '',
            status: 'all',
            priority: ''
        };

        // Referencias a elementos del DOM
        this.elements = {
            projectsList: document.getElementById('projectsList'),
            currentProjectTitle: document.getElementById('currentProjectTitle'),
            todosContainer: document.getElementById('todosContainer'),
            totalTodos: document.getElementById('totalTodos'),
            completedTodos: document.getElementById('completedTodos'),
            emptyState: document.getElementById('emptyState'),
            detailPanel: document.getElementById('detailPanel'),
            detailContent: document.getElementById('detailContent'),
            searchInput: document.getElementById('searchInput'),
            priorityFilter: document.getElementById('priorityFilter'),
            newProjectBtn: document.getElementById('newProjectBtn'),
            newTodoBtn: document.getElementById('newTodoBtn'),
            closeDetailBtn: document.getElementById('closeDetailBtn'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            filtersBar: document.querySelector('.filters-bar')
        };

        // Inicializar
        this.init();
    }

    init() {
        console.log('✅ UIManager inicializado');

        // Cargar datos iniciales
        this.renderProjects();
        this.renderTodos();

        // Configurar event listeners
        this.setupEventListeners();
    }

    // ===== RENDERIZAR PROYECTOS =====
    renderProjects() {
        const { projectsList } = this.elements;
        const { projects, currentProject } = this.todoApp;

        // Limpiar lista
        projectsList.innerHTML = '';

        // Renderizar proyectos
        projects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            projectsList.appendChild(projectElement);

            // Marcar como activo si es el actual
            if (project.id === currentProject.id) {
                projectElement.classList.add('active');
            }
        });
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.dataset.projectId = project.id;

        // Icono según el nombre del proyecto
        const icon = this.getProjectIcon(project.name);

        div.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${project.name}</span>
            <span class="badge">${project.todos.length}</span>
        `;

        // Evento clic
        div.addEventListener('click', () => {
            this.switchProject(project.id);
        });

        return div;
    }

    getProjectIcon(projectName) {
        const icons = {
            'inbox': 'inbox',
            'trabajo': 'briefcase',
            'personal': 'home',
            'estudio': 'graduation-cap',
            'compras': 'shopping-cart',
            'salud': 'heartbeat',
            'viajes': 'plane'
        };

        const nameLower = projectName.toLowerCase();
        for (const [key, icon] of Object.entries(icons)) {
            if (nameLower.includes(key)) {
                return icon;
            }
        }

        return 'folder'; // Icono por defecto
    }

    // ===== RENDERIZAR TAREAS =====
    renderTodos(todosToRender = null) {
        const { todosContainer, emptyState, totalTodos, completedTodos } = this.elements;
        
        // Usar todas las tareas o las filtradas
        const allTodos = this.currentProject.todos;
        const todos = todosToRender || allTodos;

        // Actualizar contadores
        const total = allTodos.length;
        const completed = allTodos.filter(todo => todo.completed).length;
        const filteredCount = todos.length;

        totalTodos.textContent = total;
        completedTodos.textContent = completed;

        // Mostrar/ocultar estado vacío
        if (filteredCount === 0) {
            emptyState.style.display = 'block';
            todosContainer.style.display = 'none';
            
            // Mensaje personalizado según filtros
            let message = 'No hay tareas en este proyecto';
            let submessage = 'Crea tu primera tarea haciendo clic en "Nueva Tarea"';
            
            if (this.filters.searchText || this.filters.status !== 'all' || this.filters.priority) {
                message = 'No se encontraron tareas';
                submessage = 'Prueba con otros filtros';
                
                emptyState.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>${message}</h3>
                    <p>${submessage}</p>
                    <button class="btn-clear-filters" style="margin-top: 10px; padding: 8px 16px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-times"></i> Limpiar filtros
                    </button>
                `;
                
                // Evento para limpiar filtros
                emptyState.querySelector('.btn-clear-filters').addEventListener('click', () => {
                    this.clearFilters();
                });
            }
        } else {
            emptyState.style.display = 'none';
            todosContainer.style.display = 'block';
            
            // Mostrar contador si hay filtros activos
            if (filteredCount < total) {
                this.showFilteredCount(filteredCount, total);
            } else {
                this.hideFilteredCount();
            }
        }

        // Limpiar contenedor
        todosContainer.innerHTML = '';

        // Renderizar tareas reales
        if (filteredCount > 0) {
            todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                todosContainer.appendChild(todoElement);
            });
        }
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item priority-${todo.priority}`;
        div.dataset.todoId = todo.id;

        // Usar las funciones importadas estáticamente
        const dateText = todo.dueDate ? formatDate(todo.dueDate, 'medium') : 'Sin fecha';
        const status = getDateStatus(todo.dueDate);

        div.innerHTML = `
            <div class="todo-checkbox">
                <input type="checkbox" id="todo_${todo.id}" ${todo.completed ? 'checked' : ''}>
                <label for="todo_${todo.id}"></label>
            </div>
            <div class="todo-content">
                <div class="todo-header">
                    <h3 class="todo-title ${todo.completed ? 'completed' : ''}">${todo.title}</h3>
                    <div class="todo-priority">
                        <span class="priority-badge ${todo.priority}">
                            ${this.getPriorityText(todo.priority)}
                        </span>
                    </div>
                </div>
                ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
                <div class="todo-footer">
                    <span class="todo-date ${status === 'vencido' ? 'overdue' : ''}">
                        <i class="far fa-calendar"></i>
                        <span>${dateText}</span>
                    </span>
                    <div class="todo-actions">
                        <button class="action-btn edit-todo" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete delete-todo" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eventos
        const checkbox = div.querySelector(`#todo_${todo.id}`);
        checkbox.addEventListener('change', () => {
            this.toggleTodoComplete(todo.id);
        });

        const editBtn = div.querySelector('.edit-todo');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.openTodoModalForEdit) {
                window.openTodoModalForEdit(todo);
            }
        });

        const deleteBtn = div.querySelector('.delete-todo');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTodo(todo.id);
        });

        // 🔥 NUEVO: Evento para abrir panel de detalles al hacer clic en la tarea
        div.addEventListener('click', (e) => {
            // Solo si no se hizo clic en checkbox, botones, etc.
            if (!e.target.closest('.todo-checkbox') && 
                !e.target.closest('.todo-actions') &&
                !e.target.closest('.priority-badge')) {
                this.showTodoDetail(todo);
            }
        });

        return div;
    }

    getPriorityText(priority) {
        const texts = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        return texts[priority] || priority;
    }

    // ===== EVENTOS =====
    setupEventListeners() {
        const { newProjectBtn, newTodoBtn, closeDetailBtn, searchInput, priorityFilter, filterButtons } = this.elements;

        // Botón nuevo proyecto
        newProjectBtn.addEventListener('click', () => {
            const name = prompt('Nombre del nuevo proyecto:');
            if (name && name.trim()) {
                this.createProject(name.trim());
            }
        });

        // Botón nueva tarea
        newTodoBtn.addEventListener('click', () => {
            this.showNewTodoForm();
        });

        // Cerrar panel de detalle
        closeDetailBtn.addEventListener('click', () => {
            this.hideTodoDetail();
        });

        // Búsqueda
        searchInput.addEventListener('input', (e) => {
            this.filters.searchText = e.target.value.toLowerCase().trim();
            this.applyFilters();
        });

        // Filtro por prioridad
        priorityFilter.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.applyFilters();
        });

        // Filtros por estado (Todas/Pendientes/Completadas)
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remover clase active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar active al botón clickeado
                e.target.classList.add('active');
                
                // Actualizar filtro según el texto del botón
                const statusText = e.target.textContent.toLowerCase();
                let status = 'all';
                
                if (statusText.includes('pendientes')) status = 'pending';
                else if (statusText.includes('completadas')) status = 'completed';
                
                this.filters.status = status;
                this.applyFilters();
            });
        });
    }

    // ===== ACCIONES =====
    switchProject(projectId) {
        const success = this.todoApp.setCurrentProject(projectId);
        if (success) {
            this.currentProject = this.todoApp.currentProject;
            this.updateUI();
        }
    }

    createProject(name) {
        const project = this.todoApp.addProject(name);
        this.renderProjects();
        this.switchProject(project.id);
    }

    toggleTodoComplete(todoId) {
        this.currentProject.toggleTodoComplete(todoId);
        this.applyFilters(); // Re-aplicar filtros después de cambiar estado
    }

    deleteTodo(todoId) {
        if (confirm('¿Eliminar esta tarea?')) {
            const success = this.currentProject.removeTodo(todoId);
            if (success) {
                this.applyFilters(); // Re-aplicar filtros después de eliminar
                this.renderProjects(); // Actualizar contadores
            }
        }
    }

    // ===== PANEL DE DETALLES =====
    showTodoDetail(todo) {
        const { detailPanel, detailContent } = this.elements;
        
        // Formatear fechas
        const formatDateForDisplay = (date) => {
            if (!date) return 'No establecida';
            return new Date(date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        
        // Texto de prioridad
        const priorityText = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        
        // Estado
        const status = todo.completed ? 
            '<span class="status-completed"><i class="fas fa-check-circle"></i> Completada</span>' :
            '<span class="status-pending"><i class="fas fa-clock"></i> Pendiente</span>';
        
        // Crear HTML de detalles
        detailContent.innerHTML = `
            <div class="todo-detail-view">
                <div class="detail-section">
                    <h4 class="detail-title">${todo.title}</h4>
                    <div class="detail-meta">
                        ${status}
                        <span class="detail-priority priority-${todo.priority}">
                            <i class="fas fa-flag"></i> ${priorityText[todo.priority] || todo.priority}
                        </span>
                    </div>
                </div>
                
                ${todo.description ? `
                <div class="detail-section">
                    <h5><i class="fas fa-align-left"></i> Descripción</h5>
                    <p class="detail-description">${todo.description}</p>
                </div>
                ` : ''}
                
                <div class="detail-grid">
                    <div class="detail-section">
                        <h5><i class="far fa-calendar"></i> Fecha límite</h5>
                        <p>${formatDateForDisplay(todo.dueDate)}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h5><i class="far fa-calendar-plus"></i> Creada</h5>
                        <p>${formatDateForDisplay(todo.createdAt)}</p>
                    </div>
                </div>
                
                ${todo.notes ? `
                <div class="detail-section">
                    <h5><i class="fas fa-sticky-note"></i> Notas</h5>
                    <p class="detail-notes">${todo.notes}</p>
                </div>
                ` : ''}
                
                ${todo.reminder ? `
                <div class="detail-section">
                    <h5><i class="fas fa-bell"></i> Recordatorio</h5>
                    <p><i class="fas fa-check"></i> Activado</p>
                </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="btn btn-primary edit-from-detail" data-todo-id="${todo.id}">
                        <i class="fas fa-edit"></i> Editar Tarea
                    </button>
                    <button class="btn btn-secondary close-detail">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;
        
        // Mostrar panel
        detailPanel.style.display = 'block';
        detailPanel.classList.add('active');
        
        // Eventos dentro del panel
        detailContent.querySelector('.edit-from-detail').addEventListener('click', () => {
            if (window.openTodoModalForEdit) {
                window.openTodoModalForEdit(todo);
                this.hideTodoDetail();
            }
        });
        
        detailContent.querySelector('.close-detail').addEventListener('click', () => {
            this.hideTodoDetail();
        });
    }

    hideTodoDetail() {
        const { detailPanel } = this.elements;
        detailPanel.classList.remove('active');
        
        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
            detailPanel.style.display = 'none';
        }, 300);
    }

    showNewTodoForm() {
        const modal = document.getElementById('todoModal');
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Modal mostrado');
        } else {
            console.error('❌ Modal no encontrado');
        }
    }

    // ===== FILTRADO Y BÚSQUEDA =====
    applyFilters() {
        const filteredTodos = this.currentProject.todos.filter(todo => {
            // 1. Filtro por búsqueda de texto
            const matchesSearch = !this.filters.searchText || 
                todo.title.toLowerCase().includes(this.filters.searchText) ||
                (todo.description && todo.description.toLowerCase().includes(this.filters.searchText));
            
            // 2. Filtro por estado
            const matchesStatus = 
                this.filters.status === 'all' ||
                (this.filters.status === 'pending' && !todo.completed) ||
                (this.filters.status === 'completed' && todo.completed);
            
            // 3. Filtro por prioridad
            const matchesPriority = !this.filters.priority || todo.priority === this.filters.priority;
            
            return matchesSearch && matchesStatus && matchesPriority;
        });
        
        // Renderizar solo las tareas filtradas
        this.renderTodos(filteredTodos);
    }

    showFilteredCount(filtered, total) {
        // Buscar o crear el contador
        let counter = document.querySelector('.filtered-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'filtered-counter';
            this.elements.filtersBar?.appendChild(counter);
        }
        
        counter.style.display = 'block';
        counter.innerHTML = `
            <span class="counter-badge">
                <i class="fas fa-filter"></i>
                Mostrando ${filtered} de ${total} tareas
                <button class="clear-filters-btn" title="Limpiar filtros">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
        
        // Evento para limpiar filtros
        counter.querySelector('.clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    hideFilteredCount() {
        const counter = document.querySelector('.filtered-counter');
        if (counter) {
            counter.style.display = 'none';
        }
    }

    clearFilters() {
        // Resetear estado de filtros
        this.filters = {
            searchText: '',
            status: 'all',
            priority: ''
        };
        
        // Resetear UI
        this.elements.searchInput.value = '';
        this.elements.priorityFilter.value = '';
        
        // Resetear botones de estado
        this.elements.filterButtons.forEach(btn => {
            if (btn.textContent.includes('Todas')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Ocultar contador
        this.hideFilteredCount();
        
        // Renderizar todas las tareas
        this.renderTodos();
    }

    // Función de compatibilidad (mantener)
    filterTodos(searchText) {
        this.filters.searchText = searchText.toLowerCase().trim();
        this.applyFilters();
    }

    // Función de compatibilidad (mantener)
    filterByPriority(priority) {
        this.filters.priority = priority;
        this.applyFilters();
    }

    updateUI() {
        // Limpiar filtros al cambiar proyecto
        this.clearFilters();
        
        // Actualizar título del proyecto actual
        this.elements.currentProjectTitle.innerHTML = `
            <i class="fas fa-${this.getProjectIcon(this.currentProject.name)}"></i>
            ${this.currentProject.name}
        `;
        
        // Actualizar lista de tareas
        this.renderTodos();
        
        // Actualizar lista de proyectos (marcar activo)
        this.renderProjects();
    }
}
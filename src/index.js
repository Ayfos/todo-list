import './styles/main.css';
import { TodoApp } from './factories/TodoApp.js';
import { TodoItem } from './factories/TodoItem.js';
import { saveToStorage, loadFromStorage } from './utils/storage.js';
import { UIManager } from './modules/uiManager.js';

console.log('🚀 Iniciando Todo List - Interfaz Completa');

// Cargar aplicación desde localStorage o crear nueva
let app;
let uiManager;

function createDemoApp() {
    const newApp = new TodoApp();
    
    // Datos de ejemplo para probar
    const trabajo = newApp.addProject('Trabajo');
    const personal = newApp.addProject('Personal');
    
    // Tareas de ejemplo
    const tarea1 = new TodoItem(
        'Bienvenido a Todo List',
        'Esta es tu primera tarea en el proyecto Inbox',
        new Date(),
        'medium'
    );
    newApp.defaultProject.addTodo(tarea1);
    
    const tarea2 = new TodoItem(
        'Revisar emails',
        'Responder emails importantes',
        new Date(Date.now() + 86400000),
        'high'
    );
    trabajo.addTodo(tarea2);
    
    const tarea3 = new TodoItem(
        'Comprar supermercado',
        'Leche, pan, frutas',
        new Date(Date.now() + 172800000),
        'medium'
    );
    personal.addTodo(tarea3);
    
    return newApp;
}

function initializeApp() {
    try {
        const savedData = loadFromStorage();
        
        if (savedData && savedData.projects && savedData.projects.length > 0) {
            console.log('📂 Cargando datos guardados...');
            try {
                app = TodoApp.fromJSON(savedData);
                console.log('✅ Datos cargados correctamente');
            } catch (error) {
                console.error('❌ Error al cargar datos guardados:', error);
                app = createDemoApp();
            }
        } else {
            console.log('🆕 Creando nueva aplicación...');
            app = createDemoApp();
            console.log('✅ Datos de ejemplo creados');
        }
    } catch (error) {
        console.error('❌ Error al cargar/crear aplicación:', error);
        app = createDemoApp();
    }

    // Inicializar interfaz
    try {
        uiManager = new UIManager(app);
        console.log('✅ Interfaz inicializada');
    } catch (error) {
        console.error('❌ Error al inicializar interfaz:', error);
    }

    // Guardar automáticamente cada 10 segundos
    setInterval(() => {
        if (app) {
            saveToStorage(app.toJSON());
        }
    }, 10000);

    // También guardar al cerrar la página
    window.addEventListener('beforeunload', () => {
        if (app) {
            saveToStorage(app.toJSON());
        }
    });

    // Exportar para consola (debug)
    window.todoApp = app;
    window.uiManager = uiManager;

    console.log('\n🎉 APLICACIÓN LISTA');
    console.log('📊 Puedes acceder desde consola:');
    console.log('   - todoApp → Objeto principal');
    console.log('   - uiManager → Gestor de interfaz');
}

// ===== MANEJO DEL MODAL (EDICIÓN + CREACIÓN) =====
let currentTodoId = null;
let isEditMode = false;

function setupModalHandlers() {
    const modal = document.getElementById('todoModal');
    const form = document.getElementById('todoForm');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelTodoBtn');
    
    if (!modal || !form) {
        console.error('❌ Elementos del modal no encontrados');
        return;
    }
    
    // 1. Cerrar modal con botones ❌ y Cancelar
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    // 2. Cerrar haciendo clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 3. Manejar envío del formulario
    form.addEventListener('submit', handleTodoSubmit);
    
    // 4. Tecla ESC para cerrar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function resetModalState() {
    currentTodoId = null;
    isEditMode = false;
    document.getElementById('modalTitle').textContent = 'Nueva Tarea';
}

function closeModal() {
    const modal = document.getElementById('todoModal');
    modal?.classList.remove('active');
    resetModalState();
    document.getElementById('todoForm')?.reset();
}

// ===== FUNCIÓN PARA ABRIR MODAL EN MODO EDICIÓN =====
function openTodoModalForEdit(todo) {
    currentTodoId = todo.id;
    isEditMode = true;
    
    // Llenar formulario con datos de la tarea
    document.getElementById('todoTitle').value = todo.title;
    document.getElementById('todoDescription').value = todo.description || '';
    
    // Formatear fecha para input[type=date]
    if (todo.dueDate) {
        const date = new Date(todo.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('todoDueDate').value = formattedDate;
    } else {
        document.getElementById('todoDueDate').value = '';
    }
    
    document.getElementById('todoPriority').value = todo.priority || 'medium';
    document.getElementById('todoNotes').value = todo.notes || '';
    document.getElementById('todoReminder').checked = todo.reminder || false;
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Editar Tarea';
    
    // Abrir modal
    document.getElementById('todoModal').classList.add('active');
    document.getElementById('todoTitle').focus();
}

// ===== MANEJAR ENVÍO (CREAR/ACTUALIZAR) =====
function handleTodoSubmit(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();
    const dueDate = document.getElementById('todoDueDate').value;
    const priority = document.getElementById('todoPriority').value;
    const notes = document.getElementById('todoNotes').value.trim();
    const reminder = document.getElementById('todoReminder').checked;
    
    // Validación básica
    if (!title) {
        alert('El título es obligatorio');
        document.getElementById('todoTitle').focus();
        return;
    }
    
    try {
        if (isEditMode && currentTodoId) {
            // MODO EDICIÓN: Actualizar tarea existente
            updateExistingTodo(currentTodoId, {
                title, description, dueDate, priority, notes, reminder
            });
            console.log('✏️ Tarea actualizada');
        } else {
            // MODO NUEVO: Crear tarea
            createNewTodo(title, description, dueDate, priority, notes, reminder);
            console.log('✅ Tarea creada');
        }
        
        // Cerrar modal
        closeModal();
        
    } catch (error) {
        console.error('❌ Error al guardar tarea:', error);
        alert('Error al guardar la tarea: ' + error.message);
    }
}

// ===== CREAR NUEVA TAREA =====
function createNewTodo(title, description, dueDate, priority, notes, reminder) {
    const newTodo = new TodoItem(
        title,
        description,
        dueDate ? new Date(dueDate) : null,
        priority,
        notes,
        reminder
    );
    
    // Agregar al proyecto actual
    app.currentProject.addTodo(newTodo);
    
    // Actualizar interfaz
    uiManager.renderTodos();
    uiManager.renderProjects();
}

// ===== ACTUALIZAR TAREA EXISTENTE =====
function updateExistingTodo(todoId, updatedData) {
    // Buscar la tarea en el proyecto actual
    const todo = app.currentProject.todos.find(t => t.id === todoId);
    
    if (!todo) {
        throw new Error('Tarea no encontrada');
    }
    
    // Actualizar propiedades
    todo.title = updatedData.title;
    todo.description = updatedData.description;
    todo.dueDate = updatedData.dueDate ? new Date(updatedData.dueDate) : null;
    todo.priority = updatedData.priority;
    todo.notes = updatedData.notes;
    todo.reminder = updatedData.reminder;
    todo.updatedAt = new Date();
    
    // Actualizar interfaz
    uiManager.renderTodos();
    uiManager.renderProjects();
}

// ===== INICIALIZAR TODO =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupModalHandlers();
    
    // Exportar función para UIManager
    window.openTodoModalForEdit = openTodoModalForEdit;
    
    console.log('✅ Modal handlers configurados');
});
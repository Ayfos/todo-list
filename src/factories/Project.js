import { TodoItem } from './TodoItem.js';   

export class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
        this.id = Date.now() + Math.random().toString(36).slice(2);
        this.createdAt = new Date();
    }

    // Metodo para agregar una tarea al proyecto
    
    addTodo(todoItem) {
        this.todos.push(todoItem);
        return todoItem;
    }
    // Metodo para obtener una tarea por su ID

    getTodoById(todoId) {
        return this.todos.find(todo => todo.id === todoId);
    }

    // Metodo para eliminar una tarea  por su ID

    removeTodo(todoId) {
        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);

        if (todoIndex !== -1) {
            this.todos.splice(todoIndex, 1);
            return true;  // éxito al eliminar
        }
        return false; // no se encontró 
    }

    // Método para alternar el estado de completado/no completado de una tarea

    toggleTodoComplete(todoId) {
        const todo = this.getTodoById(todoId);
        
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date(); // Actualizar timestamp
            return true;
        }
        
        return false;
    }

    // Métodos para el localStorage
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            todos: this.todos.map(todo => todo.toJSON()),
            createdAt: this.createdAt.toISOString()
        };
    }

    static fromJSON(data) {
        const project = new Project(data.name);
        project.id = data.id;
        project.createdAt = new Date(data.createdAt);
        project.todos = data.todos.map(todoData => TodoItem.fromJSON(todoData));
        return project;         
        };
    }
    

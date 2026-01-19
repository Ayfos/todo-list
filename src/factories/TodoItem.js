export class TodoItem {
    constructor(title, description = '', dueDate = null, priority = 'medium') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = Date.now() + Math.random().toString(36).slice(2);
        this.completed = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.projectId = null;
        this.notes = '';
        this.checklist = [];
        this.tags = [];
        this.reminder = null;
        this.recurring = false;
        this.attachments = [];

    }
    // localstorage para guardar  todos los items
    // Convertir el TodoItem a un objeto JSON
    toJSON() {
        const safeDate = (date) => {
            if (!date) return null;
            if (typeof date === 'string') return date;
            return date.toISOString();
        };
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate ? this.dueDate.toISOString() : null,
            priority: this.priority,
            notes: this.notes,
            reminder: this.reminder,
            completed: this.completed,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
            projectId: this.projectId,
            checklist: this.checklist,
            tags: this.tags,
            recurring: this.recurring,
            attachments: this.attachments
        };
    }
    // Reconstruir un TodoItem desde un objeto JSON

    static fromJSON(data) {
        const todo = new TodoItem(
            data.title,
            data.description,
            data.dueDate ? new Date(data.dueDate) : null,
            data.priority
        );
        
        // Propiedades básicas
        todo.id = data.id;
        todo.priority = data.priority;
        todo.completed = data.completed;
        
        // Fechas: Convertir string → Date
        todo.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        todo.createdAt = new Date(data.createdAt);
        todo.updatedAt = new Date(data.updatedAt);
        todo.reminder = data.reminder ? new Date(data.reminder) : null;
        
        // Arrays y strings
        todo.notes = data.notes || '';
        todo.checklist = data.checklist || [];
        todo.tags = data.tags || [];
        todo.projectId = data.projectId || null;
        todo.recurring = data.recurring || false;
        todo.attachments = data.attachments || [];
        
        return todo;
    }
}

import { Project } from './Project.js';

export class TodoApp {
    constructor() {
        // 1. Lista de todos los proyectos
        this.projects = [];
        
        // 2. Proyecto por defecto (requisito Odin)
        this.defaultProject = new Project('Inbox');
        
        // 3. Proyecto actualmente activo/visible
        this.currentProject = this.defaultProject;
        
        // 4. Inicializar con Inbox
        this.projects.push(this.defaultProject);
    }
    
    // MÉTODO 1: Crear nuevo proyecto
    addProject(projectName) {
        const newProject = new Project(projectName);
        this.projects.push(newProject);
        return newProject;
    }
    
    // MÉTODO 2: Buscar proyecto por ID
    getProjectById(projectId) {
        return this.projects.find(project => project.id === projectId);
    }
    
    // MÉTODO 3: Cambiar proyecto activo
    setCurrentProject(projectId) {
        const project = this.getProjectById(projectId);
        if (project) {
            this.currentProject = project;
            return true;
        }
        return false;
    }
    // MÉTODO 4: Eliminar proyecto(excepto Inbox)

    deleteProject(projectId) {
        // Verificar que no sea el proyecto por defecto
        if (projectId === this.defaultProject.id) {
            console.warn('No se puede eliminar el proyecto Inbox'); 
            return false; // No se puede eliminar Inbox
        }
        // Buscar índice del proyecto a eliminar
        const projectIndex = this.projects.findIndex(project => project.id === projectId);
        
        // Si no se encuentra, retornar false
        if(projectIndex === -1) {
            console.warn('Proyecto no encontrado');
            return false;
        }

        //Eliminar del array
        this.projects.splice(projectIndex, 1);

        // Si el proyecto eliminado era el actual, volver a Inbox

        if (this.currentProject.id === projectId) {
            this.currentProject = this.defaultProject;
        }
        return true;
    }

    // Método para localStorage

    toJSON() {
        return {
            projects: this.projects.map(project => project.toJSON()),
            defaultProjectId: this.defaultProject.id,
            currentProjectId: this.currentProject.id
        };
    }
    
    static fromJSON(data) {
        const app = new TodoApp();
        app.projects = [];
        app.projects = data.projects.map(projectData => Project.fromJSON(projectData));
        app.defaultProject = app.projects.find(p => p.id === data.defaultProjectId) || app.projects[0];
        app.currentProject = app.projects.find(p => p.id === data.currentProjectId) || app.defaultProject;
        return app;
    }
    
        

}
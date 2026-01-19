const STORAGE_KEY = 'todo-app-data';

export function saveToStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error GUARDANDO en localStorage:', error);  
        return false;  //
    }
}


export function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error CARGANDO desde localStorage:', error);
        return null;
    }
}

export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}
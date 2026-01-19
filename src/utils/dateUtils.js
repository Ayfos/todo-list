// funciones para trabajar con fechas usando la libreria date-fns

//Importamos solo las funciones que necesitamos de date-fns
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import { es } from 'date-fns/locale'; //ESPAÑOL

// FUNCION 1: FORMATEAR FECHA BONITA
export function formatDate(date, style = 'medium') {
    if (!date) return 'Sin fecha';

    const dateObj = new Date(date);

    switch (style) {
        case 'short':  // 10/12/2024
            return format(dateObj, 'dd/MM/yyyy');
        case 'medium': // 10 dic 2024
            return format(dateObj, 'dd MMM yyyy', { locale: es });
        case 'long':   // 10 de diciembre de 2024
            return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: es });
        case 'time':   // 14:30
            return format(dateObj, 'HH:mm');
        default:
            return format(dateObj, 'dd/MM/yyyy');
    }
}

// Función 2: "Hace 2 días" o "En 3 días"
export function formatRelativeDate(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, { 
        addSuffix: true, 
        locale: es 
    });
}

// Función 3: ¿Es hoy/mañana/pasado?
export function getDateStatus(date) {
    if (!date) return null;
    
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) return 'hoy';
    if (isTomorrow(dateObj)) return 'mañana';
    if (isPast(dateObj)) return 'vencido';
    
    return 'futuro';
}
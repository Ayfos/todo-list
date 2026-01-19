# ✅ Todo List - The Odin Project

![Todo List Screenshot](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Todo+List+Screenshot)

Una aplicación moderna de gestión de tareas construida con JavaScript Vanilla y Webpack como proyecto de The Odin Project.

## 🚀 Características

- ✅ **Gestión completa de tareas** - Crear, leer, actualizar y eliminar (CRUD)
- 📁 **Múltiples proyectos** - Organiza tareas por categorías (Inbox, Trabajo, Personal)
- 🔍 **Búsqueda y filtrado avanzado** - Por texto, estado (pendientes/completadas) y prioridad
- 💾 **Persistencia automática** - Guarda en localStorage cada 10 segundos
- 🎨 **Interfaz moderna** - Diseño responsive con animaciones y transiciones
- 📱 **Compatible con móviles** - Funciona en todos los dispositivos
- ✨ **Panel de detalles** - Vista expandida de cada tarea
- 🗑️ **Eliminación con confirmación** - Modal de confirmación y opción "Deshacer"

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+** - Programación orientada a objetos (clases, módulos)
- **Webpack 5** - Bundling, optimización y gestión de assets
- **CSS3** - Flexbox, Grid, animaciones CSS, variables CSS
- **HTML5** - Semántica moderna y accesibilidad
- **FontAwesome 6** - Iconografía completa
- **LocalStorage API** - Persistencia de datos del lado del cliente
- **Git & GitHub** - Control de versiones y deployment

## 📦 Instalación y Uso Local

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Ayfos/todo-list.git

# 2. Entrar al directorio del proyecto
cd todo-list

# 3. Instalar dependencias
npm install

# 4. Modo desarrollo (con recarga automática)
npm run dev

# 5. Modo producción (build optimizado)
npm run build

# 6. Abrir en el navegador
# Abre el archivo dist/index.html o usa un servidor local
🎯 Guía de Uso
Crear una tarea
Haz clic en "Nueva Tarea" en la esquina superior derecha

Completa el formulario (título obligatorio)

Haz clic en "Guardar Tarea"

Editar una tarea
Haz clic en el icono de editar (✏️) en cualquier tarea

Modifica los campos en el modal

Guarda los cambios

Ver detalles
Haz clic en cualquier parte de una tarea (excepto botones)

Se abrirá el panel lateral con todos los detalles

Filtrar tareas
Búsqueda: Escribe en la barra de búsqueda

Estado: Usa los botones "Todas", "Pendientes", "Completadas"

Prioridad: Selecciona del dropdown de prioridades

Gestión de proyectos
Cambia entre proyectos en el sidebar izquierdo

Crea nuevos proyectos con "Nuevo Proyecto"

🏗️ Estructura del Proyecto
text
todo-list/
├── src/
│   ├── factories/          # Clases principales
│   │   ├── TodoApp.js      # Aplicación principal
│   │   ├── TodoItem.js     # Modelo de tarea
│   │   └── Project.js      # Modelo de proyecto
│   ├── modules/            # Gestores de UI
│   │   └── uiManager.js    # Controlador de interfaz
│   ├── utils/              # Utilidades
│   │   ├── storage.js      # Gestión de localStorage
│   │   └── dateUtils.js    # Utilidades de fecha
│   ├── styles/             # Estilos
│   │   └── main.css        # Estilos principales
│   └── index.js            # Punto de entrada
├── dist/                   # Build de producción (generado)
├── webpack.config.js       # Configuración de Webpack
├── package.json            # Dependencias y scripts
├── README.md               # Este archivo
└── .gitignore              # Archivos ignorados por Git

🔧 Características Técnicas Detalladas
Sistema de Persistencia
Guardado automático cada 10 segundos

Guardado al cerrar la pestaña

Serialización/deserialización de objetos complejos

Manejo de errores robusto

Gestión de Estado
Arquitectura basada en clases (OOP)

Separación clara entre modelo y vista

Sistema de filtros combinados

Actualización en tiempo real de la UI

Interfaz de Usuario
Diseño mobile-first

Modales accesibles (tecla ESC para cerrar)

Animaciones CSS para transiciones

Feedback visual inmediato

🤝 Cómo Contribuir
Las contribuciones son bienvenidas. Para contribuir:

Haz un Fork del proyecto

Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add: AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

📄 Licencia
Este proyecto está licenciado bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

👏 Reconocimientos
The Odin Project - Por el currículum y el proyecto base

FontAwesome - Por los iconos gratuitos

Comunidad de desarrollo open source

📞 Contacto y Soporte
Reportar un bug: Issues

Solicitar una feature: Issues

Email: sofiajp@hotmail.es

## 🚀 Live Demo

[**Ver demo en vivo**](https://ayfos.github.io/todo-list/) - Despliegue automático con GitHub Pages


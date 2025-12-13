//---------------------------------------------------------------------------------------------------------//
// VARIABLES PARA EL MAPA

// Variable para almacenar la instancia del mapa de Leaflet
let mapa = null;

// Variable para almacenar el marcador actual en el mapa
let marcador = null;

// Objeto que contiene las coordenadas y nivel de zoom de las ciudades disponibles
const ubicacionCiudad = {
    'bogota-dc': { // Clave única para identificar la ciudad
        lat: 4.60971, // Latitud de Bogotá
        lng: -74.08175, // Longitud de Bogotá
        zoom: 11 // Nivel de zoom por defecto para la ciudad
    }
}

// Objeto que contiene información detallada de las rutas disponibles
const ubicacionesRutas = {
    'simon-bolivar': { // Clave única para identificar la ruta
        lat: 4.658383, // Latitud del Parque Simón Bolívar
        lng: -74.093940, // Longitud del Parque Simón Bolívar
        nombre: "Parque Metropolitano Simón Bolívar", // Nombre completo del lugar
        descripcion: "El 'pulmón verde' de Bogotá. Ideal para trotar, montar en bici, pícnics y eventos.", // Descripción detallada
        direccion: "Calle 63 #48-17, Teusaquillo", // Dirección física
        actividades: "Caminata, bicicleta, pícnics", // Actividades disponibles
        tipo: "Parque metropolitano", // Tipo de lugar
        zoom: 15 // Nivel de zoom específico para esta ruta
    }
};

//---------------------------------------------------------------------------------------------------------//
// FUNCIONES PARA EL MAPA Y NAVEGACIÓN

// Espera a que el contenido HTML esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    // Selecciona el botón del menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    // Selecciona el contenedor de enlaces de navegación
    const navLinks = document.querySelector('.nav-links');
    
    // Verifica si el botón del menú existe en la página
    if (menuToggle) {
        // Agrega un evento de clic al botón del menú hamburguesa
        menuToggle.addEventListener('click', function() {
            // Alterna la clase 'active' para mostrar/ocultar el menú
            navLinks.classList.toggle('active');
            // Obtiene el estado actual de accesibilidad (expanded/colapsado)
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            // Actualiza el atributo de accesibilidad con el nuevo estado
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Cerrar menú al hacer clic en cualquier enlace del menú
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                // Remueve la clase 'active' para ocultar el menú
                navLinks.classList.remove('active');
                // Actualiza el botón del menú a estado colapsado (para accesibilidad)
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Espera a que el DOM esté completamente cargado para inicializar el mapa
window.addEventListener('DOMContentLoaded', () => {
    // Llama a la función que inicializa el mapa
    inicializarMapa();
});

// Función principal para inicializar el mapa de Leaflet
function inicializarMapa() {
    // Crea una nueva instancia del mapa en el elemento con id 'map'
    mapa = L.map('map').setView([4.60971, -74.08175], 12); // Coordenadas iniciales y zoom
    
    // Añade una capa de mosaicos (tiles) de OpenStreetMap al mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // Texto de atribución que aparece en la esquina del mapa
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20 // Nivel máximo de zoom permitido
    }).addTo(mapa); // Añade la capa al mapa creado
    
    // Muestra la ubicación de Bogotá por defecto
    mostrarUbicacion('bogota-dc');
}

// Función para centrar el mapa en una ciudad específica
function mostrarCiudad(idCiudad){
    // Obtiene la información de la ciudad desde el objeto ubicacionCiudad
    const ciudad = ubicacionCiudad['bogota-dc'];
    // Si no existe la ciudad, sale de la función
    if (!ciudad) return

    // Centra el mapa en las coordenadas de la ciudad con su nivel de zoom
    mapa.setView([ciudad.lat, ciudad.lng], ciudad.zoom)

    // Si hay un marcador en el mapa, lo elimina
    if (marcador) {
        mapa.removeLayer(marcador);
        marcador = null; // Resetea la variable del marcador
    }

    // Desplaza la ventana hacia el contenedor del mapa con animación suave
    document.getElementById('map-container').scrollIntoView({ 
        behavior: 'smooth', // Desplazamiento animado
        block: 'start' // Alinea el elemento al inicio de la ventana
    });
}

// Función para mostrar una ruta específica en el mapa
function mostrarRuta(idRuta) {
    // Obtiene la información de la ruta desde el objeto ubicacionesRutas
    const ruta = ubicacionesRutas[idRuta];
    // Si no existe la ruta, sale de la función
    if (!ruta) return;
    
    // Centra el mapa en las coordenadas de la ruta con su nivel de zoom específico
    mapa.setView([ruta.lat, ruta.lng], ruta.zoom);
    
    // Si hay un marcador existente, lo elimina del mapa
    if (marcador) {
        mapa.removeLayer(marcador);
        marcador = null; // Resetea la variable del marcador
    }
    
    // Crea un nuevo marcador en la ubicación de la ruta
    marcador = L.marker([ruta.lat, ruta.lng], {
        title: ruta.nombre, // Texto que aparece al pasar el cursor
        alt: ruta.nombre // Texto alternativo para accesibilidad
    }).addTo(mapa); // Añade el marcador al mapa
    
    // Crea un popup con información de la ruta y lo asocia al marcador
    marcador.bindPopup(`
        <div style="max-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: rgb(97, 186, 75);">${ruta.nombre}</h4>
            <p style="margin: 0 0 10px 0; color: rgb(0, 0, 0);">${ruta.descripcion}</p>

            <div style="font-size: 0.9em; color: rgb(0, 0, 0);">
                <strong>Dirección:</strong> ${ruta.direccion}<br>
                <strong>Actividades:</strong> ${ruta.actividades}<br>
                <strong>Tipo:</strong> ${ruta.tipo}
            </div>
        </div>
    `).openPopup(); // Abre el popup automáticamente
    
    // Desplaza la ventana hacia el contenedor del mapa con animación suave
    document.getElementById('map-container').scrollIntoView({ 
        behavior: 'smooth', // Desplazamiento animado
        block: 'start' // Alinea el elemento al inicio de la ventana
    });
}

//---------------------------------------------------------------------------------------------------------//
// FUNCIONES PARA FORMULARIO

// Configuración de expresiones regulares para validación de campos del formulario
const regexPatterns = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/, // Solo letras y espacios, 2-50 caracteres
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Formato estándar de email (usuario@dominio.com)
    address: /^[\w\sáéíóúÁÉÍÓÚñÑ\d.,#\-°()]{10,200}$/, // Dirección con caracteres comunes, 10-200 caracteres
    details: /^[\w\sáéíóúÁÉÍÓÚñÑ\d.,;:\-!?¡¿()]{20,500}$/ // Detalles más extensos, 20-500 caracteres
};

// Mensajes de error personalizados para cada campo del formulario
const errorMessages = {
    name: "El nombre debe contener solo letras y espacios (2-50 caracteres)",
    email: "Introduce un email válido (ejemplo: usuario@dominio.com)",
    address: "La dirección debe tener entre 10 y 200 caracteres",
    details: "Los detalles deben tener entre 20 y 500 caracteres"
};

// Estado de validación del formulario (true = válido, false = inválido)
const validationState = {
    name: false,
    email: false,
    address: false,
    details: false
};

// Inicializar sistema de validación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM necesarios para la validación
    const form = document.getElementById('contributeForm'); // Formulario principal
    const submitBtn = document.getElementById('submitBtn'); // Botón de envío
    const formStatus = document.getElementById('formStatus'); // Elemento para mensajes de estado
    
    // Verificar que existan los elementos necesarios en la página
    if (!form || !submitBtn) return; // Si no existen, termina la ejecución
    
    // Función para validar un campo específico usando expresiones regulares
    function validateField(fieldId, regex) {
        // Obtiene el elemento del campo por su ID
        const field = document.getElementById(fieldId);
        // Obtiene el elemento que mostrará el mensaje de error
        const errorElement = document.getElementById(fieldId + 'Error');
        // Obtiene y limpia el valor del campo (elimina espacios al inicio y final)
        const value = field.value.trim();
        
        // Si el campo está vacío, mostrar como inválido
        if (!value) {
            // Actualiza el estado de validación a falso
            validationState[fieldId] = false;
            // Remueve clases de validación e error
            field.classList.remove('valid', 'error');
            // Oculta el mensaje de error
            errorElement.style.display = 'none';
            // Actualiza el estado del botón de envío
            updateSubmitButton();
            // Retorna falso indicando que no es válido
            return false;
        }
        
        // Valida el valor con la expresión regular correspondiente
        const isValid = regex.test(value);
        
        // Actualiza la interfaz según el resultado de la validación
        if (isValid) {
            // Añade clase para indicar campo válido
            field.classList.add('valid');
            // Remueve clase de error si existía
            field.classList.remove('error');
            // Oculta el mensaje de error
            errorElement.style.display = 'none';
        } else {
            // Añade clase para indicar campo con error
            field.classList.add('error');
            // Remueve clase de válido si existía
            field.classList.remove('valid');
            // Establece el texto del mensaje de error
            errorElement.textContent = errorMessages[fieldId];
            // Muestra el mensaje de error
            errorElement.style.display = 'block';
        }
        
        // Actualiza el estado de validación del campo
        validationState[fieldId] = isValid;
        
        // Actualiza el estado del botón de envío
        updateSubmitButton();
        
        // Retorna el resultado de la validación
        return isValid;
    }
    
    // Función para actualizar el estado del botón de envío y mensaje de estado
    function updateSubmitButton() {
        // Verifica si todos los campos son válidos
        const allValid = Object.values(validationState).every(state => state === true);
        
        // Si todos los campos son válidos
        if (allValid) {
            // Habilita el botón de envío
            submitBtn.disabled = false;
            // Muestra mensaje de confirmación
            formStatus.textContent = "✓ Todos los campos son válidos. Puede enviar su contribución.";
            // Aplica clase CSS para estilo de éxito
            formStatus.className = "form-status valid";
        } else {
            // Deshabilita el botón de envío
            submitBtn.disabled = true;
            // Muestra mensaje de error
            formStatus.textContent = "✗ Por favor, complete correctamente todos los campos requeridos";
            // Aplica clase CSS para estilo de error
            formStatus.className = "form-status invalid";
        }
    }
    
    // Función para limpiar el formulario y restablecer estados de validación
    function resetForm() {
        // Limpiar clases de validación de todos los campos
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            // Remueve clases de validación e error
            field.classList.remove('valid', 'error');
        });
        
        // Ocultar todos los mensajes de error
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            // Oculta cada mensaje de error
            msg.style.display = 'none';
        });
        
        // Reiniciar el estado de validación (todos a falso)
        Object.keys(validationState).forEach(key => {
            validationState[key] = false;
        });
        
        // Actualizar el estado del botón y ocultar mensaje de estado
        updateSubmitButton();
        // Oculta el mensaje de estado general del formulario
        formStatus.style.display = 'none';
    }
    
    // Función para manejar el envío del formulario
    function handleSubmit(event) {
        // Previene el envío tradicional del formulario (que recarga la página)
        event.preventDefault();
        
        // Validar todos los campos antes de proceder con el envío
        let isValid = true;
        // Valida cada campo y actualiza la variable isValid
        isValid = validateField('name', regexPatterns.name) && isValid;
        isValid = validateField('email', regexPatterns.email) && isValid;
        isValid = validateField('address', regexPatterns.address) && isValid;
        isValid = validateField('details', regexPatterns.details) && isValid;
        
        // Si todos los campos son válidos, proceder con el envío simulado
        if (isValid) {
            // Cambiar estado del botón durante el envío (feedback visual)
            submitBtn.disabled = true;
            // Guarda el texto original del botón
            const originalText = submitBtn.textContent;
            // Cambia el texto a "Enviando..."
            submitBtn.textContent = "Enviando...";
            
            // Actualizar mensaje de estado
            formStatus.textContent = "Enviando su contribución al servidor...";
            formStatus.className = "form-status valid";
            
            // Simular envío asíncrono al servidor (en producción sería una petición real)
            setTimeout(() => {
                // Mostrar confirmación de envío exitoso
                formStatus.textContent = "¡Gracias por su contribución! Hemos recibido su sugerencia de ruta verde.";
                
                // Mostrar datos enviados en consola (solo para desarrollo/depuración)
                console.log("=== CONTRIBUCIÓN ENVIADA EXITOSAMENTE ===");
                console.log("Nombre:", document.getElementById('name').value);
                console.log("Email:", document.getElementById('email').value);
                console.log("Dirección de ruta:", document.getElementById('address').value);
                console.log("Detalles de ruta:", document.getElementById('details').value);
                console.log("Fecha:", new Date().toLocaleString());
                
                // Restablecer formulario después de 3 segundos
                setTimeout(() => {
                    // Limpia los estados de validación
                    resetForm();
                    // Limpia los valores del formulario
                    form.reset();
                    // Restaura el texto original del botón
                    submitBtn.textContent = originalText;
                }, 3000); // Espera 3 segundos antes de resetear
            }, 1500); // Simula una demora de 1.5 segundos en el envío
        } else {
            // Mostrar mensaje de error si hay campos inválidos
            formStatus.textContent = "Por favor, corrija los errores en los campos marcados antes de enviar.";
            formStatus.className = "form-status invalid";
        }
    }
    
    // Configurar event listeners para validación en tiempo real (al escribir)
    document.getElementById('name').addEventListener('input', () => {
        // Valida el campo 'name' cada vez que el usuario escribe
        validateField('name', regexPatterns.name);
    });
    
    document.getElementById('email').addEventListener('input', () => {
        // Valida el campo 'email' cada vez que el usuario escribe
        validateField('email', regexPatterns.email);
    });
    
    document.getElementById('address').addEventListener('input', () => {
        // Valida el campo 'address' cada vez que el usuario escribe
        validateField('address', regexPatterns.address);
    });
    
    document.getElementById('details').addEventListener('input', () => {
        // Valida el campo 'details' cada vez que el usuario escribe
        validateField('details', regexPatterns.details);
    });
    
    // Configurar event listener para el envío del formulario
    form.addEventListener('submit', handleSubmit);
    
    // Configurar event listener para el botón de reset (si existe)
    const resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        // Al hacer clic en el botón reset, limpia el formulario
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Configurar placeholders más descriptivos al cargar completamente la página
    window.addEventListener('load', () => {
        // Establece placeholders con ejemplos y especificaciones
        document.getElementById('name').placeholder = "Ej: María González (solo letras y espacios)";
        document.getElementById('email').placeholder = "Ej: maria.gonzalez@ejemplo.com";
        document.getElementById('address').placeholder = "Ej: Calle 45 #26-85, Parque El Virrey, Bogotá (entre 10 y 200 caracteres)";
        document.getElementById('details').placeholder = "Describa la ruta: tipo de sendero, dificultad, vegetación, puntos de interés, etc. (entre 20 y 500 caracteres)";
        
        // Inicializar estado del botón de envío (debería estar deshabilitado al inicio)
        updateSubmitButton();
    });
});
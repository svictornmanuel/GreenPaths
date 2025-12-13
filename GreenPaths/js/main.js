//---------------------------------------------------------------------------------------------------------//
// VARIABLES Y OBJETOS

//MAPA
let mapa = null; // almacena la instancia del mapa de Leaflet
let marcador = null; // almacena el marcador

// Objeto que contiene las coordenadas y nivel de zoom de las ciudades disponibles
const ubicacionCiudad = {
    'bogota-dc': { // Clave única para identificar la ciudad
        lat: 4.60971,
        lng: -74.08175,
        zoom: 11
    }
}

// Objeto que contiene información detallada de las rutas disponibles
const ubicacionesRutas = {
    'simon-bolivar': { // Clave única para identificar la ruta
        lat: 4.658383,
        lng: -74.093940,
        nombre: "Parque Metropolitano Simón Bolívar",
        descripcion: "El 'pulmón verde' de Bogotá. Ideal para trotar, montar en bici, pícnics y eventos.",   
        direccion: "Calle 63 #48-17, Teusaquillo",
        actividades: "Caminata, bicicleta, pícnics",
        tipo: "Parque metropolitano",
        zoom: 15
    }
};

// FORMULARIO
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

//---------------------------------------------------------------------------------------------------------//
// FUNCIONES PARA NAVEGACIÓN

// Espera a que el contenido HTML esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle'); // Selecciona el botón del menú hamburguesa
    const navLinks = document.querySelector('.nav-links'); // Selecciona el contenedor de enlaces de navegación
    
    if (menuToggle) { // Verifica si el botón del menú existe en la página
        
        // si existe agrega un evento de clic al botón del menú hamburguesa
        menuToggle.addEventListener('click', function() {

            navLinks.classList.toggle('active'); // Alterna la clase 'active' para mostrar/ocultar el menú
            const isExpanded = this.getAttribute('aria-expanded') === 'true'; // Obtiene si el menú esta abierto
            this.setAttribute('aria-expanded', !isExpanded); // Actualiza el menú con el nuevo estado
        
        });
        
        // cierra menú al hacer clic en cualquier enlace del menú
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active'); // Remueve la clase 'active' para ocultar el menú
                menuToggle.setAttribute('aria-expanded', 'false'); // Actualiza el botón del menú
            });
        });
    }
});

//---------------------------------------------------------------------------------------------------------//
// FUNCIONES PARA El MAPA

// Espera a que el DOM esté completamente cargado para inicializar el mapa
window.addEventListener('DOMContentLoaded', () => {

    inicializarMapa();// Llama a la función que inicializa el mapa

});

// Función principal para inicializar el mapa de Leaflet
function inicializarMapa() {
    
    // Crea una nueva instancia del mapa en el elemento con id 'map'
    mapa = L.map('map').setView([4.60971, -74.08175], 12); // coordenadas y zoom
    
    // Añade una capa de mosaicos (tiles) de OpenStreetMap al mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20 // Nivel máximo de zoom permitido
        
    }).addTo(mapa); // Añade la capa a la instancia del mapa

}

// Función para centrar el mapa en una ciudad
function mostrarCiudad(idCiudad){

    const ciudad = ubicacionCiudad['bogota-dc']; // obtiene la información de la ciudad
    if (!ciudad) return // Si no existe la ciudad, sale de la función

    // Centra el mapa con la información correspondiente
    mapa.setView([ciudad.lat, ciudad.lng], ciudad.zoom)

    // Si hay un marcador en el mapa, lo elimina
    if (marcador) {
        mapa.removeLayer(marcador);
        marcador = null; // Resetea la variable del marcador
    }
}

// Función para mostrar una ruta en el mapa
function mostrarRuta(idRuta) {
    const ruta = ubicacionesRutas[idRuta]; // obtiene la información de la ruta
    if (!ruta) return; // Si no existe la ruta, sale de la función
    
    // Centra el mapa con la información correspondiente
    mapa.setView([ruta.lat, ruta.lng], ruta.zoom);
    
    // Si hay un marcador  lo elimina
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
}

//---------------------------------------------------------------------------------------------------------//
// FUNCIONES PARA FORMULARIO

// Inicializar sistema de validación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // Seleccionar elementos necesarios para la validación
    const form = document.getElementById('contributeForm'); // Formulario principal
    const submitBtn = document.getElementById('submitBtn'); // Botón de envío
    const formStatus = document.getElementById('formStatus'); // Elemento para mensajes de estado
    
    // Verificar que existan los elementos Si no existen, termina la ejecución
    if (!form || !submitBtn) return;
    
    // Función para validar un campo específico usando expresiones regulares
    function validateField(fieldId, regex) {

        const field = document.getElementById(fieldId); // Obtiene el elemento por ID
        const errorElement = document.getElementById(fieldId + 'Error'); // elemento para mensage de error
        const value = field.value.trim(); // elimina espacios al inicio y final
        
        // Si el campo está vacío, mostrar como inválido
        if (!value) {
    
            validationState[fieldId] = false; // Actualiza el estado de validación a falso
            field.classList.remove('valid', 'error'); // Remueve clases de validación e error
            errorElement.style.display = 'none'; // Oculta el mensaje de error
            updateSubmitButton(); // Actualiza el estado del botón de envío
            
            return false; 
        }
        
        // Valida el valor con la expresión regular correspondiente
        const isValid = regex.test(value);
        
        // Actualiza la interfaz según el resultado de la validación
        if (isValid) { // si es valido
            
            field.classList.add('valid'); // Añade clase para indicar campo válido
            field.classList.remove('error'); // Remueve clase de error si existía
            errorElement.style.display = 'none'; // Oculta el mensaje de error

        } else { // si no es valido
            
            field.classList.add('error'); // Añade clase para indicar campo con error
            field.classList.remove('valid'); // Remueve clase de válido si existía

            errorElement.textContent = errorMessages[fieldId]; // Establece el texto del mensaje de error
            errorElement.style.display = 'block'; // Muestra el mensaje de error
        }
        
        validationState[fieldId] = isValid; // Actualiza el estado de validación del campo
        updateSubmitButton(); // Actualiza el estado del botón de envío
        return isValid; // Retorna el resultado de la validación
    }
    
    // Función para actualizar el estado del botón de envío y mensaje de estado
    function updateSubmitButton() {
        // Verifica si todos los campos son válidos
        const allValid = Object.values(validationState).every(state => state === true);
        
        // Si todos los campos son válidos
        if (allValid) { // si es true

            
            submitBtn.disabled = false; // Habilita el botón de envío
            // Muestra mensaje de confirmación
            formStatus.textContent = "✓ Todos los campos son válidos. Puede enviar su contribución.";
            // Aplica clase CSS para estilo de éxito
            formStatus.className = "form-status valid";

        } else { // si es false

            submitBtn.disabled = true; // Deshabilita el botón de envío
            // Muestra mensaje de error
            formStatus.textContent = "✗ Por favor, complete correctamente todos los campos requeridos";
            // Aplica clase CSS para estilo de error
            formStatus.className = "form-status invalid";

        }
    }
    
    // Función para limpiar el formulario y restablecer estados de validación
    function resetForm() {
        // Limpia clases de validación de todos los campos
        const fields = form.querySelectorAll('input, textarea');

        fields.forEach(field => {
            // Remueve clases de validación y error
            field.classList.remove('valid', 'error');
        });
        
        // Oculta todos los mensajes de error
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            // Oculta cada mensaje de error
            msg.style.display = 'none';
        });
        
        // Reiniciar el estado de validación (todos a falso)
        Object.keys(validationState).forEach(key => {
            validationState[key] = false;
        });
        
        updateSubmitButton(); // Actualizar el estado del botón y ocultar mensaje de estado
        formStatus.style.display = 'none'; // Oculta el mensaje de estado general del formulario
    }
    
    // Función para manejar el envío del formulario
    function handleSubmit(event) {
        event.preventDefault(); // Previene el envío tradicional del formulario (que recarga la página)
        let isValid = true; // Validar todos los campos antes de proceder con el envío

        // Valida cada campo y actualiza la variable isValid
        isValid = validateField('name', regexPatterns.name) && isValid;
        isValid = validateField('email', regexPatterns.email) && isValid;
        isValid = validateField('address', regexPatterns.address) && isValid;
        isValid = validateField('details', regexPatterns.details) && isValid;
        
        // Si todos los campos son válidos
        if (isValid) {
            submitBtn.disabled = true; // Cambiar estado del botón durante el envío (feedback visual)
            const originalText = submitBtn.textContent; // Guarda el texto original del botón
            submitBtn.textContent = "Enviando..."; // Cambia el texto a "Enviando..."
            
            // Actualizar mensaje de estado
            formStatus.textContent = "Enviando su contribución al servidor...";
            formStatus.className = "form-status valid";
            
            // Simular envío asíncrono al servidor
            setTimeout(() => {
                // Mostrar confirmación de envío exitoso
                formStatus.textContent = "¡Gracias por su contribución! Hemos recibido su sugerencia de ruta verde.";
                
                // Restablecer formulario después de 3 segundos
                setTimeout(() => {
                    
                    resetForm(); // Limpia los estados de validación
                    form.reset(); // Limpia los valores del formulario
                    submitBtn.textContent = originalText; // Restaura el texto original del botón

                }, 3000); // Espera 3 segundos antes de resetear

            }, 1500); // Espera de 1.5 segundos en el envío
        } else {
            // Mensaje de error si hay campos inválidos
            formStatus.textContent = "Por favor, corrija los errores en los campos marcados antes de enviar.";
            formStatus.className = "form-status invalid";
        }
    }
    
    // Configuración de los "event listener" para validar cada campo al escribir
    // nombre
    document.getElementById('name').addEventListener('input', () => {
        validateField('name', regexPatterns.name);
    });
    
    // email
    document.getElementById('email').addEventListener('input', () => {
        validateField('email', regexPatterns.email);
    });
    
    //dirección
    document.getElementById('address').addEventListener('input', () => {
        validateField('address', regexPatterns.address);
    });
    
    // detalles
    document.getElementById('details').addEventListener('input', () => {
        validateField('details', regexPatterns.details);
    });
    
    // evento para el para enviar
    form.addEventListener('submit', handleSubmit);
    
    // configuración de los mensajes de ejemplo
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
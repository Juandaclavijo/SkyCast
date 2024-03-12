let ciudades = [];

function obtenerClima(ciudad) {
    const API_KEY = "1b89d78918749622df34d113566a23a7";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener la información del clima.");
            }
            return response.json();
        })
        .then(datos => {
            // Retornar los datos del clima
            return {
                ciudad: ciudad,
                fecha: new Date().toLocaleDateString(),
                iconoClima: `http://openweathermap.org/img/wn/${datos.weather[0].icon}.png`,
                temperatura: Math.round(datos.main.temp),
                condicion: datos.weather[0].description,
                humedad: datos.main.humidity,
                viento: datos.wind.speed
            };
        })
        .catch(error => {
            console.error(error);
            throw new Error("Error al obtener el clima. Verifique la conexión a internet o la ciudad ingresada.");
        });
}

// Función para añadir una ciudad y mostrarla como card
function agregarCiudad(ciudad) {
    // Obtener el clima de la ciudad
    obtenerClima(ciudad)
        .then(datosClima => {
            // Añadir la ciudad al array
            ciudades.push(datosClima);

            // Mostrar las ciudades como cards
            mostrarCiudades();
        })
        .catch(error => {
            // Manejar el error de manera apropiada
            alert(error.message);
        });
}

// Función para mostrar las ciudades como cards
function mostrarCiudades(ciudadesAMostrar = ciudades) {
    const cardsContainer = document.getElementById("cards-container");
    // Limpiar el contenido existente
    cardsContainer.innerHTML = "";

    // Iterar sobre las ciudades y crear las cards
    ciudadesAMostrar.forEach((ciudad, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardContent = `
            <span class="close-icon" onclick="eliminarCiudad(${index})">×</span>
            <h3>${ciudad.ciudad}</h3>
            <p>Fecha: ${ciudad.fecha}</p>
            <p>Temperatura: ${ciudad.temperatura}°C</p>
            <p>Condición: ${ciudad.condicion}</p>
            <p>Humedad: ${ciudad.humedad}%</p>
            <p>Viento: ${ciudad.viento} km/h</p>
            <img src="${ciudad.iconoClima}" alt="Icono del clima">
        `;

        card.innerHTML = cardContent;
        cardsContainer.appendChild(card);
    });
}

// Función para buscar una ciudad entre las cards ya agregadas
function buscarCiudad() {
    const ciudadInput = document.getElementById("buscar-ciudad");
    const ciudad = ciudadInput.value.trim();

    if (ciudad !== "") {
        mostrarCiudadesFiltradas(ciudad);
        ciudadInput.value = "";
    }
}

// Función para mostrar ciudades filtradas por búsqueda
function mostrarCiudadesFiltradas(busqueda) {
    const cardsContainer = document.getElementById("cards-container");
    // Limpiar el contenido existente
    cardsContainer.innerHTML = "";

    // Filtrar las ciudades que coincidan con la búsqueda
    const ciudadesFiltradas = ciudades.filter(ciudad => ciudad.ciudad.toLowerCase().includes(busqueda.toLowerCase()));

    // Mostrar las ciudades filtradas como cards
    ciudadesFiltradas.forEach(ciudad => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardContent = `
            <span class="close-icon" onclick="eliminarCiudad(${ciudades.indexOf(ciudad)})">×</span>
            <h3>${ciudad.ciudad}</h3>
            <p>Fecha: ${ciudad.fecha}</p>
            <p>Temperatura: ${ciudad.temperatura}°C</p>
            <p>Condición: ${ciudad.condicion}</p>
            <p>Humedad: ${ciudad.humedad}%</p>
            <p>Viento: ${ciudad.viento} km/h</p>
            <img src="${ciudad.iconoClima}" alt="Icono del clima">
        `;

        card.innerHTML = cardContent;
        cardsContainer.appendChild(card);
    });
}

// Función para eliminar una ciudad
function eliminarCiudad(index) {
    ciudades.splice(index, 1);
    mostrarCiudades();
}

// Asociar la función de añadir ciudad al formulario
document.getElementById("ciudad-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const ciudadInput = document.getElementById("buscador-ciudad");
    const ciudad = ciudadInput.value.trim();

    if (ciudad !== "") {
        agregarCiudad(ciudad);
        ciudadInput.value = "";
    }
});

function reiniciarPagina() {
    location.reload();
}
// Llamada inicial para mostrar la ciudad por defecto
agregarCiudad("Bogotá");

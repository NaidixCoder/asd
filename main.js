const getElement = document.getElementById.bind(document);

const sugerenciasLista = getElement("sugerencias-lista");

// Buscador modal inicio
const inputInicio = getElement("welcome-search");
const buscadorInicio = getElement("welcome-btn");

// Buscador header
const buscador = getElement("nav-btn");
const inputNav = getElement("nav-search");

const iconoBusqueda = getElement("bx-menu"); // Icono busqueda
const header = document.querySelector("header");
const navBar = document.querySelector(".nav")
const logo = document.querySelector(".logo")

let ciudad;

// Listeners ventana modal.
buscadorInicio.addEventListener("click", () => buscadorWelcome()); // Evento click, boton buscar de ventana modal.

inputInicio.addEventListener("keydown", function (event) { // Evento Keydown, input de ventana modal.
    if (event.key === "Enter") {
        event.preventDefault();
        buscadorWelcome();
    }
});

inputInicio.addEventListener("input", function () { // Evento input, boton buscar de ventana modal.
    const textInput = this.value.toLowerCase();
    autoComplete(textInput);
});

buscador.addEventListener("click", () => searchNav()); // Evento click, boton buscar de navBar.

// Listeners main page.
inputNav.addEventListener("keydown", function (event) { // Evento KeyDown, input navBar
    if (event.key === "Enter") {
        event.preventDefault();
        searchNav();
        resetHeader()
    }
});

iconoBusqueda.addEventListener("click", () => { // Icono de busqueda. (lupa)

    iconoBusqueda.classList.add("d-none");

    logo.style.opacity = "0";
    setTimeout(() => {
        logo.classList.add("d-none");
    }, 400)

    inputNav.style.opacity = "1";
    setTimeout(() => {
        inputNav.classList.remove("d-none");
        inputNav.style.display = "inline";
        inputNav.value = "";
    }, 400)

    header.style.justifyContent = "center";

})


// Funcion para resetear el header luego de una busqueda en mobile.
function resetHeader() {
    iconoBusqueda.classList.remove("d-none");
    if (window.innerWidth < 660) {
        inputNav.classList.add("d-none");
    }
    inputNav.value = "";
    logo.classList.remove("d-none");
    logo.style.opacity = "1";

    header.style.justifyContent = "end";
}

// Funcion de busqueda en ventana modal.
function buscadorWelcome() {
    ciudad = getElement("welcome-search").value;

    if (inputInicio.value !== "") {
        conexionApi(ciudad);
    } else {
        inputInicio.classList.add("ph-red");
        setTimeout(() => {
            inputInicio.classList.remove("ph-red");
        }, 500);
    }
}

// Funcion de busqueda en navBar
function searchNav() {

    ciudad = inputNav.value;

    if (inputNav.value !== "") {
        conexionApi(ciudad);
    } else {
        inputNav.classList.add("ph-red")
        setTimeout(() => {
            inputNav.classList.remove("ph-red");
        }, 500);
    };
}

// funcion de autompletado.
const autoComplete = (textInput) => {
    const path = "./db/ciudades-argentinas.json";

    fetch(path)
        .then(data => data.json())
        .then(data => {

            // Agrega la condición para verificar la longitud del texto
            if (textInput === "" || textInput.length <= 3) {
                sugerenciasLista.innerHTML = '';
            } else {
                // Filtra las ciudades que coinciden con el texto de entrada
                const ciudadesFiltradas = data.reduce((acc, provincia) => {
                    const ciudadesProvincia = provincia.ciudades.filter(ciudad =>
                        ciudad.nombre.toLowerCase().includes(textInput)
                    );

                    return acc.concat(ciudadesProvincia.map(ciudad => ciudad.nombre));
                }, []);

                const primerasCiudades = ciudadesFiltradas.slice(0, 15);

                // Muestra las sugerencias en la lista
                mostrarSugerencias(primerasCiudades);
            }
        });
};

// Funcion para limpiar <li> generados por autocompletado
const limpiarLista = () => sugerenciasLista.innerHTML = '';

const mostrarSugerencias = (ciudades) => {

    limpiarLista();

    // Si hay al menos una ciudad coincidente, muestra las sugerencias
    if (ciudades.length > 0) {
        ciudades.forEach(ciudad => {
            const listItem = document.createElement('li');
            listItem.textContent = ciudad;
            listItem.classList = "li-sugerencias"

            // Agrega un evento al hacer clic en la sugerencia
            listItem.addEventListener('click', function () {
                inputInicio.value = ciudad;
                limpiarLista();
            });

            sugerenciasLista.appendChild(listItem);
        });
    } else {
        limpiarLista()
    }
};

// Conexion a API openwheater
const conexionApi = (ciudad) => {

    const KEY = "c06512b6efa1d5cab420470cc4ba5fc5"
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${KEY}`;
    const description = getElement("description");

    fetch(URL)
        .then(data => {
            if (!data.ok) {
                throw new Error(`Ciudad no encontrada: ${data.statusText}`);
            }
            return data.json();
        })
        .then(data => {

            actualizarDatosClima(data); // Función para actualizar los datos del clima
            description.textContent = traductorClima(data.weather[0].description); // English to spanish
            changeDisplay();

        })
        .catch(error => {
            console.warn("Error en la conexión:", error.message);
            inputInicio.classList.add("ph-red");
            inputInicio.value = "";
            inputInicio.placeholder = "Ciudad no encontrada";
            
            inputNav.classList.add("ph-red");
            inputNav.value = "";
            inputNav.placeholder = "Ciudad no encontrada";
            
            setTimeout(() => {
                inputInicio.placeholder = "Ingrese localidad"
                inputInicio.classList.remove("ph-red");
                
                inputNav.classList.remove("ph-red");
                inputNav.placeholder = "Ingrese localidad";

            }, 1000);
            return
        });
};

// Funcion para acutalizar los datos del clima.
const actualizarDatosClima = (data) => {
    const temperatura = getElement("temperatura");
    const humedad = getElement("humedad");
    const wind = getElement("wind");
    const titulo = getElement("title");
    const imgMain = getElement("main-img");

    titulo.textContent = `${data.name}, ${data.sys.country}`;
    imgMain.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperatura.textContent = parseFloat(data.main.temp / 10).toFixed(2) + "°";
    humedad.textContent = `${data.main.humidity}%`;
    wind.textContent = `${(data.wind.speed * 1.60934).toFixed(1)} Kmh`;
};

// Traduce las respuestas recibidas de la API. English to Spanish.
const traductorClima = (englishDescription) => {
    switch (englishDescription) {
        case "scattered clouds":
            return "Nubes dispersas";
        case "overcast clouds":
            return "Mayormente nublado";
        case "broken clouds":
            return "Parcialmente nublado";
        case "few clouds":
            return "Pocas nubes";
        case "clear sky":
            return "Despejado";
        case "light rain":
            return "LLuvia debil";
        default:
            return englishDescription;
    }
};


// Funcion para cambiar de la ventana "modal" al main.
const changeDisplay = () => {
    const modalWelcome = document.querySelector(".modalInicio"); // Ventana de inicio de pagina.
    const welcomeContent = document.querySelector(".welcome"); // Selector de contenido dentro de modal.
    const mainContent = document.querySelector(".main-content"); // Selector del contenido dentro de <main> .

    const main = document.querySelector(".main")

    modalWelcome.style.opacity = "0";

    header.classList.remove("d-none");
    header.classList.add("header");
    header.style.opacity = "1";

    main.classList.remove("d-none")
    mainContent.classList.remove("d-none")

    mainContent.style.opacity = "1";
    welcomeContent.style.opacity = "0";


    setTimeout(() => {
        modalWelcome.style.display = "none";
    }, 2000);
}
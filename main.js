const getElement = document.getElementById.bind(document);

const sugerenciasLista = getElement("sugerencias-lista");

// Buscador modal inicio
const inputInicio = getElement("welcome-search");
const buscadorInicio = getElement("welcome-btn");

// Buscador header
const buscador = getElement("nav-btn");
const inputNav = getElement("nav-search");

let ciudad;

// Listeners
buscadorInicio.addEventListener("click", () =>  buscadorWelcome());

inputInicio.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscadorWelcome();
    }
});

inputInicio.addEventListener("input", function () {
    const textInput = this.value.toLowerCase();
    autoComplete(textInput);
});

buscador.addEventListener("click", () => searchNav());

inputNav.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchNav();
    }
});


function buscadorWelcome () {
    ciudad = getElement("welcome-search").value;

    if (inputInicio.value !== "") {
        conexionApi(ciudad);
    } else {
        inputInicio.classList.add("ph-red");
        setTimeout(() => {
            inputInicio.classList.remove("ph-red");
        }, 400);
    }
    
}
function searchNav () {
    const buscadorNav = getElement("nav-search");
    ciudad = buscadorNav.value;
    

    if (buscadorNav.value !== "") {
        conexionApi(ciudad);
        console.log(buscadorNav.value)
    } else {
        buscadorNav.classList.add("ph-red")
        setTimeout(() => {
            buscadorNav.classList.remove("ph-red");
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

            console.log(data) // Delete after
        })
        .catch(error => {
            console.warn("Error en la conexión:", error.message);
            inputInicio.classList.add("ph-red");
            inputInicio.value = "";
            inputInicio.placeholder = "Ciudad no encontrada";
            setTimeout(() => {
                inputInicio.placeholder = "Ingrese localidad"
                inputInicio.classList.remove("ph-red");
            }, 1000);
            return
        });
};


// Funcion para cambiar de la ventana "modal" al main.
const changeDisplay = () => {
    const modalWelcome = document.querySelector(".modalInicio"); // Ventana de inicio de pagina.
    const welcomeContent = document.querySelector(".welcome"); // Selector de contenido dentro de modal.
    const mainContent = document.querySelector(".main-content"); // Selector del contenido dentro de <main> .
    const header = document.querySelector(".header"); // Selector del <header>

    modalWelcome.style.opacity = "0";
    header.style.display = "flex";

    modalWelcome.style.height = "calc(100vh - 90px)";
    header.style.opacity = "1";
    mainContent.style.opacity = "1";
    welcomeContent.style.opacity = "0";


    setTimeout(() => {
        modalWelcome.style.display = "none";
    }, 2000);
}


// Funcion traductor.

const traductorClima = (englishDescription) => {
    switch (englishDescription) {
        case "scattered clouds":
            return "Nubes dispersas";
        case "broken clouds":
            return "Parcialmente nublado";
        case "clear sky":
            return "Despejado";
        default:
            return englishDescription;
    }
};

const actualizarDatosClima = (data) => {
    const temperatura = getElement("temperatura");
    const humedad = getElement("humedad");
    const wind = getElement("wind");
    const titulo = getElement("title");
    const imgMain = getElement("main-img");

    titulo.textContent = data.name;
    imgMain.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperatura.textContent = parseFloat(data.main.temp / 10).toFixed(2) + "°";
    humedad.textContent = `${data.main.humidity}%`;
    wind.textContent = `${(data.wind.speed * 1.60934).toFixed(1)} Kmh`;
};
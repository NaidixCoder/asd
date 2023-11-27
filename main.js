const KEY = "c06512b6efa1d5cab420470cc4ba5fc5"

const getElement = document.getElementById.bind(document);

const modalWelcome = document.querySelector(".modalInicio"); // Ventana de inicio de pagina.
const welcomeContent = document.querySelector(".welcome"); // Selector de contenido dentro de modal.
const main = document.querySelector(".main"); // Selector de <main>
const mainContent = document.querySelector(".main-content"); // Selector del contenido dentro de <main> .
const header = document.querySelector(".header"); // Selector del <header>
const sugerenciasLista = getElement("sugerencias-lista");

const inputInicio = getElement("welcome-search");
const buscadorInicio = getElement("welcome-btn");
const buscador = getElement("nav-btn");
const titulo = getElement("title");
const imgMain = getElement("main-img");
const description = getElement("description");
const temperatura = getElement("temperatura");


let ciudad;


const buscadorMenu = getElement("bx-menu");

buscadorMenu.addEventListener("click", () => {

})


buscadorInicio.addEventListener("click", () => {

    if (modalWelcome.style.display !== "none"){
        ciudad = getElement("welcome-search").value;
    } else {
        ciudad = getElement("nav-search").value;
    }


    if (inputInicio.value === ""){
        inputInicio.classList.add("ph-red")
        setTimeout(() => {
            inputInicio.classList.remove("ph-red");
        }, 400);
    } else {
        conexion();
        console.log(conexion)
        changeDisplay();
    }
    

});

buscador.addEventListener("click", () => {
    conexion();
});

const conexion = () =>{

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${KEY}`;
    fetch(URL)
        .then(data => data.json())
        .then(data => {

                titulo.textContent = data.name;
                imgMain.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                if (data.weather[0].description === "scattered clouds") {
                    description.textContent = "Nubes dispersas";
                } else if (data.weather[0].description === "broken clouds") {
                    description.textContent = "Parcialmente nublado";
                } else if (data.weather[0].description === "clear sky"){
                    description.textContent = "Despejado";
                } else {
                    description.textContent = data.weather[0].description;
                }
                temperatura.textContent = parseFloat((data.main.temp) / 10).toFixed(2) + "°";

                const humedad = getElement("humedad");
                const wind = getElement("wind")
                humedad.textContent = `${data.main.humidity}%`;
                wind.textContent = `${(data.wind.speed * 1.60934).toFixed(1)} Kmh`;
                console.log(data)
        });
}


// Funcion para cambiar de la ventana "modal" al main.
const changeDisplay = () => {
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




const autoComplete = () => {
    const path = "./db/ciudades-argentinas.json";
    fetch(path)
        .then(data => data.json())
        .then(data => {

            inputInicio.addEventListener("input", function () {
                const textInput = this.value.toLowerCase();

                // Agrega la condición para verificar la longitud del texto
                if (inputInicio.value === "" || inputInicio.value.length <= 3) {
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

                // Muestra las sugerencias en la lista
                mostrarSugerencias(primerasCiudades);
                }
            
            });

            function mostrarSugerencias(ciudades) {
                // Limpia la lista de sugerencias
                sugerenciasLista.innerHTML = '';

                // Si hay al menos una ciudad coincidente, muestra las sugerencias
                if (ciudades.length > 0) {
                    ciudades.forEach(sugerencia => {
                        const listItem = document.createElement('li');
                        listItem.textContent = sugerencia;
                        listItem.classList = "li-sugerencias"

                        // Agrega un evento al hacer clic en la sugerencia
                        listItem.addEventListener('click', function () {
                            inputInicio.value = sugerencia;
                            sugerenciasLista.innerHTML = ''; // Limpia la lista después de seleccionar
                        });

                        sugerenciasLista.appendChild(listItem);
                    });
                } else {
                    sugerenciasLista.innerHTML = ''; // Limpia la lista si no hay coincidencias
                }
            }
        })
        .catch(error => console.warn('Error al cargar las ciudades:', error));
};

autoComplete()
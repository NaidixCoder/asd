const getElement = document.getElementById.bind(document);

const autoComplete = () => {
    const path = "./db/ciudades-argentinas.json";
    fetch(path)
        .then(res => res.json())
        .then(data => {
            const inputInicio = getElement("welcome-search");
            const sugerenciasLista = getElement("sugerencias-lista");

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

                    return acc.concat(ciudadesProvincia.map(ciudad => ciudad.nombre)); // Solo el nombre de la ciudad
                }, []);

                const primerasCincoCiudades = ciudadesFiltradas.slice(0, 20);

                    // Muestra las sugerencias en la lista
                    mostrarSugerencias(primerasCincoCiudades);

                // Muestra las sugerencias en la lista
                mostrarSugerencias(primerasCincoCiudades);
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


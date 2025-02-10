document.addEventListener('DOMContentLoaded', function() {
  let productos = [];
  const contenedorProductos = document.getElementById("productos");
  const inputBusqueda = document.getElementById("buscar");
  const selectFiltro = document.getElementById("filtro");

  // Cargar los productos desde el archivo JSON
  fetch('data/productos.json')
    .then(response => response.json())
    .then(data => {
      // Filtrar productos disponibles
      productos = data.filter(producto => producto.disponible); // Solo productos disponibles
      mostrarProductos(productos);  // Mostrar todos los productos disponibles al inicio
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });

  // Cargar avisos desde el archivo JSON
  fetch('data/avisos.json')
    .then(response => response.json())
    .then(avisos => mostrarAvisos(avisos))
    .catch(error => console.error('Error al cargar los avisos:', error));

  // Cargar afiches desde el archivo JSON
  fetch('data/afiches.json')
    .then(response => response.json())
    .then(afiches => mostrarAfiches(afiches))
    .catch(error => console.error('Error al cargar los afiches:', error));

  // Función para mostrar los productos
  function mostrarProductos(productosFiltrados) {
    contenedorProductos.innerHTML = '';
    productosFiltrados.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("col-md-4", "col-sm-6", "col-12");

      div.innerHTML = `
        <div class="hortaliza">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h2>${producto.nombre}</h2>
          <p>${producto.descripcion}</p>
          <p class="precio">${producto.precio}</p>
        </div>
      `;

      contenedorProductos.appendChild(div);
    });
  }

  // Filtrar por búsqueda o categoría
  inputBusqueda.addEventListener('input', function() {
    const busqueda = inputBusqueda.value.toLowerCase();
    const productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
  });

  // Filtrar por categoría
  selectFiltro.addEventListener('change', function() {
    const filtro = selectFiltro.value;

    let productosFiltrados = productos;

    if (filtro) {
      // Filtrar productos por categoría
      productosFiltrados = productos.filter(producto => 
        producto.categoria && producto.categoria.toLowerCase() === filtro.toLowerCase()
      );
    }

    mostrarProductos(productosFiltrados);
  });

  // Función para mostrar avisos
  function mostrarAvisos(avisos) {
    const contenedorAvisos = document.getElementById('avisos');
    contenedorAvisos.innerHTML = '';

    avisos.forEach(aviso => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = ` 
        <strong>${aviso.fecha}:</strong> ${aviso.texto}
      `;
      contenedorAvisos.appendChild(item);
    });
  }

  // Función para mostrar afiches
  function mostrarAfiches(afiches) {
    const contenedorAfiches = document.getElementById('afiches');
    contenedorAfiches.innerHTML = '';

    afiches.forEach((afiche, index) => {
      const item = document.createElement('div');
      item.className = `carousel-item${index === 0 ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${afiche.imagen}" class="d-block w-100" alt="${afiche.descripcion}">
        <div class="carousel-caption d-none d-md-block">
          <p>${afiche.descripcion}</p>
        </div>`;
      contenedorAfiches.appendChild(item);
    });
  }
});

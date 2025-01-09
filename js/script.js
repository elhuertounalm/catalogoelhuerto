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

    // Funcionalidad para generar el PDF
    document.getElementById("generarPDF").addEventListener("click", function() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Comprobar si está activado el modo oscuro
      const modoOscuro = document.body.classList.contains("bg-dark");
      
      if (modoOscuro) {
        // Fondo oscuro y texto blanco para el PDF en modo oscuro
        doc.setFillColor(40, 40, 40); // Fondo oscuro
        doc.rect(0, 0, 210, 297, 'F'); // Establecer el fondo para toda la página
        doc.setTextColor(255, 255, 255); // Texto blanco
      } else {
        // Fondo blanco y texto negro para el PDF en modo claro
        doc.setFillColor(255, 255, 255); // Fondo blanco
        doc.rect(0, 0, 210, 297, 'F'); // Establecer el fondo para toda la página
        doc.setTextColor(0, 0, 0); // Texto negro
      }

      // Agregar título
      doc.setFontSize(22);
      doc.text("Catálogo de Hortalizas", 10, 20);

      // Ajustar la tabla
      const startY = 30;
      const marginX = 10;
      let y = startY;

      // Crear encabezados de la tabla
      doc.setFontSize(14);
      doc.text("Nombre", marginX, y);
      doc.text("Precio", marginX + 60, y);
      doc.text("Descripción", marginX + 120, y);

      // Dibujar una línea debajo de los encabezados
      y += 10;
      doc.line(marginX, y, 200, y);

      // Agregar productos en la tabla
      productos.forEach(producto => {
        y += 10;
        doc.setFontSize(12);
        doc.text(producto.nombre, marginX, y);
        doc.text(producto.precio, marginX + 60, y);
        doc.text(producto.descripcion, marginX + 120, y);
      });

      // Agregar las redes sociales
      y += 15;
      doc.setFontSize(14);
      doc.text("Síguenos en nuestras redes sociales:", marginX, y);
      y += 10;
      doc.setFontSize(12);
      doc.text("Facebook: https://facebook.com", marginX, y);
      y += 5;
      doc.text("Tick Tock: https://tiktok.com", marginX, y);
      y += 5;
      doc.text("Instagram: https://instagram.com", marginX, y);

      // Descargar el archivo PDF
      doc.save("catalogo_hortalizas.pdf");
    });

    // Alternar modo oscuro
    const botonModoOscuro = document.getElementById("modoOscuro");
    botonModoOscuro.addEventListener("click", function() {
      document.body.classList.toggle("bg-dark");
      document.body.classList.toggle("text-white");
    });
  });

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

  // Funcionalidad para generar el PDF
  document.getElementById("generarPDF").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Comprobar si está activado el modo oscuro
    const modoOscuro = document.body.classList.contains("bg-dark");

    // Configurar fondo y color de texto según el modo
    if (modoOscuro) {
      doc.setFillColor(40, 40, 40); // Fondo oscuro
      doc.rect(0, 0, 210, 297, 'F'); // Establecer el fondo para toda la página
      doc.setTextColor(255, 255, 255); // Texto blanco
    } else {
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

    // Función para ajustar las descripciones a la página
    const maxWidth = 85;  // El ancho máximo para la descripción (ajustado para que encaje mejor)
    const lineHeight = 6;  // Altura entre líneas de texto

    // Agregar productos en la tabla
    productos.forEach(producto => {
      if (y > 270) {  // Si la página está llena, añadir una nueva página
        doc.addPage();
        if (modoOscuro) {
          doc.setFillColor(40, 40, 40);
          doc.rect(0, 0, 210, 297, 'F');
          doc.setTextColor(255, 255, 255);
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, 210, 297, 'F');
          doc.setTextColor(0, 0, 0);
        }
        y = startY;
      }

      doc.setFontSize(12);
      doc.text(producto.nombre, marginX, y);
      doc.text(producto.precio, marginX + 60, y);

      // Ajustar la descripción para que se ajuste en el espacio disponible
      const lines = doc.splitTextToSize(producto.descripcion, maxWidth);  // Divide el texto en líneas

      // Ajustar el espaciado entre líneas si es necesario
      y += lineHeight;
      lines.forEach(line => {
        doc.text(line, marginX + 120, y);
        y += lineHeight;
      });
    });

    // Asegurarse de que siempre haya espacio para los detalles adicionales
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Agregar las redes sociales y otros detalles al final
    doc.setFontSize(14);
    doc.text("Síguenos en nuestras redes sociales:", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Facebook: https://facebook.com", marginX, y);
    y += 5;
    doc.text("TikTok: https://tiktok.com", marginX, y);
    y += 5;
    doc.text("Instagram: https://instagram.com", marginX, y);

    // Agregar cuentas bancarias y contacto
    y += 10;
    doc.setFontSize(14);
    doc.text("Información de contacto y cuentas bancarias:", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Cuenta Bancaria 1: 1234567890", marginX, y);
    y += 5;
    doc.text("Cuenta Bancaria 2: 9876543210", marginX, y);
    y += 5;
    doc.text("Teléfono: 123-456-789", marginX, y);
    y += 5;
    doc.text("Correo: contacto@empresa.com", marginX, y);

    // Agregar los Términos y Condiciones
    y += 15;
    doc.setFontSize(14);
    doc.text("Términos y Condiciones", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("1. Los productos son solo para uso personal.", marginX, y);
    y += 5;
    doc.text("2. Los precios están sujetos a cambios sin previo aviso.", marginX, y);
    y += 5;
    doc.text("3. Las compras realizadas no son reembolsables.", marginX, y);
    y += 5;
    doc.text("4. La empresa no se hace responsable por daños derivados del uso incorrecto de los productos.", marginX, y);
    y += 5;
    doc.text("5. Todos los productos están sujetos a disponibilidad de stock.", marginX, y);

    // Descargar el archivo PDF
    doc.save("catalogo_hortalizas.pdf");
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

  // Alternar modo oscuro
  const botonModoOscuro = document.getElementById("modoOscuro");
  botonModoOscuro.addEventListener("click", function() {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  });
});

document.addEventListener('DOMContentLoaded', function () {
  let productos = [];
  const contenedorProductos = document.getElementById("productos");
  const inputBusqueda = document.getElementById("buscar");
  const selectFiltro = document.getElementById("filtro");
  const contenedorAfiches = document.getElementById("afiches");

  // Cargar los productos desde el archivo JSON
  fetch('data/productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data.filter(producto => producto.disponible);
      mostrarProductos(productos);
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });

  // Cargar los afiches desde el archivo JSON
  fetch('data/afiches.json')
    .then(response => response.json())
    .then(data => {
      mostrarAfiches(data);
    })
    .catch(error => {
      console.error("Error al cargar los afiches:", error);
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

  // Función para mostrar los afiches
  function mostrarAfiches(afiches) {
    contenedorAfiches.innerHTML = '';
    afiches.forEach((afiche, index) => {
      const item = document.createElement('div');
      item.className = `carousel-item${index === 0 ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${afiche.imagen}" class="d-block w-100" alt="${afiche.descripcion}">
        <div class="carousel-caption d-none d-md-block">
          <p>${afiche.descripcion}</p>
        </div>
      `;
      contenedorAfiches.appendChild(item);
    });
  }

  // Filtros y búsquedas
  inputBusqueda.addEventListener('input', function () {
    const busqueda = inputBusqueda.value.toLowerCase();
    const productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
  });

  selectFiltro.addEventListener('change', function () {
    const filtro = selectFiltro.value;
    let productosFiltrados = productos;

    if (filtro) {
      productosFiltrados = productos.filter(producto =>
        producto.categoria && producto.categoria.toLowerCase() === filtro.toLowerCase()
      );
    }

    mostrarProductos(productosFiltrados);
  });

  // Generar PDF
  document.getElementById("generarPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const marginX = 10;
    const marginTop = 20;
    const pageWidth = 200;
    const pageHeight = 297;
    let y = marginTop;

    // Función para dividir texto largo en líneas
    const dividirTexto = (texto, anchoMax) => {
      return doc.splitTextToSize(texto, anchoMax);
    };

    // Título
    doc.setFontSize(22);
    doc.text("Catálogo de Hortalizas", marginX, y);
    y += 10;

    // Encabezados
    doc.setFontSize(14);
    doc.text("Nombre", marginX, y);
    doc.text("Precio", marginX + 60, y);
    doc.text("Descripción", marginX + 120, y);
    y += 10;
    doc.line(marginX, y, pageWidth - marginX, y);

    productos.forEach(producto => {
      if (y + 20 > pageHeight) {
        doc.addPage();
        y = marginTop;

        doc.setFontSize(14);
        doc.text("Nombre", marginX, y);
        doc.text("Precio", marginX + 60, y);
        doc.text("Descripción", marginX + 120, y);
        y += 10;
        doc.line(marginX, y, pageWidth - marginX, y);
      }

      y += 10;
      doc.setFontSize(12);
      doc.text(producto.nombre, marginX, y);
      doc.text(producto.precio, marginX + 60, y);

      // Dividir la descripción y agregar líneas
      const lineasDescripcion = dividirTexto(producto.descripcion, 60); // Ancho máximo ajustado
      lineasDescripcion.forEach(linea => {
        if (y + 10 > pageHeight) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(linea, marginX + 120, y);
        y += 5;
      });
    });

    // Agregar redes sociales, contacto y cuentas bancarias (como antes)
    y += 15;
    doc.setFontSize(14);
    doc.text("Síguenos en nuestras redes sociales:", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Facebook: https://facebook.com", marginX, y);
    y += 5;
    doc.text("TikTok: https://tiktok.com", marginX, y);
    y += 5;
    doc.text("Instagram: https://instagram.com", marginX, y);

    y += 15;
    doc.setFontSize(14);
    doc.text("Contacto y Pedidos:", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Teléfono: +1 (234) 567-890", marginX, y);
    y += 5;
    doc.text("Correo: huerto1@lamolina.edu.pe", marginX, y);

    y += 15;
    doc.setFontSize(14);
    doc.text("Cuentas Bancarias:", marginX, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("BCP: 1910031059026", marginX, y);
    y += 5;
    doc.text("BBVA: 0011-0661-0100058124", marginX, y);
    y += 5;
    doc.text("Scotiabank: 0002430142", marginX, y);
    y += 5;
    doc.text("Nación: 00-000-424544", marginX, y);

    doc.save("catalogo_hortalizas.pdf");
  });

  document.getElementById("modoOscuro").addEventListener("click", function () {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  });
});

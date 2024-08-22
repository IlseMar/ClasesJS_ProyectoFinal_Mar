let productos = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data.espejos;
      renderProducts(productos);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const renderProducts = (arrayProductos) => {
  let containerProducts = document.querySelector(".products-container");
  containerProducts.innerHTML = "";

  arrayProductos.forEach((producto, index) => {
    let productCard = document.createElement("article");
    productCard.className = "producto";
    productCard.innerHTML = `
    <img src="${producto.image}" class="image" alt="${producto.tipoDeDiseño}" />
    <div class="product-info">
      <h3>${producto.tipoDeDiseño}</h3>
      <select class="model-select">
          <option value="marca">Elige tu tamaño</option>
          <option value="chico">Chico</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
      </select>
      <label for="unidades">Unidades:</label>
      <input type="number" min="1" value="1" class="quantity-input" />
      <button onclick="agregarAlCarrito(${producto.id}, ${index})" class="add-cart-btn">Agregar al carrito</button>
    </div>`;

    containerProducts.appendChild(productCard);

    // Event listener para seleccionar el tamaño
    let tamañoSelect = productCard.querySelector(".model-select");
    tamañoSelect.addEventListener("change", (e) => {
      let costoEspejo = elegirTamaño(e.target.value, index);
      producto.costoEspejo = costoEspejo;
      console.log(`Costo del espejo (${e.target.value}): ${costoEspejo}`);
    });
  });
};

const elegirTamaño = (tamañoValue, index) => {
  let costoInicial = productos[index].precioBase;
  let costoTamaño = 0;

  switch (tamañoValue) {
    case "chico":
      costoTamaño = 50;
      break;
    case "mediano":
      costoTamaño = 70;
      break;
    case "grande":
      costoTamaño = 100;
      break;
  }
  return costoInicial + costoTamaño;
};

const agregarAlCarrito = (id, index) => {
  let producto = productos.find((elemento) => elemento.id === id); // Corregido
  let productoEnElCarrito = carrito.find((elemento) => elemento.id === id);
  let unidadesInput = document.querySelectorAll(".quantity-input")[index];
  let cantidad = parseInt(unidadesInput.value, 10);
  let tamañoSelect = document.querySelectorAll(".model-select")[index];
  let tamañoValue = tamañoSelect.value;
  let costoEspejo = producto.costoEspejo || 0;

  if (!isNaN(cantidad) && cantidad > 0 && tamañoValue !== "marca") {
    if (!productoEnElCarrito) {
      let productoCarrito = {
        id: producto.id,
        tipoProducto: producto.tipoDeProducto,
        modelo: tamañoValue,
        unidades: cantidad,
        costoTotal: costoEspejo * cantidad,
        diseño: producto.tipoDeDiseño,
        image: producto.image,
      };
      carrito.push(productoCarrito);
      Swal.fire({
        title: "Tu espejo se agregó exitosamente",
        icon: "success",
        position: "center",
        confirmButtonText: "Aceptar",
        timer: 5000,
      });
    } else {
      productoEnElCarrito.unidades += cantidad;
      productoEnElCarrito.costoTotal += costoEspejo * cantidad; // Corregido
      Swal.fire({
        title: "Hemos sumado uno más a carrito",
        icon: "success",
        position: "center",
        confirmButtonText: "Aceptar",
        timer: 5000,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    Swal.fire({
      title: "Error",
      text: "Por favor, selecciona un tamaño ",
      icon: "error",
      position: "center",
      confirmButtonText: "Aceptar",
      timer: 5000,
    });
  }
};

const irAlCarrito = () => {
  const btnCarrito = document.querySelector(".btnCarrito");
  btnCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "¡Aún no tienes productos en tu carrito!",
        icon: "info",
        position: "center",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } else {
      window.location.href = "./carrito.html";
    }
  });
};
irAlCarrito();

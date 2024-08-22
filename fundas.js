let productos = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data.fundas;
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
        <select class="model-select" data-index="${index}">
            <option value="marca">Elige tu modelo</option>
            <option value="samsung">Samsung</option>
            <option value="huawei">Huawei</option>
            <option value="xiaomi">Xiaomi</option>
            <option value="iphone">iPhone</option>
            <option value="motorola">Motorola</option>
        </select>
        <label for="unidades">Unidades:</label>
        <input type="number" min="1" value="1" class="quantity-input" />
        <button onclick="agregarAlCarrito(${producto.id}, ${index})" class="add-cart-btn">Agregar al carrito</button>
      </div>`;

    containerProducts.appendChild(productCard);

    // Event listener para seleccionar la marca
    let marcaSelect = productCard.querySelector(".model-select");
    marcaSelect.addEventListener("change", (e) => {
      let costoFunda = elegirMarca(e.target.value, index);
      producto.costoFunda = costoFunda;
      console.log(`Costo de la funda (${e.target.value}): ${costoFunda}`);
    });
  });
};

const elegirMarca = (marcaValue, index) => {
  let costoInicial = productos[index].precioBase;
  let costoModelo = 0;

  switch (marcaValue) {
    case "samsung":
      costoModelo = 45;
      break;
    case "huawei":
      costoModelo = 55;
      break;
    case "xiaomi":
      costoModelo = 55;
      break;
    case "iphone":
      costoModelo = 50;
      break;
    case "motorola":
      costoModelo = 40;
      break;
  }
  return costoInicial + costoModelo;
};

const agregarAlCarrito = (id, index) => {
  // Encontrar el producto al cual le dimos click
  let producto = productos.find((elemento) => elemento.id === id);
  let productoEnElCarrito = carrito.find((elemento) => elemento.id === id);
  let unidadesInput = document.querySelectorAll(".quantity-input")[index];
  let cantidad = parseInt(unidadesInput.value, 10);
  let marcaSelect = document.querySelectorAll(".model-select")[index];
  let marcaValue = marcaSelect.value;
  let costoFunda = producto.costoFunda || 0;

  if (!isNaN(cantidad) && cantidad > 0 && marcaValue !== "marca") {
    if (!productoEnElCarrito) {
      let productoCarrito = {
        id: producto.id,
        tipoProducto: producto.tipoDeProducto,
        modelo: marcaValue,
        unidades: cantidad,
        costoTotal: costoFunda * cantidad,
        diseño: producto.tipoDeDiseño,
        image: producto.image,
      };
      carrito.push(productoCarrito);
      Swal.fire({
        title: "Tu funda se agregó exitosamente",
        icon: "success",
        position: "center",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } else {
      productoEnElCarrito.unidades += cantidad;
      productoEnElCarrito.costoTotal += costoFunda * cantidad;
      Swal.fire({
        title: "Hemos sumado una más a carrito",
        icon: "success",
        position: "center",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    Swal.fire({
      title: "Error",
      text: "Por favor, selecciona un modelo",
      icon: "error",
      position: "center",
      confirmButtonText: "Aceptar",
      timer: 5000,
    });
  }
};

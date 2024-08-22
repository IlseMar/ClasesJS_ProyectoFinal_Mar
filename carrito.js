let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {
  const cartItems = JSON.parse(localStorage.getItem("carrito")) || [];

  if (cartItems.length === 0) {
    window.location.href = "fundas.html";
  }
});

const renderProducts = (arrayProductos) => {
  let total = 0;
  let containerCart = document.querySelector(".carrito-container");
  containerCart.innerHTML = "";

  arrayProductos.forEach((producto) => {
    let productCard = document.createElement("div");
    productCard.className = "productoCar";
    productCard.innerHTML = `
      <img src="${producto.image}" class="image" alt="${producto.tipoDeDiseño}" />
      <div class="product-info">
        <h4>${producto.tipoProducto}</h4>
        <p>${producto.modelo}</p>
        <p>${producto.diseño}</p>
        <div class="container-btns">
          <button onclick="restarCantidad(${producto.id})">-</button>
          <p class="price">${producto.unidades}</p>
          <button onclick="sumarCantidad(${producto.id})">+</button>
        </div>
        <h4>$${producto.costoTotal}</h4>
        <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
      </div>`;
    containerCart.appendChild(productCard);

    total += producto.costoTotal;
  });
  let totalElement = document.querySelector("#total");
  totalElement.textContent = "Total: $" + total;
};

renderProducts(carrito);

const eliminarDelCarrito = (id) => {
  Swal.fire({
    title: "¿Deseas eliminar el producto?",
    showDenyButton: true,
    confirmButtonText: "Si, eliminar",
    denyButtonText: `No, no eliminar`,
  }).then((res) => {
    if (res.isConfirmed) {
      carrito = carrito.filter((producto) => producto.id !== id);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderProducts(carrito);
      Swal.fire({
        title: "Se ha eliminado",
        icon: "info",
      });
    } else if (res.isDenied) {
      Swal.fire({
        title: "No se elimina",
        icon: "info",
      });
    }
  });
};

const restarCantidad = (id) => {
  let productoEncontrado = carrito.find((elemento) => elemento.id === id);
  if (productoEncontrado && productoEncontrado.unidades > 1) {
    productoEncontrado.unidades -= 1;
    productoEncontrado.costoTotal =
      productoEncontrado.unidades *
      (productoEncontrado.costoTotal / (productoEncontrado.unidades + 1));
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderProducts(carrito);
    Toastify({
      text: "🥺",
      gravity: "bottom",
      position: "right",
      close: false,
      duration: 1000,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      offset: {
        x: 50,
        y: 10,
      },
    }).showToast();
  } else if (productoEncontrado && productoEncontrado.unidades === 1) {
    eliminarDelCarrito(productoEncontrado.id);
  }
};

const sumarCantidad = (id) => {
  let productoEncontrado = carrito.find((elemento) => elemento.id === id);
  if (productoEncontrado) {
    productoEncontrado.unidades += 1;
    productoEncontrado.costoTotal =
      productoEncontrado.unidades *
      (productoEncontrado.costoTotal / (productoEncontrado.unidades - 1));
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderProducts(carrito);
    Toastify({
      text: "🧡",
      gravity: "bottom",
      position: "right",
      close: false,
      duration: 1000,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        borderadius: "10px",
      },
      offset: {
        x: 50,
        y: 10,
      },
    }).showToast();
  }
};

// const finalizarCompra = () => {
//   let finalizarCompraBtn = document.querySelector("#finalizarCompra");
//   finalizarCompraBtn.addEventListener("click", () => {
//// nuevo HTML con:
//// - lista con productos agregados
//// - suma total
//-formulario de datos (los mismos que "contáctame")
//-simular envio de correo
//-selector de casilla:
//---lista con: paypal/tarjeta/contraentrega
//-boton: finalizar compra
//- ventana emergente:
//---"Compra finalizada"
//---"no. de referencia"
//--- confirmaremos la fecha de entrega a tu correo
//---gracias!
//   });
// };

const borrarTodo = () => {
  let eliminarTodoBtn = document.querySelector("#eliminar-todo");
  eliminarTodoBtn.addEventListener("click", () => {
    Swal.fire({
      title: "¿Deseas eliminar todos los productos?",
      showDenyButton: true,
      confirmButtonText: "Si, eliminar",
      denyButtonText: `No, seguir comprando`,
    }).then((res) => {
      if (res.isConfirmed) {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        Swal.fire({
          title: "Se han eliminado todos los productos",
          icon: "info",
        });

        let carritoContainer = document.querySelector(".carrito-container");
        carritoContainer.innerHTML = "";
        let totalElement = document.querySelector("#total");
        totalElement.textContent = "Total: $0";
        renderProducts(carrito);
      } else if (res.isDenied) {
        Swal.fire({
          title: "No se eliminan",
          icon: "info",
        });
      }
    });
  });
};

borrarTodo();

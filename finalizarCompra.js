let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function cargarResumenCompra() {
  let listaProductos = document.getElementById("listaProductos");
  let sumaTotal = 0;

  listaProductos.innerHTML = "";

  let tituloLista = document.createElement("h2");
  tituloLista.innerText = "Estos son todos tus productos seleccionados";
  listaProductos.appendChild(tituloLista);

  carrito.forEach((producto) => {
    let li = document.createElement("li");
    li.textContent = `Producto: ${producto.tipoProducto} - ${producto.modelo} - ${producto.diseño} - unidades: ${producto.unidades} - Subtotal: $${producto.costoTotal}`;
    listaProductos.appendChild(li);

    sumaTotal += producto.costoTotal;
  });

  document.getElementById("sumaTotal").textContent = sumaTotal.toFixed(2);
}

window.onload = function () {
  cargarResumenCompra();
  let opcionesPago = document.getElementById("formPago");

  let tituloDatos = document.createElement("h2");
  tituloDatos.innerText = "Llena tus datos para tener contacto";
  opcionesPago.appendChild(tituloDatos);

  let nombreUsiario = document.createElement("input");
  nombreUsiario.type = "text";
  nombreUsiario.id = "nombre";
  nombreUsiario.name = "nombre";
  nombreUsiario.placeholder = "Nombre";
  opcionesPago.appendChild(nombreUsiario);

  let emailUsiario = document.createElement("input");
  emailUsiario.type = "email";
  emailUsiario.id = "email";
  emailUsiario.name = "email";
  emailUsiario.placeholder = "Email";
  opcionesPago.appendChild(emailUsiario);

  let tituloMetodoPago = document.createElement("h2");
  tituloMetodoPago.innerText = "Elige tu método de pago";
  opcionesPago.appendChild(tituloMetodoPago);

  let metodosPago = ["Tarjeta de débito/crédito", "Paypal", "Contraentrega"];

  metodosPago.forEach((metodo, index) => {
    let div = document.createElement("div");
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.id = `metodo${index + 1}`;
    radio.name = "metodoPago";
    radio.value = metodo;

    let label = document.createElement("label");
    label.htmlFor = `metodo${index + 1}`;
    label.textContent = metodo;

    div.appendChild(radio);
    div.appendChild(label);
    opcionesPago.appendChild(div);
  });
};

document.getElementById("finalizarCompra").addEventListener("click", () => {
  let metodoSeleccionado = document.querySelector(
    'input[name="metodoPago"]:checked'
  );
  if (!metodoSeleccionado) {
    Swal.fire({
      title: "Por favor, selecciona un método de pago",
      icon: "info",
      timer: 3000,
    });
    return;
  }

  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;

  if (!nombre || !email) {
    Swal.fire({
      title: "Por favor, completa todos los campos.",
      icon: "info",
      timer: 3000,
    });
    return;
  }

  Swal.fire({
    title: `
    ¡Gracias por tu compra, ${nombre}!
    En breve te llegará más información de entrega a ${email}`,
    icon: "success",
    timer: 5000,
    confirmButtonText: "Aceptar",
    didClose: () => {
      window.location.href = "../index.html";
    },
  });

  localStorage.removeItem("carrito");

  document.getElementById("listaProductos").innerHTML = "";
  document.getElementById("sumaTotal").textContent = "0.00";
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  let radios = document.getElementsByName("metodoPago");
  radios.forEach((radio) => (radio.checked = false));
});

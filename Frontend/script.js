var lista = "";
var totalPedido = 0;

function addToOrder() {
    var productSelect = document.getElementById('product-select');
    var quantityInput = document.getElementById('quantity-input');

    var selectedProduct = productSelect.options[productSelect.selectedIndex].text;
    var quantity = parseInt(quantityInput.value);

    if (quantity < 3) {
        alert("La cantidad mínima es 3.");
        return;
    }

    // Obtener el precio del producto seleccionado
    var selectedOption = productSelect.options[productSelect.selectedIndex];
    var precioProducto = parseFloat(selectedOption.value);

    // Calcular el subtotal del producto
    var subtotal = precioProducto * quantity;

    // Ajustamos el formato de la cadena
    lista += `Producto: ${selectedProduct}, Cantidad: ${quantity}\n`;

    // Actualizar el total del pedido
    totalPedido += subtotal;

    console.log(lista);

    quantityInput.value = 3;

    rpedido.disabled = lista === "";

    updateOrderTable(selectedProduct, quantity, precioProducto, subtotal);
}

function updateOrderTable(producto, cantidad, precio, subtotal) {
    var orderTable = document.getElementById('order-table');
    var orderBody = orderTable.getElementsByTagName('tbody')[0];

    // Crear fila de la tabla
    var row = orderBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.textContent = producto;
    cell2.textContent = cantidad;
    cell3.textContent = `$${precio.toFixed(2)}`;
    cell4.textContent = `$${subtotal.toFixed(2)}`;
}

function sendToDatabase() {
    if (lista.trim() === "") {
        alert("Agrega productos al pedido antes de realizarlo.");
        return;
    }

    const nr = Math.floor(Math.random() * 2) + 1;
    const idRepartidor = nr;

    // Calcula el total del pedido
    const totalPedido = calcularTotalPedido();

    // Agrega el total a la variable lista
    lista += `\nTOTAL: $${totalPedido.toFixed(2)}`;

    console.log(lista);

    fetch('http://localhost:3000/guardarPedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lista, idRepartidor }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Pedido guardado exitosamente:', data);
            clearTable(); 
            showAlert('¡Pedido registrado exitosamente!');
        })
        .catch(error => console.error('Error al guardar pedido:', error));
}

function clearTable() {
    var orderBody = document.getElementById('order-body');
    orderBody.innerHTML = '';
    rpedido.disabled = true;
    lista = ""; 
    totalPedido = 0; 
}

function showAlert(message) {
    alert(message);
}


//BASE DE DATOS  =================
function cargarDatos() {
    const productSelect = document.getElementById('product-select');
    const precioProducto = document.getElementById('precio-producto');

    fetch('http://localhost:3000/productos') 
      .then(response => response.json())
      .then(data => {
        console.log('Datos obtenidos:', data);
        data.forEach(producto => {
            const option = document.createElement('option');
            option.textContent = producto.descripcion;
            option.value = producto.precio; 
            productSelect.appendChild(option);
        });
        // Llenar las tarjetas con los datos de los productos recibidos
        data.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${producto.imagen}.png" alt="${producto.descripcion}">
                <p class="descripcion">${producto.descripcion}</p>
                <p class="precio">Precio: $${producto.precio}</p>
            `;
            document.getElementById('catalog').appendChild(card);})
        

      })
      .catch(error => console.error('Error al obtener datos:', error));
      productSelect.addEventListener('change', function () {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        precioProducto.textContent = 'Precio: $' + selectedOption.value;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    cargarDatos(); 
  });
  function sendToDatabase() {
    // Verificar si hay productos en la lista
    if (lista.trim() === "") {
        alert("Agrega productos al pedido antes de realizarlo.");
        return;
    }

    // Obtener el ID del repartidor (ajusta según tu lógica)
    const idRepartidor = 1;

    // Hacer una solicitud POST al servidor para guardar el pedido
    fetch('http://localhost:3000/guardarPedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lista, idRepartidor }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Pedido guardado exitosamente:', data);
            clearTable(); // Limpiar la tabla después de guardar el pedido
            showAlert('¡Pedido registrado exitosamente!');
        })
        .catch(error => console.error('Error al guardar pedido:', error));
}

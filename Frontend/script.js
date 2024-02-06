var lista = "";

function addToOrder() {
    var productSelect = document.getElementById('product-select');
    var quantityInput = document.getElementById('quantity-input');

    var selectedProduct = productSelect.options[productSelect.selectedIndex].text;
    var quantity = parseInt(quantityInput.value);

    if (quantity < 3) {
        alert("La cantidad mínima es 3.");
        return;
    }
    var producto = selectedProduct;
    var cantidad = quantity;
    
    lista += "Producto: " + selectedProduct + " Cantidad: " + quantity + "\n";

    console.log(lista)

    quantityInput.value = 3;

    rpedido.disabled = lista === "";

    updateOrderTable(producto, cantidad);
}

function updateOrderTable(producto, cantidad) {
    var orderTable = document.getElementById('order-table');
    var orderBody = orderTable.getElementsByTagName('tbody')[0];

    // Crear fila de la tabla
    var row = orderBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.textContent = producto;
    cell2.textContent = cantidad; 
}
function sendToDatabase() {
    console.log('Enviando a la base de datos:', lista);
    clearTable();
    showAlert('¡Pedido registrado exitosamente!');
}

function clearTable() {
    var orderBody = document.getElementById('order-body');
    orderBody.innerHTML = '';
    rpedido.disabled = true;
 
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
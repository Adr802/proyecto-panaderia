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

    // Buscar si el producto ya está en la lista
    var orderRows = document.getElementById('order-body').getElementsByTagName('tr');
    var productIndex = -1;
    for (var i = 0; i < orderRows.length; i++) {
        var cells = orderRows[i].getElementsByTagName('td');
        if (cells[0].textContent === selectedProduct) {
            productIndex = i;
            break;
        }
    }

    if (productIndex !== -1) {
        // Si el producto ya está en la lista, actualizar la cantidad y el subtotal
        var cells = orderRows[productIndex].getElementsByTagName('td');
        var currentQuantity = parseInt(cells[1].textContent);
        var newQuantity = currentQuantity + quantity;
        var newSubtotal = precioProducto * newQuantity;
        cells[1].textContent = newQuantity;
        cells[3].textContent = `$${newSubtotal.toFixed(2)}`;
    } else {
        // Si el producto no está en la lista, agregarlo como un nuevo elemento
        updateOrderTable(selectedProduct, quantity, precioProducto, subtotal);
    }

    // Actualizar la variable lista
    lista = buildListaFromTable();
    console.log(lista);

    // Actualizar el total del pedido
    totalPedido = calcularTotalPedido();
    rpedido.disabled = lista.trim() === "";
}
function buildListaFromTable() {
    var orderRows = document.getElementById('order-body').getElementsByTagName('tr');
    var lista = "";
    for (var i = 0; i < orderRows.length; i++) {
        var cells = orderRows[i].getElementsByTagName('td');
        var productName = cells[0].textContent;
        var quantity = parseInt(cells[1].textContent);
        lista += `<p>Producto: ${productName} - Cantidad: ${quantity}<br></p>`;
    }
    return lista;
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

    console.log(idRepartidor)
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
    const catalogDiv = document.getElementById('catalog');
    const categorySelect = document.getElementById('categoria-select');
    const categoryId = categorySelect.selectedIndex;
    const productSelect = document.getElementById('product-select');
    productSelect.innerHTML= "";
    // URL base para obtener productos
    let url = 'http://localhost:3000/productos';

    // Si hay una categoría seleccionada, agregarla como parámetro a la URL
    if (categoryId != 0) {
        url += `?categoria=${categoryId}`;
    }

    // Realizar la solicitud GET para obtener productos
    fetch(url)
        .then(response => response.json())
        .then(data => {
            catalogDiv.innerHTML = ''; // Limpiar el contenido actual
            console.log(data)
            data.forEach(producto => {
                const option = document.createElement('option');
                option.textContent = producto.descripcion;
                option.value = producto.precio; 
                productSelect.appendChild(option);
            });
            // Llenar el catálogo con los productos obtenidos
            data.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${producto.imagen}.png" alt="${producto.descripcion}">
                    <p class="descripcion">${producto.descripcion}</p>
                    <p class="precio">Precio: $${producto.precio}</p>
                `;
                catalogDiv.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}



function calcularTotalPedido() {
    // Recorremos las filas de la tabla para obtener los subtotales
    var orderTable = document.getElementById('order-table');
    var orderBody = orderTable.getElementsByTagName('tbody')[0];
    var rows = orderBody.getElementsByTagName('tr');
    var total = 0;

    // Iteramos sobre las filas de la tabla
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
        
        // Obtenemos el valor del subtotal de la última celda
        var subtotal = parseFloat(cells[3].textContent.slice(1)); // Eliminamos el signo de dólar y convertimos a número
        total += subtotal; // Sumamos al total
    }

    return total;
}
document.addEventListener('DOMContentLoaded', function () {
    cargarDatos(); 
    document.getElementById('categoria-select').addEventListener('change', cargarDatos);
});

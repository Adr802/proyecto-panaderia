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


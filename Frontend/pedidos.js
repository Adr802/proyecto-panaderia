document.addEventListener('DOMContentLoaded', function () {
    cargarPedidos();
  });
async function cargarPedidos() {
    try {
        const tableBody = document.querySelector('#pedidos-table tbody');
        const response = await fetch('http://localhost:3000/pedidos'); 
        const data = await response.json();
        
        console.log(data)
        // Limpia el contenido actual de la tabla
        tableBody.innerHTML = '';

        // Llena la tabla con los datos de los pedidos recibidos
        data.forEach(pedido => {
            const row = tableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.innerHTML = pedido.productos;
            cell2.textContent = pedido.nombre;
            cell3.textContent = pedido.estado;
        });
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}
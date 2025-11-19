async function loadRestaurants() {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/restaurants`);
    
    const restaurants = await response.json();
    console.log('Restaurantes cargados:', restaurants);
    return restaurants;
  } catch (error) {
    console.error('Error al cargar restaurantes:', error);
  } 
}

// Cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  loadRestaurants().then((data) => {
    showData(data);
  });
});

function showData (restaurants) {
// Mostrar datos en el DOM
    const tableBody = document.getElementById('restaurants-tbody');
    tableBody.innerHTML = '';
    
    restaurants.forEach(restaurant => {
      const row = `
        <tr>
          <td>${restaurant.id}</td>
          <td>${restaurant.name}</td>
          <td>${restaurant.address}</td>
          <td>${restaurant.status}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="viewDevices(${restaurant.id}, '${restaurant.name}')" title="Ver dispositivos">
              <i class="fas fa-mobile-alt"></i> Dispositivos
            </button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
}

async function loadRestaurantDevices(restaurantId) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/restaurants/${restaurantId}/restaurant_devices`);
    const restaurantDevices = await response.json();
    console.log(`Dispositivos del restaurante ${restaurantId}:`, restaurantDevices);
    return restaurantDevices;
  } catch (error) {
    console.error(`Error al cargar dispositivos del restaurante ${restaurantId}:`, error);
  } 
}

async function viewDevices(restaurantId, restaurantName) {
  // Actualizar el título del modal
  document.getElementById('devicesModalLabel').textContent = `Dispositivos - ${restaurantName}`;
  
  // Mostrar loading en el modal
  const devicesTableBody = document.getElementById('devices-tbody');
  devicesTableBody.innerHTML = '<tr><td colspan="4" class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando dispositivos...</td></tr>';
  
  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('devicesModal'));
  modal.show();
  
  try {
    const restaurantDevices = await loadRestaurantDevices(restaurantId);

    // Limpiar la tabla
    devicesTableBody.innerHTML = '';
    
    if (!restaurantDevices || restaurantDevices.length === 0) {
      devicesTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay dispositivos registrados</td></tr>';
      return;
    }
    
    // Poblar la tabla con los dispositivos
    restaurantDevices.forEach(restaurant_device => {
      const row = `
        <tr>
          <td>${restaurant_device.id}</td>
          <td>${restaurant_device.device.name || 'N/A'}</td>
          <td>${restaurant_device.device.device_types || 'N/A'}</td>
          <td>
            <span class="badge ${restaurant_device.status === 'active' ? 'bg-success' : 'bg-secondary'}">
              ${restaurant_device.status || 'N/A'}
            </span>
          </td>
        </tr>
      `;
      devicesTableBody.innerHTML += row;
    });
    
  } catch (error) {
    devicesTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar dispositivos</td></tr>';
  }
}
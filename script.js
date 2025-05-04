function calcularTiempo() {
  const ahora = new Date();
  const aperturaLondres = new Date();
  aperturaLondres.setUTCHours(8, 0, 0, 0); // 08:00 GMT

  if (ahora > aperturaLondres) {
    aperturaLondres.setUTCDate(aperturaLondres.getUTCDate() + 1);
  }

  const diferencia = aperturaLondres - ahora;
  const horas = Math.floor(diferencia / 1000 / 60 / 60);
  const minutos = Math.floor((diferencia / 1000 / 60) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  document.getElementById('countdown').textContent =
    `${horas}h ${minutos}m ${segundos}s`;

  setTimeout(calcularTiempo, 1000);
}

window.onload = calcularTiempo;

// Tu API Key de Alpha Vantage
const apiKey = 'TU_API_KEY';  // Reemplaza con tu propia API Key

// Función para obtener los datos históricos de EUR/USD
function obtenerDatosHistoricos() {
  const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data['Time Series FX (5min)']) {
        const tiempo = Object.keys(data['Time Series FX (5min)']);
        const precios = tiempo.map(tiempo => data['Time Series FX (5min)'][tiempo]);

        // Calcular el rango asiático
        let maxPrice = -Infinity;
        let minPrice = Infinity;

        for (let i = 0; i < precios.length; i++) {
          // Usamos solo los datos entre las 00:00 y 05:00 GMT
          const hora = new Date(tiempo[i]).getUTCHours();
          if (hora >= 0 && hora < 5) {
            const precioApertura = parseFloat(precios[i]['1. open']);
            maxPrice = Math.max(maxPrice, precioApertura);
            minPrice = Math.min(minPrice, precioApertura);
          }
        }

        // Mostrar el rango asiático
        console.log('Rango Asiático:');
        console.log('Máximo: ' + maxPrice);
        console.log('Mínimo: ' + minPrice);

        // Puedes usar estos valores para dibujar en el gráfico de TradingView o mostrarlos en pantalla
      }
    })
    .catch(error => console.error('Error obteniendo los datos:', error));
}

// Llamar a la función para obtener los datos al cargar la página
window.onload = obtenerDatosHistoricos;

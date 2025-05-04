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
const apiKey = C4861DKPF23S9H39;  // Reemplaza con tu propia API Key

// Función para obtener los datos históricos de EUR/USD
function obtenerDatosHistoricos() {
  const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data['Time Series FX (5min)']) {
        const tiempo = Object.keys(data['Time Series FX (5min)']);
        const precios = tiempo.map(tiempo => data['Time Series FX (5min)'][tiempo]);

        // Calcular el rango de Londres
        let maxPrice = -Infinity;
        let minPrice = Infinity;

        for (let i = 0; i < precios.length; i++) {
          // Usamos solo los datos entre las 08:00 y 17:00 GMT
          const hora = new Date(tiempo[i]).getUTCHours();
          if (hora >= 8 && hora < 17) {
            const precioApertura = parseFloat(precios[i]['1. open']);
            maxPrice = Math.max(maxPrice, precioApertura);
            minPrice = Math.min(minPrice, precioApertura);
          }
        }

        // Mostrar el rango de Londres en consola
        console.log('Rango de Londres:');
        console.log('Máximo: ' + maxPrice);
        console.log('Mínimo: ' + minPrice);

        // Aquí es donde almacenamos estos valores en la base de datos
        guardarEnBaseDeDatos(maxPrice, minPrice);
      }
    })
    .catch(error => console.error('Error obteniendo los datos:', error));
}

// Llamar a la función para obtener los datos al cargar la página
window.onload = obtenerDatosHistoricos;

const apiKey = "TU_API_KEY"; // Reemplaza con tu API Key de Twelve Data
const url = `https://api.twelvedata.com/time_series?symbol=EUR/USD&interval=1min&start_date=2025-05-02 08:00:00&end_date=2025-05-02 09:00:00&apikey=${apiKey}`;

async function obtenerRangoLondres() {
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const velas = datos.values;

    if (!velas || velas.length === 0) throw new Error("No se encontraron datos.");

    let max = parseFloat(velas[0].high);
    let min = parseFloat(velas[0].low);

    for (let vela of velas) {
      const high = parseFloat(vela.high);
      const low = parseFloat(vela.low);
      if (high > max) max = high;
      if (low < min) min = low;
    }

    document.getElementById("max").textContent = max.toFixed(5);
    document.getElementById("min").textContent = min.toFixed(5);
  } catch (error) {
    console.error("Error al obtener el rango de Londres:", error);
  }
}

obtenerRangoLondres();


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

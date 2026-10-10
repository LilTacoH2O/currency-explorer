// ============================================================
// CURRENCY EXPLORER · STARTER PROJECT
// Archivo principal de trabajo para las misiones de JavaScript
// ============================================================

// 1. REFERENCIAS AL DOM
const cantidad = document.querySelector("#cantidad");
const origen = document.querySelector("#origen");
const destino = document.querySelector("#destino");
const btnConvertir = document.querySelector("#convertir");
const btnIntercambiar = document.querySelector("#intercambiar");
const resultado = document.querySelector("#resultado");
const resultadoTexto = document.querySelector("#resultadoTexto");
const detalleTasa = document.querySelector("#detalleTasa");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

  const valor = Number(cantidad.value);

  // TODO · MISIÓN 07: sustituir esta validación mínima por una validación completa.
  if (!Number.isFinite(valor) || valor <= 0) {
    mostrarError("Escribe una cantidad mayor que cero.");
    return;
  }
  // MISIÓN 04: leer las monedas elegidas por el usuario en los <select>
  // (antes estaban escritas a mano como "EUR" y "USD")
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;


  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // TODO · MISIÓN 08: activar un estado visual de carga antes de consultar.
    const respuesta = await fetch(url);

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();

    // MISIÓN 05 (zona 3): el cálculo lo hace la app; rate y date vienen de la API
    const conversion = valor * datos.rate;
 
    resultado.classList.remove("error");
    resultadoTexto.textContent =
      `${formatearImporte(valor)} ${monedaOrigen} = ${formatearImporte(conversion)} ${monedaDestino}`;
    detalleTasa.textContent =
      `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · ${datos.date}`;
      
  } catch (error) {
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
  }
}

// MISIÓN 06: invierte origen y destino y vuelve a calcular
function intercambiarMonedas() {
  const temporal = origen.value;  // 1) guardamos el origen para no perderlo
  origen.value = destino.value;   // 2) el destino pasa a ser origen...
  destino.value = temporal;       //    ...y el origen guardado pasa a destino
  convertirMoneda();              // 3) recalcula con el par invertido
}


// 4. UTILIDADES DE INTERFAZ
function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}
// MISIÓN 05 (zona 4): da formato de importe con 2 decimales y separador de miles
function formatearImporte(numero) {
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 2, // siempre al menos 2 decimales
    maximumFractionDigits: 2  // nunca más de 2 decimales
  });
}

// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM

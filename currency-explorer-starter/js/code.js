// ============================================================
// CURRENCY EXPLORER · Conversor de divisas con Frankfurter API
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

// MISIÓN 11: elementos del histórico
const btnHistorico = document.querySelector("#historico");
const graficaBox = document.querySelector("#graficaBox");
const graficaTitulo = document.querySelector("#graficaTitulo");
const grafica = document.querySelector("#grafica");

// 2. EVENTOS (se pasa la función SIN paréntesis: el navegador la ejecuta al hacer clic)
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);
btnHistorico.addEventListener("click", mostrarHistorico); // Misión 11

// 3. FUNCIONES DE LA APLICACIÓN
async function convertirMoneda() {
  // MISIÓN 07: validación completa ANTES de llamar a la API
  const texto = cantidad.value.trim(); // el input entrega texto
  const valor = Number(texto);         // lo convertimos a número

  // Se revisa primero el vacío porque Number("") devuelve 0
  if (texto === "") { mostrarError("Escribe una cantidad para convertir."); return; }
  // isFinite descarta NaN e Infinity
  if (!Number.isFinite(valor)) { mostrarError("La cantidad no es un número válido."); return; }
  if (valor <= 0) { mostrarError("La cantidad debe ser mayor que cero."); return; }

  // MISIÓN 04: monedas elegidas por el usuario
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  // Misma moneda en ambos lados no tiene sentido convertir
  if (monedaOrigen === monedaDestino) {
    mostrarError("Elige monedas distintas para convertir.");
    return;
  }

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // MISIÓN 08: va DESPUÉS de las validaciones, para que un error
    // de validación no deje la app bloqueada
    establecerCarga(true);
    const respuesta = await fetch(url);

    // MISIÓN 09: fetch NO lanza error con 404/500, hay que revisar response.ok
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json(); // convierte el cuerpo en objeto JS

    // Comprobamos que la API devolvió una tasa numérica
    if (typeof datos.rate !== "number") {
      throw new Error("La respuesta no contiene una tasa válida");
    }

    // MISIÓN 05: el cálculo lo hace la app; rate y date vienen de la API
    const conversion = valor * datos.rate;

    resultado.classList.remove("error");
    resultadoTexto.textContent =
      `${formatearImporte(valor)} ${monedaOrigen} = ${formatearImporte(conversion)} ${monedaDestino}`;
    detalleTasa.textContent =
      `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · ${datos.date}`;

  } catch (error) {
    console.error(error);
    // fetch lanza TypeError cuando no hay conexión de red
    if (error instanceof TypeError) {
      mostrarError("No hay conexión con el servicio.", "Revisa tu internet e inténtalo de nuevo.");
    } else {
      // errores HTTP o respuesta inválida
      mostrarError("El servicio no pudo responder esta consulta.", "Intenta de nuevo en unos minutos.");
    }
  } finally {
    // MISIÓN 08: se ejecuta con éxito o con error, siempre rehabilita los botones
    establecerCarga(false);
  }
}

// MISIÓN 06: invierte origen y destino y vuelve a calcular
function intercambiarMonedas() {
  const temporal = origen.value;  // 1) guardamos el origen para no perderlo
  origen.value = destino.value;   // 2) el destino pasa a ser origen...
  destino.value = temporal;       //    ...y el origen guardado pasa a destino
  convertirMoneda();              // 3) recalcula con el par invertido
}

// MISIÓN 11: consulta la serie temporal y separa fechas y tasas en dos arreglos
async function cargarHistorico(base, moneda) {
  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${moneda}&from=2026-01-01&group=month`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  // La respuesta debe ser un arreglo de registros
  if (!Array.isArray(datos) || datos.length === 0) {
    throw new Error("La respuesta no contiene datos históricos");
  }

  // Ajusten los nombres date y rate según lo que vieron en la consola
  const fechas = datos.map(item => item.date);
  const tasas = datos.map(item => item.rate);

  return { fechas, tasas };
}

// MISIÓN 11: coordina la consulta del histórico y dibuja la gráfica
async function mostrarHistorico() {
  const base = origen.value;
  const moneda = destino.value;

  if (base === moneda) {
    mostrarError("Elige monedas distintas para ver el histórico.");
    return;
  }

  try {
    btnHistorico.disabled = true;
    btnHistorico.textContent = "Cargando...";

    const { fechas, tasas } = await cargarHistorico(base, moneda);

    graficaTitulo.textContent = `${base} → ${moneda}`;
    graficaBox.hidden = false;      // mostrar la caja antes de dibujar
    dibujarGrafica(fechas, tasas);
  } catch (error) {
    console.error(error);
    mostrarError("No se pudo cargar el histórico.", "Intenta de nuevo en unos minutos.");
  } finally {
    btnHistorico.disabled = false;  // siempre se rehabilita
    btnHistorico.textContent = "Ver histórico";
  }
}

// 4. UTILIDADES DE INTERFAZ
// MISIÓN 09: el detalle es opcional, con un valor por defecto
function mostrarError(mensaje, detalle = "Revisa los datos e inténtalo nuevamente.") {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = detalle;
}

// MISIÓN 05: da formato de importe con 2 decimales y separador de miles
function formatearImporte(numero) {
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 2, // siempre al menos 2 decimales
    maximumFractionDigits: 2  // nunca más de 2 decimales
  });
}

// MISIÓN 08: activa o desactiva el estado de carga
function establecerCarga(cargando) {
  btnConvertir.disabled = cargando;     // evita clics repetidos
  btnIntercambiar.disabled = cargando;
  btnConvertir.textContent = cargando ? "Consultando..." : "Convertir";

  if (cargando) {
    resultado.classList.remove("error");
    resultadoTexto.textContent = "Consultando...";
    detalleTasa.textContent = "Esperando respuesta de la API.";
  }
}

// MISIÓN 11: dibuja una gráfica de línea en el <canvas>, sin librerías
function dibujarGrafica(fechas, tasas) {
  const ctx = grafica.getContext("2d");
  const W = grafica.width;
  const H = grafica.height;
  const m = { top: 20, right: 20, bottom: 40, left: 70 }; // márgenes
  ctx.clearRect(0, 0, W, H);

  const min = Math.min(...tasas);
  const max = Math.max(...tasas);
  const rango = (max - min) || 1; // evita dividir entre 0

  // convierten un índice o una tasa en coordenadas del canvas
  const x = i => m.left + (tasas.length === 1 ? 0 : i * (W - m.left - m.right) / (tasas.length - 1));
  const y = v => H - m.bottom - ((v - min) / rango) * (H - m.top - m.bottom);

  // ejes
  ctx.strokeStyle = "#d7e2e8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m.left, m.top);
  ctx.lineTo(m.left, H - m.bottom);
  ctx.lineTo(W - m.right, H - m.bottom);
  ctx.stroke();

  // etiquetas: eje Y (máximo y mínimo) y eje X (mes de cada fecha)
  ctx.fillStyle = "#667785";
  ctx.font = "12px Calibri, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(max.toFixed(4), m.left - 8, m.top + 4);
  ctx.fillText(min.toFixed(4), m.left - 8, H - m.bottom);
  ctx.textAlign = "center";
  fechas.forEach((f, i) => ctx.fillText(f.slice(0, 7), x(i), H - m.bottom + 18));

  // línea de tasas
  ctx.strokeStyle = "#16758B";
  ctx.lineWidth = 3;
  ctx.beginPath();
  tasas.forEach((t, i) => (i === 0 ? ctx.moveTo(x(i), y(t)) : ctx.lineTo(x(i), y(t))));
  ctx.stroke();

  // puntos
  ctx.fillStyle = "#17324D";
  tasas.forEach((t, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(t), 4, 0, Math.PI * 2);
    ctx.fill();
  });
}
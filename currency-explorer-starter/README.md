# Currency Explorer · Starter Project

## Integrantes
- Estudiante A: Martinez Flores Javier Alexander
- Estudiante B: Hernandez Lopez Clara Paulina

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 04 |Javier |Clara | Misión 04: monedas dinámicas con selectores — Driver: Javier / Navigator: Clara |
| 05 |Clara |Javier | Misión 05: conversión completa con formato de importes — Driver: Clara / Navigator: Javier |
| 06 | Javier|Clara | Misión 06: intercambio de monedas y recálculo — Driver: Javier / Navigator: Clara |
| 07 |Clara |Javier | Misión 07: validación completa de cantidad y monedas — Driver: Clara / Navigator: Javier |
| 08 | Javier|Clara | Misión 08: estado de carga y botones deshabilitados — Driver: Javier / Navigator: Clara |
| 09 | Clara|Javier |Misión 09: manejo de errores con response.ok y try/catch — Driver: Clara / Navigator: Javier |
| 10 | Javier|Clara | Misión 10: estados visuales y diseño responsive — Driver: Javier / Navigator: Clara |
| 11 | Clara|Javier |Misión 11: histórico de tasas y gráfica — Driver: Clara / Navigator: Javier |

## Objetivo
Completar una aplicación frontend que consuma Frankfurter API para convertir divisas y demostrar comprensión de eventos, DOM, `fetch()`, JSON, asincronía, validación y manejo de errores.

## Ejecución
1. Descomprime el proyecto.
2. Abre la carpeta en VS Code.
3. Ejecuta `index.html` con Live Server o un servidor local equivalente.
4. Abre DevTools → Console y Network para observar el comportamiento.

## API
Endpoint de referencia:
`https://api.frankfurter.dev/v2/rate/{origen}/{destino}`
## Funcionalidades
- Selección dinámica de moneda origen y destino.
- Conversión con tipo de cambio real y resultado con 2 decimales y separador de miles.
- Botón ⇄ para intercambiar monedas con recálculo automático.
- Validación de cantidad (vacía, cero, negativa, no numérica) y de monedas iguales.
- Estado de carga: "Consultando..." con botones deshabilitados.
- Manejo de errores de red y de respuesta HTTP, con mensajes distintos.
- Diseño responsive (escritorio y móvil).
 


## Decisiones técnicas
1. Usamos finally para rehabilitar los botones. Así, aunque falle la red o la API responda con error, establecerCarga(false) siempre se ejecuta y la aplicación no se queda bloqueada en "Consultando...".
2. Validamos la cantidad y las monedas antes de llamar a la API. Un campo vacío, cero, negativo o dos monedas iguales no generan petición, así evitamos consultas inútiles y resultados absurdos. El campo vacío se revisa antes de Number() porque Number("") devuelve 0.
3. Usamos una variable temporal en el intercambio ⇄. Sin ella, al hacer origen.value = destino.value se pierde el valor original y ambos selectores quedan iguales.
4. Separamos responsabilidades en funciones. convertirMoneda() coordina; mostrarError(), establecerCarga() y formatearImporte() solo se encargan de la interfaz y el formato, lo que facilita probar y modificar el código.
## Evidencias de la práctica

[Ver evidencias completas (PDF)](Practica_evidencias.pdf)

## Revisión cruzada
- Aspecto bien resuelto: el botón ⇄ invierte las monedas y recalcula el resultado con un solo clic, y la app se recupera correctamente tras un error de red (los botones se rehabilitan gracias a finally).
- Error o comportamiento mejorable: Number("") devuelve 0, así que un campo vacío se convertía sin avisar; además, con la misma moneda en origen y destino la app consultaba un par absurdo.
- Propuesta de mejora: validar el campo vacío antes de convertir a número, bloquear monedas iguales, y activar el estado de carga solo después de las validaciones.
- Cambio incorporado después de la revisión: Misión 07 (validación en pasos: vacío → número válido → mayor que cero → monedas distintas) y establecerCarga(true) colocado después de las validaciones en la Misión 08.

## Reflexión final (150–200 palabras)
Explica el principal aprendizaje técnico, una dificultad relevante y una decisión que haya surgido del trabajo Driver/Navigator.
Durante este caso práctico comprendimos el recorrido completo de los datos: el clic dispara convertirMoneda(), que valida la cantidad, construye la URL con los valores de los selectores, usa await para esperar la respuesta de fetch(), convierte el cuerpo con json() y actualiza el DOM con textContent. También entendimos que response.ok y response.json() son pasos distintos: fetch no lanza error con un 404 o un 500, así que hay que revisar el estado antes de leer los datos.
 
La mayor dificultad fue que Number("") devuelve 0, por lo que un campo vacío se convertía sin avisar. La resolvimos revisando el texto vacío antes de convertirlo a número y separando un mensaje para cada caso.
 
Una decisión importante surgió cuando Clara, como Navigator, observó que establecerCarga(true) debía ir después de las validaciones y que los botones podían quedar bloqueados tras un error. Esto nos llevó a usar finally para rehabilitarlos siempre. Si cambiáramos de API conservaríamos eventos, validación, cálculo y manejo de errores, y solo ajustaríamos la URL y los nombres de las propiedades del JSON.


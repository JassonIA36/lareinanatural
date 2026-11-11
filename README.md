# La Reina – Bienestar natural

Página web de La Reina: catálogo de productos de la colmena con carrito de compras y pedido por WhatsApp.

- Miel de Abeja Orgánica
- Jalea Real Vitaminada
- Polen Fermentado
- Extracto de Marañón
- Extracto de Moringa
- Combo Colmena

El cliente elige los productos y las cantidades, llena sus datos de entrega y toca **"Enviar pedido por WhatsApp"**. Se abre el chat con el pedido ya escrito (productos, cantidades, total y dirección).

La página es estática: no necesita base de datos ni instalar nada. Se puede abrir directamente haciendo doble clic en `index.html`.

## Contenido de la carpeta

```
├── index.html            ← el contenido de la página (textos, productos, precios)
├── css/estilos.css       ← colores, tipografías y diseño
├── js/carrito.js         ← carrito de compras, formulario y mensaje de WhatsApp
├── js/animaciones.js     ← aparición de elementos al hacer scroll
├── img/                  ← fotos de los productos, logo y la abeja
├── favicon.png           ← icono de la pestaña del navegador
├── apple-touch-icon.png  ← icono para iPhone
├── robots.txt            ← indicaciones para Google
└── sitemap.xml           ← mapa del sitio para Google
```

## Cómo cambiar lo más común

### Precios
En `index.html`, cada producto es un bloque `<article class="rv card ..." data-precio="30000" ...>`. Para cambiar un precio hay que modificar **dos** lugares dentro de ese bloque:

1. `data-precio="30000"` (número sin puntos; con este valor se calcula el total del carrito).
2. El texto visible `$ 30.000`.

Si cambian los precios, conviene actualizarlos también en los datos para Google (bloque `application/ld+json` en el `<head>`, campo `"price"`).

### Número de WhatsApp
Está como `573134040401` (313 404 0401). Hay que cambiarlo en:

- `index.html` (los enlaces `https://wa.me/573134040401...` y el texto del pie de página).
- `js/carrito.js` (la constante `WA` en la primera línea).
- Los datos para Google en `index.html` (`telephone`).

Las fotos de los productos también muestran el número en la etiqueta; si cambia, hay que rehacer esas imágenes.

### Textos y beneficios
Se editan directamente en `index.html`. Se recomienda mantener un lenguaje suave ("apoya", "contribuye") y no prometer curas ni tratamientos médicos, porque son suplementos y no reemplazan un tratamiento formulado por un médico.

### Mapa de Google y dirección
En la sección "Ubicación" de `index.html` hay un recuadro de ejemplo (`<div class="mapa rv">`). Para reemplazarlo:

1. Abrir Google Maps y buscar el negocio.
2. Compartir → **Insertar un mapa** → copiar el código `<iframe ...>`.
3. Pegarlo en lugar del recuadro, con `width="100%"`, `height="100%"`, `style="border:0;border-radius:22px"` y `loading="lazy"`.
4. Escribir la dirección real en el texto de esa sección y poner el enlace de Google Maps en el botón "Cómo llegar".

## Publicar la página

Se puede publicar gratis en **Cloudflare Pages**:

1. Entrar a Cloudflare → *Workers & Pages* → *Crear* → *Pages* → *Subir archivos*.
2. Subir **toda esta carpeta**.
3. Cuando el dominio esté listo, conectarlo en *Dominios personalizados*.

### Después de definir el dominio
Reemplazar `https://DOMINIO-PENDIENTE.com` por el dominio real en:

- `index.html` (etiquetas del `<head>` y datos para Google)
- `robots.txt`
- `sitemap.xml`

### Aparecer en Google (Search Console)
1. Entrar a <https://search.google.com/search-console> y agregar el dominio.
2. Elegir verificación por **etiqueta HTML** y copiar el código que entrega.
3. Pegarlo en `index.html`, en el bloque comentado `google-site-verification` del `<head>` (quitando los signos de comentario).
4. Publicar de nuevo y, en Search Console → *Sitemaps*, enviar `sitemap.xml`.

## Notas técnicas

- Fotos de productos: archivos WebP con fondo transparente en `img/`. Si se agregan nuevas, comprimirlas a WebP de máximo ~600 px de alto.
- Probada para verse bien en celular (390 px de ancho) y en computador.
- El carrito se guarda en el navegador del cliente (no en un servidor); máximo 20 unidades por producto.
- La abeja de la portada está en tres capas (`abeja-cuerpo`, `abeja-ala-izq`, `abeja-ala-der`) para animar el aleteo. Se desactiva automáticamente si el usuario tiene activada la opción "reducir movimiento".

const API_PRODUCTOS = "https://dummyjson.com/products";




function crearElemento(tag, clase) {
    let nodo = document.createElement(tag);
    if (clase) {
        nodo.classList.add(clase);
    }
    return nodo;
}


function crearNodoConTexto(tag, texto, clase) {
    let nodo = crearElemento(tag, clase);
    nodo.textContent = texto;
    return nodo;
}

function adicionarElementoABody(elemento) {
    document.body.appendChild(elemento);
}

function adicionarElementoAContenedor(elemento, contenedor) {
    contenedor.appendChild(elemento);
}


function crearImagenFondo(src, alt, clase) {
    let nodo = crearElemento('div', clase);
    nodo.style.backgroundImage = `url("${String(src).replace(/"/g, "%22")}")`;
    nodo.setAttribute('role', 'img');
    nodo.setAttribute('aria-label', alt);
    return nodo;
}


function consultarProductos(limite) {
    return fetch(`${API_PRODUCTOS}?limit=${limite}`)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then(datos => datos.products);
}


function consultarProducto(id) {
    return fetch(`${API_PRODUCTOS}/${id}`)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }
            return respuesta.json();
        });
}


function obtenerIdDeLaUrl() {
    return new URLSearchParams(window.location.search).get("id");
}



function formatearPrecio(valor) {
    return `$${Number(valor).toFixed(2)}`;
}


function mostrarError(mensaje) {
    let estado = document.getElementById('estado');
    estado.hidden = false;
    estado.className = 'estado error';
    estado.textContent = mensaje;
}


function construirPagina() {
    let principal = crearElemento('main', 'main');
    principal.id = 'principal';

    let volver = crearNodoConTexto('a', '← Volver al catálogo', 'volver');
    volver.href = '../index.html'; 

    let estado = crearNodoConTexto('div', 'Cargando producto...', 'estado');
    estado.id = 'estado';

    adicionarElementoAContenedor(volver, principal);
    adicionarElementoAContenedor(estado, principal);
    adicionarElementoABody(principal);
    adicionarElementoABody(construirEncabezado('Detalle del producto')); 
    
}


function construirDato(etiqueta, valor) {
    let caja = crearElemento('div', 'stat');
    adicionarElementoAContenedor(crearNodoConTexto('span', etiqueta, 'stat__label'), caja);
    adicionarElementoAContenedor(crearNodoConTexto('span', valor, 'stat__valor'), caja);
    return caja;
}


function construirDetalle(p) {
    let detalle = crearElemento('article', 'detalle');

    
    let media = crearElemento('div', 'detalle__media');
    let urlImagen = p.images && p.images.length ? p.images[0] : p.thumbnail;
    adicionarElementoAContenedor(crearImagenFondo(urlImagen, p.title, 'imagen-fondo'), media);


    let datos = crearElemento('div', 'stats');
    adicionarElementoAContenedor(construirDato('Calificación', p.rating), datos);
    adicionarElementoAContenedor(construirDato('Stock', p.stock), datos);
    adicionarElementoAContenedor(construirDato('Marca', p.brand || 'No disponible'), datos); 
    adicionarElementoAContenedor(construirDato('Descuento', `${p.discountPercentage}%`), datos);

   
    let info = crearElemento('div', 'detalle__info');
    adicionarElementoAContenedor(crearNodoConTexto('span', p.category, 'categoria'), info);
    adicionarElementoAContenedor(crearNodoConTexto('div', p.title, 'detalle__nombre'), info);
    adicionarElementoAContenedor(crearNodoConTexto('div', formatearPrecio(p.price), 'detalle__precio'), info);
    adicionarElementoAContenedor(crearNodoConTexto('div', p.description, 'detalle__descripcion'), info);
    adicionarElementoAContenedor(datos, info);

    adicionarElementoAContenedor(media, detalle);
    adicionarElementoAContenedor(info, detalle);
    return detalle;
}


function mostrarDetalle(p) {
    document.getElementById('estado').hidden = true;
    adicionarElementoAContenedor(construirDetalle(p), document.getElementById('principal'));
}

function construirEncabezado(titulo, subtitulo) {
    let encabezado = crearElemento('div', 'encabezado');
    let interior = crearElemento('div', 'encabezado__interior');

    adicionarElementoAContenedor(crearNodoConTexto('span', 'SHOP API', 'encabezado__marca'), interior);
    adicionarElementoAContenedor(crearNodoConTexto('div', titulo, 'encabezado__titulo'), interior);
    if (subtitulo) {
        adicionarElementoAContenedor(crearNodoConTexto('div', subtitulo, 'encabezado__subtitulo'), interior);
    }

    adicionarElementoAContenedor(interior, encabezado);
    return encabezado;
}
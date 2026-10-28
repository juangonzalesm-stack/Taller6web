function iniciarProducto() {
    construirPagina();

    let id = obtenerIdDeLaUrl();

   
    if (!id || !/^\d+$/.test(id)) {
        mostrarError('No se indicó un producto válido.');
        return;
    }

    consultarProducto(id)
        .then(producto => {
            document.title = `${producto.title} | Detalle del producto`;
            mostrarDetalle(producto);
        })
        .catch(error => {
            console.error(error);
            mostrarError('No fue posible cargar el producto solicitado.');
        });
}




let listaProductos = []; 

function construirTarjeta(p) {
    let urlDetalle = `html/producto.html?id=${p.id}`;

    let tarjeta = crearElemento('article', 'card');

    let media = crearElemento('div', 'card__media');
    adicionarElementoAContenedor(crearImagenFondo(p.thumbnail, p.title, 'imagen-tarjeta'), media);

    let fila = crearElemento('div', 'card__fila');
    adicionarElementoAContenedor(crearNodoConTexto('span', formatearPrecio(p.price), 'card__precio'), fila);
    adicionarElementoAContenedor(crearNodoConTexto('span', p.rating, 'rating'), fila);

    let boton = crearNodoConTexto('a', 'Ver producto', 'btn');
    boton.href = urlDetalle;

    let cuerpo = crearElemento('div', 'card__body');
    adicionarElementoAContenedor(crearNodoConTexto('span', p.category, 'categoria'), cuerpo);
    adicionarElementoAContenedor(crearNodoConTexto('div', p.title, 'card__nombre'), cuerpo);
    adicionarElementoAContenedor(fila, cuerpo);
    adicionarElementoAContenedor(crearNodoConTexto('div', `Stock: ${p.stock}`, 'card__stock'), cuerpo);
    adicionarElementoAContenedor(boton, cuerpo);

    adicionarElementoAContenedor(media, tarjeta);
    adicionarElementoAContenedor(cuerpo, tarjeta);

    tarjeta.addEventListener('click', () => { window.location.href = urlDetalle; });

    return tarjeta;
}


function pintarProductos(lista) {
    let grid = document.getElementById('grid');
    grid.replaceChildren(); 

    lista.forEach(p => adicionarElementoAContenedor(construirTarjeta(p), grid));

    let estado = document.getElementById('estado');
    if (lista.length === 0) {
        estado.hidden = false;
        estado.className = 'estado';
        estado.textContent = 'No se encontraron productos.';
    } else {
        estado.hidden = true;
    }
}


function construirCatalogo() {
    let buscador = crearElemento('input', 'toolbar__search');
    buscador.type = 'search';
    buscador.placeholder = 'Buscar producto...';
    buscador.id = 'buscador';

    let barra = crearElemento('div', 'toolbar');
    adicionarElementoAContenedor(crearNodoConTexto('div', 'Productos disponibles', 'toolbar__title'), barra);
    adicionarElementoAContenedor(buscador, barra);

    let estado = crearNodoConTexto('div', 'Cargando productos...', 'estado');
    estado.id = 'estado';

    let grid = crearElemento('section', 'grid');
    grid.id = 'grid';

    let principal = crearElemento('main', 'main');
    adicionarElementoAContenedor(barra, principal);
    adicionarElementoAContenedor(estado, principal);
    adicionarElementoAContenedor(grid, principal);
    adicionarElementoABody(principal);
    adicionarElementoAContenedor(grid, principal);
    adicionarElementoABody(construirEncabezado('Catálogo de productos', 'Selecciona un producto para consultar su información.')); 
    adicionarElementoABody(principal);

    
    buscador.addEventListener('input', () => {
        let texto = buscador.value.trim().toLowerCase();
        pintarProductos(listaProductos.filter(p =>
            p.title.toLowerCase().includes(texto) || p.category.toLowerCase().includes(texto)
        ));
    });
}


function iniciarCatalogo() {
    construirCatalogo();

    consultarProductos(20) 
        .then(productos => {
            listaProductos = productos;
            pintarProductos(listaProductos);
        })
        .catch(error => {
            console.error(error);
            mostrarError('No fue posible cargar los productos. Intente de nuevo más tarde.');
        });
}
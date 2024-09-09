const url = 'https://api.restful-api.dev/objects';
const contenedor = document.querySelector('tbody');
let resultados = '';

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'));
const formArticulo = document.getElementById('formArticulo');
const modelo = document.getElementById('modelo');
const color = document.getElementById('color');
const capacidad = document.getElementById('capacidad');
const idArticulo = document.getElementById('idArticulo');
let opcion = '';

// Evento para abrir el modal al crear un nuevo artículo
btnCrear.addEventListener('click', () => {
    modelo.value = '';
    color.value = '';
    capacidad.value = '';
    idArticulo.value = '';
    modalArticulo.show();
    opcion = 'crear';
});

// Función para mostrar los resultados
const mostrar = (articulos) => {
    resultados = ''; // Limpiar los resultados previos
    articulos.forEach(articulo => {
        resultados += `
        <tr>
            <td>${articulo.id}</td>
            <td>${articulo.name}</td>
            <td>${articulo.data && articulo.data.color ? articulo.data.color : 'N/A'}</td>
            <td>${articulo.data && (articulo.data.capacity || articulo.data['capacity GB']) ? (articulo.data.capacity || articulo.data['capacity GB']) : 'N/A'}</td>
            <td class="text-center">
                <a class="btnEditar btn btn-primary">Editar</a>
                <a class="btnBorrar btn btn-danger">Borrar</a>
            </td>
        </tr>
        `;
    });
    contenedor.innerHTML = resultados;

    // Eventos para botones Editar y Borrar
    document.querySelectorAll('.btnEditar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fila = e.target.closest('tr');
            const id = fila.children[0].textContent;
            const nombre = fila.children[1].textContent;
            const colorArticulo = fila.children[2].textContent;
            const capacidadArticulo = fila.children[3].textContent;

            modelo.value = nombre;
            color.value = colorArticulo;
            capacidad.value = capacidadArticulo === 'N/A' ? '' : capacidadArticulo;
            idArticulo.value = id;

            opcion = 'editar';
            modalArticulo.show();
        });
    });

    document.querySelectorAll('.btnBorrar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fila = e.target.closest('tr');
            const id = fila.children[0].textContent;
            eliminar(id);
        });
    });
};

// Procedimiento Mostrar
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error));

// Procedimiento Crear y Editar
formArticulo.addEventListener('submit', (e) => {
    e.preventDefault();

    const datos = {
        name: modelo.value,
        data: {
            color: color.value,
            capacity: capacidad.value
        }
    };

    if (opcion === 'crear') {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            alertify.success('Artículo creado con éxito');
            fetch(url)
                .then(response => response.json())
                .then(data => mostrar(data));
        })
        .catch(error => console.log(error));
    }

    if (opcion === 'editar') {
        fetch(`${url}/${idArticulo.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            alertify.success('Artículo editado con éxito');
            fetch(url)
                .then(response => response.json())
                .then(data => mostrar(data));
        })
        .catch(error => console.log(error));
    }

    modalArticulo.hide();
});

// Procedimiento Eliminar
const eliminar = (id) => {
    alertify.confirm("¿Está seguro de eliminar este artículo?",
    function(){
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            alertify.success('Artículo eliminado con éxito');
            fetch(url)
                .then(response => response.json())
                .then(data => mostrar(data));
        })
        .catch(error => console.log(error));
    }, function(){
        alertify.error('Cancelado');
    });
};

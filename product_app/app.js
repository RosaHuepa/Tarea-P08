// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
};

// FUNCIÓN CALLBACK DE BOTÓN "Buscar"
function buscar(e) {

    /**
     * Revisar la siguiente información para entender porqué usar event.preventDefault();
     * http://qbit.com.mx/blog/2013/01/07/la-diferencia-entre-return-false-preventdefault-y-stoppropagation-en-jquery/#:~:text=PreventDefault()%20se%20utiliza%20para,escuche%20a%20trav%C3%A9s%20del%20DOM
     * https://www.geeksforgeeks.org/when-to-use-preventdefault-vs-return-false-in-javascript/
     */
    e.preventDefault();

    // SE OBTIENE EL ID A BUSCAR
    var b = document.getElementById('search').value;

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/read.php', true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log('[CLIENTE]\n' + client.responseText);

            // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
            let productos = JSON.parse(client.responseText);    // similar a eval('('+client.responseText+')');

            // SE VERIFICA SI EL OBJETO JSON TIENE DATOS

            if (Object.keys(productos).length > 0) {
                // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                let template = '';
                for (let i = 0; i < Object.keys(productos).length; i++) {
                    let descripcion = '';
                    descripcion += '<li>precio: $' + productos[i].precio + '</li>';
                    descripcion += '<li>unidades: ' + productos[i].unidades + '</li>';
                    descripcion += '<li>modelo: ' + productos[i].modelo + '</li>';
                    descripcion += '<li>marca: ' + productos[i].marca + '</li>';
                    descripcion += '<li>detalles: ' + productos[i].detalles + '</li>';

                    // SE CREA UNA PLANTILLA PARA CREAR LA(S) FILA(S) A INSERTAR EN EL DOCUMENTO HTML

                    template += `
                        <tr>
                            <td>${productos[i].id}</td>
                            <td>${productos[i].nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                        
                    `;


                    //console.log(template);
                }
                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                document.getElementById("productos").innerHTML = template;
            }
        }
    };
    client.send("bq=" + b);

}

// FUNCIÓN CALLBACK DE BOTÓN "Agregar Producto"
function agregarProducto(e) {
    e.preventDefault();

    // SE OBTIENE DESDE EL FORMULARIO EL JSON A ENVIAR
    var productoJsonString = document.getElementById('description').value;
    // SE CONVIERTE EL JSON DE STRING A OBJETO
    var finalJSON = JSON.parse(productoJsonString);
    // SE AGREGA AL JSON EL NOMBRE DEL PRODUCTO
    finalJSON['nombre'] = document.getElementById('name').value;

    var val = 0;

    if (finalJSON['nombre'] == '' || finalJSON['nombre'].length > 100) {
        val = 1;
        alert('Escriba el nombre con el formato correcto');
    }
    if (finalJSON['marca'] == '') {
        val = 1;
        alert('Escriba la marca del producto');
    }
    if (finalJSON['precio'] < 99.99) {
        val = 1;
        alert('El precio debe ser mayor a $99.99');
    }
    if (finalJSON['unidades'] < 0) {
        val = 1;
        alert('Numero invalido de unidades');
    }
    if (finalJSON['modelo'] == '' || finalJSON['modelo'].length > 25) {
        val = 1;
        alert('Escriba el modelo del producto en el formato correcto');
    }
    if (finalJSON['detalles'].length > 250) {
        val = 1;
        alert('El tamaño del atributo detalles paso el límite');
    }
    if (finalJSON['imagen'] == '') {
        finalJSON['imagen'] = 'img/imagen.png';
    }

    // SE OBTIENE EL STRING DEL JSON FINAL
    productoJsonString = JSON.stringify(finalJSON, null, 2);

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/create.php', true);
    client.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log(client.responseText);
            window.alert(client.responseText);
        }
    };
    if (val == 0) { client.send(productoJsonString); }
}

// SE CREA EL OBJETO DE CONEXIÓN COMPATIBLE CON EL NAVEGADOR
function getXMLHttpRequest() {
    var objetoAjax;

    try {
        objetoAjax = new XMLHttpRequest();
    } catch (err1) {
        /**
         * NOTA: Las siguientes formas de crear el objeto ya son obsoletas
         *       pero se comparten por motivos historico-académicos.
         */
        try {
            // IE7 y IE8
            objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (err2) {
            try {
                // IE5 y IE6
                objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (err3) {
                objetoAjax = false;
            }
        }
    }
    return objetoAjax;
}

function init() {
    /**
     * Convierte el JSON a string para poder mostrarlo
     * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var JsonString = JSON.stringify(baseJSON, null, 2);
    document.getElementById("description").value = JsonString;
}
<?php
    $conexion = @mysqli_connect(
        'localhost',
        'root',
        'Ro.2106.',
        'marketzone'
    );

    /**
     * NOTA: si la conexión falló $conexion contendrá false
     **/
    if(!$conexion) {
        die('¡Base de datos NO conextada!');
    }
?>
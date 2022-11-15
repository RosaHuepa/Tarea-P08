<?php
include_once __DIR__ . '/database.php';

// SE OBTIENE LA INFORMACIÓN DEL PRODUCTO ENVIADA POR EL CLIENTE
$producto = file_get_contents('php://input');
if (!empty($producto)) {
    // SE TRANSFORMA EL STRING DEL JASON A OBJETO
    $jsonOBJ = json_decode($producto);

    $resultado = "SELECT * FROM productos WHERE nombre = '$jsonOBJ->nombre' and eliminado=0";
    $result = $conexion->query($resultado);
    if ($result->num_rows == 0) {
		$sql = "INSERT INTO productos VALUES (null, '$jsonOBJ->nombre', '$jsonOBJ->marca', '$jsonOBJ->modelo', $jsonOBJ->precio, '$jsonOBJ->detalles', $jsonOBJ->unidades, '$jsonOBJ->imagen', 0)";

        if (mysqli_query($conexion, $sql)) {
            echo 'PRODUCTO INSERTADO';
        } else {
            echo "ERROR: No se ejecuto $sql. " . mysqli_error($conexion);
        }
	}else{
        echo 'No se puede insertar el mismo producto';
    }

    // Cierra la conexion
    mysqli_close($conexion);
    //echo '[SERVIDOR] Nombre: '.$jsonOBJ->nombre;
}





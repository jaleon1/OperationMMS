<?php 
require_once("Conexion.php");

class Monitoreo{
    public $id;
    public $medicion;
    public $fecha;
    //
    public static function read($id){
        try{
            $sql="SELECT medicion, fecha
                FROM cm4000_8 
                WHERE id= :id
                order by fecha asc";
            $param= array(':id'=>$id);
            $data = DATA::Ejecutar($sql,$param);            
            $lista = [];
            $i =0;
            foreach ($data as $key => $value){
                // $monitoreo = new Monitoreo();
                // $monitoreo->fecha = $value['fecha'];
                // $monitoreo->medicion = $value['medicion'];                
                //array_push ($lista, [$value['fecha'], floatval($value['medicion'])]);
                array_push ($lista, [$i, floatval($value['medicion'])]);
                $i++;
            }
            return $lista;
        }
        catch(Exception $e) {
            return false;
        }
    }
}
?>
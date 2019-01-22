<?php
//ACTION
if(isset($_POST["action"])){
    $opt= $_POST["action"];
    unset($_POST['action']);
    // Classes
    require_once("conexion.php");
    // 
    // Instance
    $dataCenter = new DataCenter();
    switch($opt){
        case "ReadAll":
            echo json_encode($dataCenter->ReadAll());
            break;
        case "read":
            echo json_encode($dataCenter->read());
            break;
        case "create":
            echo json_encode($dataCenter->create());
            break;
        case "update":
            $dataCenter->update();
            break;
        case "delete":
            echo json_encode($dataCenter->delete());
            break; 
    }
}

class DataCenter{
    //DataCenter
    public $id="";
    public $nombre="";
    public $ubicacion=null;


    function __construct(){
        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            
            require_once("UUID.php");
            
            $this->id= $obj["id"] ?? UUID::v4();
            $this->nombre= $obj["nombre"] ?? null; 
            $this->ubicacion= $obj["ubicacion"] ?? null;

        }
    }

    function ReadAll(){
        try {
            $sql='SELECT id, nombre, ubicacion
                FROM dataCenter
                ORDER BY nombre DESC;';
            $data= DATA::Ejecutar($sql);
            if($data){
                return $data;
            }
        }     
        catch(Exception $e) {
            error_log("[ERROR]  (".$e->getCode()."): ". $e->getMessage());
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => 'Error al cargar la lista'))
            );
        }
    }
    
    function create(){
        try {
            $sql="insert into dataCenter (id, nombre, ubicacion) 
            VALUES  ((UUID(), :nombre, :ubicacion);";

                $param= array(':nombre'=>$this->nombre,
                ':ubicacion'=>$this->ubicacion);
            $data = DATA::Ejecutar($sql,$param, false);
            if($data) { 
                return true;
            }
        }     
        catch(Exception $e) {
            error_log("[ERROR]  (".$e->getCode()."): ". $e->getMessage());
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }

}

?>
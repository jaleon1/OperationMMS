<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("conexion.php");
    // 
    // Instance
    $sala = new Sala();
    switch($opt){
        case "ReadAll":
            echo json_encode($sala->ReadAll());
            break;
        case "ReadbyDC":
            echo json_encode($sala->ReadbyDC());            
            break;
        case "create":
            echo json_encode($sala->create());
            break;
        case "update":
            $sala->update();
            break;
        case "delete":
            echo json_encode($sala->delete());
            break; 
    }
}

class Sala{
    //Componente
    public $id="";
    public $idDataCenter="";
    public $nombre=null;
    public $componentes=[];


    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        if(isset($_POST["idDataCenter"])){
            $this->idDataCenter= $_POST["idDataCenter"];
        }
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            
            require_once("UUID.php");
            
            $this->id= $obj["id"] ?? UUID::v4();
            $this->nombre= $obj["nombre"] ?? null;
            $this->idDataCenter= $obj["idDataCenter"] ?? null;
        }
    }

    function ReadAll(){
        try {
            $sql='SELECT id, nombre
                FROM cdc_bms.sala
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

    function ReadbyDC(){
        try {
            $sql='SELECT s.id, s.idDataCenter, s.nombre, dc.nombre nombreDataCenter
            FROM sala s
            INNER JOIN dataCenter dc on dc.id = s.idDataCenter
            WHERE idDataCenter = :idDataCenter
            ORDER BY nombre ASC;';
                $param= array(':idDataCenter'=>$this->idDataCenter);
            $data= DATA::Ejecutar($sql, $param);
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
            $sql="INSERT INTO `cdc_bms`.`sala`(`id`,`nombre`,`idDataCenter`)VALUES(uuid(),:nombre,:idDataCenter);";
            $param= array(':nombre'=>$this->nombre,':idDataCenter'=>$this->idDataCenter);
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
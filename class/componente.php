<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("conexion.php");
    require_once("sala.php");
    require_once("variable.php");
    require_once("estado.php");
    // 
    // Instance
    $componente = new Componente();
    switch($opt){
        case "ReadAll":
            echo json_encode($componente->ReadAll());
            break;
        case "ReadbySala":
            echo json_encode($componente->ReadbySala());  
            break;   
        case "ReadbyDC":
            echo json_encode($componente->ReadbyDC());            
            break;
        case "create":
            echo json_encode($componente->create());
            break;
        case "update":
            $componente->update();
            break;
        case "delete":
            echo json_encode($componente->delete());
            break; 
    }
}

class Componente{
    //Componente
    public $id="";
    public $idSala="";
    public $idDataCenter="";
    public $nombre=null;
    public $estado="";
    public $variables="";


    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        if(isset($_POST["idDataCenter"])){
            $this->idDataCenter= $_POST["idDataCenter"];
        }
        if(isset($_POST["idSala"])){
            $this->idSala= $_POST["idSala"];
        }
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            
            require_once("UUID.php");
            
            $this->id= $obj["id"] ?? UUID::v4();
            $this->idSala= $obj["idSala"] ?? null;
            $this->idDataCenter= $obj["idDataCenter"] ?? null; 
            $this->nombre= $obj["nombre"] ?? null;

        }
    }

    function ReadbySala(){
        try {
            $sql='SELECT id idSala, nombre nombreSala 
            FROM cdc_bms.sala
            WHERE idDataCenter = :idDataCenter;';
            $param= array(':idDataCenter'=>$this->idDataCenter);
            $Sala = DATA::Ejecutar($sql, $param);
            if($Sala){
                
                $arraySalas = array();

                foreach ($Sala as $keySala=> $itemSala){
                    $objSala = new Sala;
                    $objSala->id = $itemSala["idSala"];
                    $objSala->nombre = $itemSala["nombreSala"];
                
            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
                
                    $sql='SELECT id idComponente, nombre nombreComponente
                        FROM componente c
                        WHERE idSala = :idSala
                        ORDER BY nombreComponente ASC;';
                    $param= array(':idSala'=>$objSala->id);
                    $componentesXSala = DATA::Ejecutar($sql, $param);
                    if($componentesXSala){
                        
                        $arrayComponentes = array();
                        
                        foreach ($componentesXSala as $keyComponenteXsala=> $item) {    

                            $objComponente = new Componente;
                            $objComponente->id = $item["idComponente"];
                            $objComponente->nombre = $item["nombreComponente"];
                            $objComponente->estado = "OK";


                            $sql='SELECT vc.id, v.nombre, v.unidad, vc.max, vc.min, vc.optimo 
                                FROM variableComponente vc
                                INNER JOIN variable v on v.id = vc.idVariable
                                Where idComponente = :idComponente;';
                            $param= array(':idComponente'=>$item["idComponente"]);
                            $VariablesXComponente= DATA::Ejecutar($sql, $param);
                            
                            if($VariablesXComponente){

                                $arrayVariables = array();

                                foreach ($VariablesXComponente as $keyVarXcomponente=> $item) {
                                    
                                    $objVariable = new Variable;
                                    $objVariable->id = $item["id"];
                                    $objVariable->nombre = $item["nombre"];
                                    $objVariable->unidad = $item["unidad"];
                                    $objVariable->max = $item["max"];
                                    $objVariable->min = $item["min"];
                                    $objVariable->optimo = $item["optimo"];

                                    $sql='SELECT *
                                    FROM estadoXVariable
                                    WHERE idVariableComponente = :idVariableComponente
                                    ORDER BY fecha DESC
                                    LIMIT 1;';
                                    $param= array(':idVariableComponente'=>$item["id"]);
                                    $estadoXVariable= DATA::Ejecutar($sql, $param);
                                
                                    
                                    if($estadoXVariable){
                                        
                                        $arrayEstado = array();

                                        foreach ($estadoXVariable as $keyEstadoXvariable=> $item) {

                                            $objEstado = new Estado;
                                            $objEstado->id = $item["id"];
                                            $objEstado->estado = $item["estado"];
                                            $objEstado->valor = $item["valor"];
                                            $objEstado->fecha = $item["fecha"];

                                            if($objEstado->estado != "OK"){
                                                $objComponente->estado = $objEstado->estado;
                                            }
                                            array_push ($arrayEstado, $objEstado);
                                        }
                                        $objVariable->estados = $arrayEstado;
                                    }                                    
                                    array_push ($arrayVariables, $objVariable);                            
                                }                                        
                                $objComponente->variables = $arrayVariables;
                            }
                            array_push ($arrayComponentes, $objComponente);
                        }      
                        $objSala->componentes = $arrayComponentes;
                    }                     
                    array_push ($arraySalas, $objSala);
                }
                return $arraySalas;
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

            $arrayComponentes = array();
            
            $sql='SELECT c.id idComponente, c.nombre nombreComponente
                    FROM componente c
                    INNER JOIN sala s on s.id = c.idSala
                    INNER JOIN dataCenter dc on dc.id = s.idDataCenter
                    WHERE dc.id = :id
                    ORDER BY nombreComponente ASC;';
            $param= array(':id'=>$this->idDataCenter);
            $componentesXSala = DATA::Ejecutar($sql, $param);
            if($componentesXSala){
                
                foreach ($componentesXSala as $keyComponenteXsala=> $item) {    

                    $objComponente = new Componente;
                    $objComponente->id = $item["idComponente"];
                    $objComponente->nombre = $item["nombreComponente"];
                    $objComponente->estado = "OK";


                    $sql='SELECT vc.id, v.nombre, v.unidad, vc.max, vc.min, vc.optimo 
                        FROM variableComponente vc
                        INNER JOIN variable v on v.id = vc.idVariable
                        Where idComponente = :idComponente;';
                    $param= array(':idComponente'=>$item["idComponente"]);
                    $VariablesXComponente= DATA::Ejecutar($sql, $param);
                    
                    if($VariablesXComponente){

                        $arrayVariables = array();

                        foreach ($VariablesXComponente as $keyVarXcomponente=> $item) {
                            
                            $objVariable = new Variable;
                            $objVariable->id = $item["id"];
                            $objVariable->nombre = $item["nombre"];
                            $objVariable->unidad = $item["unidad"];
                            $objVariable->max = $item["max"];
                            $objVariable->min = $item["min"];
                            $objVariable->optimo = $item["optimo"];

                            $sql='SELECT *
                            FROM estado
                            WHERE idVariableComponente = :idVariableComponente
                            ORDER BY fecha DESC
                            LIMIT 1;';
                            $param= array(':idVariableComponente'=>$item["id"]);
                            $estadoXVariable= DATA::Ejecutar($sql, $param);
                           
                            
                            if($estadoXVariable){
                                
                                $arrayEstado = array();

                                foreach ($estadoXVariable as $keyEstadoXvariable=> $item) {

                                    $objEstado = new Estado;
                                    $objEstado->id = $item["id"];
                                    $objEstado->estado = $item["estado"];
                                    $objEstado->valor = $item["valor"];
                                    $objEstado->fecha = $item["fecha"];

                                    if($objEstado->estado != "OK"){
                                        $objComponente->estado = $objEstado->estado;
                                    }
                                    
                          
                                    array_push ($arrayEstado, $objEstado);
                                }
                                $objVariable->estados = $arrayEstado;
                                // return true;
                            }
                            
                            array_push ($arrayVariables, $objVariable);                            
                        }                                        
                        $objComponente->variables = $arrayVariables;
                    }

                    array_push ($arrayComponentes, $objComponente);
                }                
                return $arrayComponentes;
            }            
            else { 
                return false;
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
            $sql="INSERT INTO `cdc_bms`.`componente`(`id`,`idSala`,`nombre`) VALUES (uuid(),:idSala,:nombre);";
            $param= array(':nombre'=>$this->nombre,':idSala'=>$this->idSala);
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
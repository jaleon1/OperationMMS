<?php
    //ACTION
    if( isset($_POST["action"])){        
        $opt= $_POST["action"];
        unset($_POST['action']);    
        // Classes
        require_once("conexion.php");
        // 
        // Instance
        $variable = new Variable();
        switch($opt){
            case "ReadAll":
                echo json_encode($variable->ReadAll());
                break;
            case "nuevoEstadoVariable":
                echo ($variable->nuevoEstadoVariable());            
                break;
            case "create":
                echo json_encode($variable->create());
                break;
            case "update":
                $variable->Update();
                break;
            case "delete":
                echo json_encode($variable->delete());
                break; 
        }
    }


    class Variable{
        //Componente
        public $id="";
        public $idComponente="";
        public $estados=[];
        public $max=null;
        public $min=null;
        public $optimo=null;
        public $valor=null;

        function __construct(){

            if(isset($_POST["id"])){
                $this->id= $_POST["id"];
            }
            if(isset($_POST["idComponente"])){
                $this->idComponente= $_POST["idComponente"];
            }
            if(isset($_POST["obj"])){
                $obj= json_decode($_POST["obj"],true);
                
                require_once("UUID.php");
                
                $this->id= $obj["id"] ?? UUID::v4();
                $this->idComponente= $obj["idComponente"] ?? null; 
                $this->nombre= $obj["nombre"] ?? null;
                $this->valor= $obj["valor"] ?? null;
    
            }
        }

        function nuevoEstadoVariable(){
            try {
                $estado = "";
                $sql='SELECT vc.max, vc.min
                    FROM variableComponente vc
                    WHERE id = :id';
                $param= array(':id'=>$this->id);
                $limites= DATA::Ejecutar($sql, $param);

                if($limites){

                    if( $this->valor > $limites[0]["max"] || $this->valor < $limites[0]["min"] ){
                        $estado = "DEGRADADO";
                    }  
                    else{
                        $estado = "OK";
                    }

                    $sql='INSERT INTO estado (id, idVariableComponente, estado, valor, fecha) 
                        VALUES (UUID(), :idVariableComponente, :estado, :valor, NOW());';
                    $param= array(':idVariableComponente'=>$this->id,
                                    ':estado'=>$estado,
                                    ':valor'=>$this->valor);
                    $data= DATA::Ejecutar($sql, $param);
              
                    return "200";
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
    

    }

?>
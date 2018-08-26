<?php
if(isset($_POST["action"])){
    $opt= $_POST["action"];
    unset($_POST['action']);
    // Classes
    require_once("Conexion.php");
    //require_once("Usuario.php");
    require_once("monitoreo.php");
    // Session
    if (!isset($_SESSION))
        session_start();
    // Instance
    $tipo= new Tipo();
    switch($opt){
        case "readEvents":
            echo json_encode($tipo->readEvents());
            break;
        case "ReadAll":
            echo json_encode($tipo->ReadAll());
            break;
        case "Read":
            echo json_encode($tipo->Read());
            break;
        case "ReadbyOrden":
            echo json_encode($tipo->ReadbyOrden());
            break;
        case "Create":
            echo json_encode($tipo->Create());
            break;
        case "Update":
            $tipo->Update();
            break;
        case "Delete":
            $tipo->Delete();
            break;  
        case "Aceptar":
            $tipo->Aceptar();
            break;   
    }
}

class varEvents{
    public $data= [];
    public $label='';
}

class Tipo{
    public $id=null;
    //public $label='';
    public $nombre='';
    public $unidad=null;
    public $alto='';
    public $bajo=null;
    public $lista= [];
    //
    function __construct(){
        // identificador único
        if(isset($_POST["id"])){
            //$this->id= $_POST["id"];
        }
        // if(isset($_POST["inicio"])){
        //     $this->id= $_POST["inicio"];
        // }
        // if(isset($_POST["final"])){
        //     $this->id= $_POST["final"];
        // }
        // if(isset($_POST["obj"])){
        //     $obj= json_decode($_POST["obj"],true);
        //     require_once("UUID.php");
        //     $this->id= $obj["id"] ?? UUID::v4();
        //     //$this->nombre= $obj["nombre"] ?? '';            
        //     $this->idBodega= $obj["idBodega"] ?? $_SESSION["userSession"]->idBodega; // si no está seteada el idBodega, toma el de la sesion.
        //     $this->porcentajeDescuento= $obj["porcentajeDescuento"] ?? 0;
        //     $this->porcentajeIva= $obj["porcentajeIva"] ?? '';
        //     $this->alto= $obj["alto"] ?? '';      
        //     //$this->bajo= $obj["bajo"] ?? null;
        //     // lista.
        //     if(isset($obj["lista"] )){
        //         require_once("ProductosXDistribucion.php");
        //         //
        //         foreach ($obj["lista"] as $itemlist) {
        //             $item= new ProductosXDistribucion();
        //             $item->idDistribucion= $this->id;
        //             $item->idProducto= $itemlist['idProducto'];
        //             $item->cantidad= $itemlist['cantidad'];
        //             $item->valor= $itemlist['valor'];
        //             array_push ($this->lista, $item);
        //         }
        //     }
        // }
    }

    function ReadAll(){
        try {
            // $sql='SELECT id, nombre, idBodega, alto, bajo
            //     FROM     tipo       
            //     ORDER BY nombre asc';
            $sql= 'SELECT d.id, nombre, alto, u.userName, b.nombre as unidad, e.nombre as estado, 
                    (sum(cantidad*valor) + sum(cantidad*valor)*0.13) as total
                FROM tropical.tipo d 
                    INNER JOIN usuario u on u.id=d.bajo
                    INNER JOIN unidad b on b.id=d.idBodega
                    INNER JOIN estado e on e.id=d.idEstado
                    INNER JOIN productosXDistribucion p on p.idDistribucion=d.id
                GROUP BY alto
                ORDER BY nombre desc';
            $data= DATA::Ejecutar($sql);
            return $data;
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => 'Error al cargar la lista'))
            );
        }
    }

    function readEvents(){
        try {
            $obj= json_decode($_POST["listaIds"],true);
            $eventArray= [];
            foreach ($obj as $item) {    
                $evento = new varEvents();            
                $sql='SELECT id, nombre, alto, bajo, unidad
                FROM tipo
                WHERE id= :id';
                $param= array(':id'=>$item);
                $data= DATA::Ejecutar($sql,$param);     
                if(count($data)){
                    //$tipo->id = $data[0]['id'];
                    //$tipo->nombre = $data[0]['nombre'];
                    $evento->label = $data[0]['nombre'];
                    //$tipo->bajo = $data[0]['bajo'];
                    //$tipo->alto = $data[0]['alto'];
                    //$tipo->unidad = $data[0]['unidad'];
                    //$tipo->label = $data[0]['nombre'];
                    // productos x tipo.
                    $evento->data= Monitoreo::read($item);
                    //
                    array_push ($eventArray, $evento);
                }                
            }
            //            
            return $eventArray;
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => 'Error al cargar el tipo'))
            );
        }
    }

    function Read(){
        try {
            $sql='SELECT d.id, d.nombre, d.alto, d.bajo, d.idBodega, b.nombre as unidad, d.porcentajeDescuento, d.porcentajeIva
                FROM tipo d
                INNER JOIN unidad b on b.id=d.idBodega
                where d.id=:id';
            $param= array(':id'=>$this->id);
            $data= DATA::Ejecutar($sql,$param);     
            if(count($data)){
                $this->id = $data[0]['id'];
                $this->nombre = $data[0]['nombre'];
                $this->alto = $data[0]['alto'];
                $this->bajo = $data[0]['bajo'];
                $this->idBodega = $data[0]['idBodega'];
                $this->unidad = $data[0]['unidad'];
                $this->porcentajeDescuento = $data[0]['porcentajeDescuento'];
                $this->porcentajeIva = $data[0]['porcentajeIva'];
                // productos x tipo.
                $this->lista= ProductosXDistribucion::Read($this->id);
                //
                return $this;
            }
            else return null;
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => 'Error al cargar el tipo'))
            );
        }
    }

    function Create(){
        try {
            $sql="INSERT INTO tipo  (id, idBodega, bajo, porcentajeDescuento, porcentajeIva) 
                VALUES (:id, :idBodega, :bajo, :porcentajeDescuento, :porcentajeIva);";
            $param= array(':id'=>$this->id ,
                ':idBodega'=>$this->idBodega, 
                ':bajo'=>$_SESSION['userSession']->id,
                ':porcentajeDescuento'=>$this->porcentajeDescuento,
                ':porcentajeIva'=>$this->porcentajeIva,
            );
            $data = DATA::Ejecutar($sql,$param,false);
            if($data)
            {
                //save array obj
                if(ProductosXDistribucion::Create($this->lista)){
                    // si es una unidad interna, acepta la distribución.
                    $sql="SELECT t.nombre
                        FROM tropical.unidad b
                        INNER JOIN tipoBodega t on t.id = b.idTipoBodega
                        WHERE b.id=:idBodega and t.nombre= 'Interna' ";
                    $param= array(':idBodega'=>$this->idBodega);
                    $data = DATA::Ejecutar($sql,$param);
                    if(count($data))
                        $this->Aceptar();
                    // retorna alto autogenerada.
                    return $this->Read();
                }
                else throw new Exception('Error al guardar los productos.', 03);
            }
            else throw new Exception('Error al guardar.', 02);
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }

    function Aceptar(){
        try {
            $created=true;
            $sql="UPDATE tipo
                SET idEstado=1, fechaAceptacion= NOW()
                WHERE id=:id";
            $param= array(':id'=> $this->id);
            $data = DATA::Ejecutar($sql,$param,false);
            // if(!$data)
            //     // $created=false;
            foreach ($this->lista as $item) {
                $sql="CALL spUpdateSaldosPromedioInsumoBodegaEntrada(:nidproducto, :nidbodega, :ncantidad, :ncosto)";
                $param= array(':nidproducto'=> $item->idProducto, 
                    ':nidbodega'=> $this->idBodega,
                    ':ncantidad'=> $item->cantidad,
                    ':ncosto'=> $item->valor);
                $data = DATA::Ejecutar($sql,$param,false);
                if(!$data)
                    $created= false;
            }
            if($created)
                return true;
            else throw new Exception('Error al calcular SALDOS Y PROMEDIOS, debe realizar el cálculo manualmente.', 666);
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }

    function Update(){
        try {
            $sql="UPDATE tipo 
                SET nombre=:nombre, idBodega=:idBodega, alto=:alto, bajo=:bajo
                WHERE id=:id";
            $param= array(':id'=>$this->id, ':nombre'=>$this->nombre, ':idBodega'=>$this->idBodega, ':alto'=>$this->alto, ':bajo'=>$this->bajo);
            $data = DATA::Ejecutar($sql,$param,false);
            if($data)
                return true;
            else throw new Exception('Error al guardar.', 123);
        }     
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }   

    private function CheckRelatedItems(){
        try{
            $sql="SELECT id
                FROM /*  definir relacion */ R
                WHERE R./*definir campo relacion*/= :id";                
            $param= array(':id'=>$this->id);
            $data= DATA::Ejecutar($sql, $param);
            if(count($data))
                return true;
            else return false;
        }
        catch(Exception $e){
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }

    function Delete(){
        try {
            // if($this->CheckRelatedItems()){
            //     //$sessiondata array que devuelve si hay relaciones del objeto con otras tablas.
            //     $sessiondata['status']=1; 
            //     $sessiondata['msg']='Registro en uso'; 
            //     return $sessiondata;           
            // }                    
            $sql='DELETE FROM tipo  
            WHERE id= :id';
            $param= array(':id'=>$this->id);
            $data= DATA::Ejecutar($sql, $param, false);
            if($data)
                return $sessiondata['status']=0; 
            else throw new Exception('Error al eliminar.', 978);
        }
        catch(Exception $e) {
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }

    function ReadByCode(){
        try{ 
            $sql="SELECT id, nombre, idBodega, descripcion
                FROM tipo
                WHERE idBodega= :idBodega";
            $param= array(':idBodega'=>$this->idBodega);
            $data= DATA::Ejecutar($sql,$param);
            
            if(count($data))
                return $data;
            else return false;
        }
        catch(Exception $e){
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => $e->getMessage()))
            );
        }
    }
}



?>
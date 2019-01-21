class Componente {
    // Constructor
    constructor(id, idSala, idDataCenter, nombre) {
        this.id = id || null;
        this.idSala = idSala || '';
        this.idDataCenter = idDataCenter || null;
        this.nombre = nombre || '';
    }

    //Getter
    get ReadbyDC() {
        var miAccion = 'ReadbyDC';
        
        $.ajax({
            type: "POST",
            url: "class/componente.php",
            data: {
                action: miAccion,
                idDataCenter: dataCenter.id
            }
        })
            .done(function (e) {
                // componente.draw(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    get ReadbySala() {
        var miAccion = 'ReadbySala';
        
        $.ajax({
            type: "POST",
            url: "class/componente.php",
            data: {
                action: miAccion,
                idSala: sala.id
            }
        })
            .done(function (e) {
                if (e != "false"){
                    componente.draw(e);
                }
                else{
                    return;
                }
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }
    

    // Methods
    draw(e) {
        var objComponente = JSON.parse(e);
        var mitabla = [];

        if ( !document.getElementById(`tb_${objComponente[0].idSala}`) ){
            alert( "no existe Sala" );
        }
        else{
            $(`#tb_${objComponente[0].idSala}`).empty();
            mitabla = $(`#tb_${objComponente[0].idSala}`).DataTable({
                data: objComponente,
                destroy: true,
                "language": {
                    "infoEmpty": "Sin Productos Ingresados",
                    "info":           "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    "emptyTable": "Sin Productos Ingresados",
                    "search": "Buscar",
                    "zeroRecords": "No hay resultados",
                    "lengthMenu": "Mostar _MENU_ registros",
                    "paginate": {
                        "first": "Primera",
                        "last": "Ultima",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                },
                "order": [[1, "desc"]],
                columns: [                 
                    {
                        title: "Acción",
                        "searchable": false,
                        // "width": "10%",
                        data: null,
                        className: "center",
                        defaultContent: '<button class="btn-link"><i class="fa fa-check-circle-o" aria-hidden="true"></i></button>'
                    },
                    {
                        title: "idComponente",
                        data: "id",
                        visible: false,
                        searchable: false
                    },              
                    {
                        title: "nombreComponente",
                        data: "nombre",
                        // "width": "40%",
                        visible: true
                    },    
                    {
                        title: "Estado Anterior",
                        data: "estado",
                        className: "center"
                    },          
                    {
                        title: "idSala",
                        data: "idSala",
                        visible: false,
                        searchable: false
                    }, 
                    {
                        title: "Nuevo Estado",
                        "searchable": false,
                        // "width": "10%",
                        data: null,
                        className: "center",
                        defaultContent: '<button class="btn-link remove"><i class="fa fa-check-circle" aria-hidden="true"></i>  Marcar todo OK</i></button>'
                    }
                ]
            });
        }


        $(`#tb_${objComponente[0].idSala} tbody`).on( 'click', 'tr', function () {
            objComponente;
            mitabla.rows;

            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                mitabla.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var fila = mitabla.row(this).data();
            
            $("#modal_variable_componente_titulo").html(fila.nombre);
            $("#modal_variable_componente_cuerpo").empty();
            // $("#modal_variable_componente_cuerpo").html(`<table style='width:100%'>
            //         <tr>
            //             <th>Item</th>
            //             <th>Max</th> 
            //             <th>Min</th>
            //             <th>Optimo</th>
            //             <th>Actual</th>
            //         </tr> 
            //         <tbody>
            //         </tbody> 
            //     </table>`);
            $("#modal_variable_componente_cuerpo").append(`
                <div class="row">
                    <div class="col-sm-4" style="font-weight: bold;">Nombre del Item</div>
                    <div class="col-sm-1" style="font-weight: bold;">Max</div>
                    <div class="col-sm-1" style="font-weight: bold;">Min</div>
                    <div class="col-sm-1" style="font-weight: bold;">Optimo</div>
                    <div class="col-sm-1" style="font-weight: bold;">Anterior</div>
                    <div class="col-sm-4" style="font-weight: bold;">Nuevo Valor</div>
                </div>
                <hr>`
            );
                    
            $.each( fila.variables, function( key, value ) {
                var valorActual = "";
                if (value.estados[0].valor > value.max || value.estados[0].valor < value.min ){ 
                    valorActual = `<div class="col-sm-1" style="padding-top: 1%;color: red;">${parseFloat(value.estados[0].valor).toFixed(2)}</div>`
                }
                else{
                    valorActual = `<div class="col-sm-1" style="padding-top: 1%;color: blue;">${parseFloat(value.estados[0].valor).toFixed(2)}</div>`
                }

                $("#modal_variable_componente_cuerpo").append(`
                    <div class="row">
                        <div class="col-sm-4" style="padding-top: 1%;">${value.nombre}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.max}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.min}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.optimo}</div>
                        ${valorActual}
                        <div class="col-sm-4">
                            <div class="input-group">
                                <input id="inp_update_variable_${value.id}" type="text" class="form-control" aria-label="...">
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus" aria-hidden="true"></i> 
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li>
                                            <a onclick="variable.nuevoEstadoVariable('${value.id}', '${fila.id}', 'false')">Actualizar</a>
                                        </li>
                                        <li role="separator" class="divider"></li>                                        
                                        <li>
                                            <a onclick="nuevoEstadoVariable('${value.id}', '${fila.id}', 'true')">Actualizar y Reportar</a>
                                        </li>
                                    </ul>
                                </div><!-- /btn-group -->
                            </div><!-- /input-group -->

                        </div>
                    </div>`
                );
            })        

            $('#modal_variable_componente').modal('show');
        });
    };


    Init() {
        //NProgress
        $(function()
        {
            $(document)
                .ajaxStart(NProgress.start)
                .ajaxStop(NProgress.done);
        });
    };


}

let componente = new Componente();
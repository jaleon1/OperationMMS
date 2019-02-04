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
                componente.drawByDC(e);
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
                idDataCenter: dataCenter.id
            }
        })
            .done(function (e) {
                if (e != "false") {
                    componente.drawbySala(e);
                }
                else {
                    return;
                }
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    get ReadDC() {
        var miAccion = 'ReadAll';
        $.ajax({
            type: "POST",
            url: "class/dataCenter.php",
            data: {
                action: miAccion,
            }
        })
            .done(function (e) {
                componente.ShowItemDataDC(e);
            })
            .fail(function (e) {
                alert("Error!");
                // sala.showError(e);
            })
            .always(function () {

            });
    }

    get ReadSala() {
        var miAccion = 'ReadbyDC';
        $.ajax({
            type: "POST",
            url: "class/sala.php",
            data: {
                action: miAccion,
                idDataCenter: $("#dataCenters").val()
            }
        })
            .done(function (e) {
                componente.ShowItemDataSala(e);
            })
            .fail(function (e) {
                alert("Error!");
                // sala.showError(e);
            })
            .always(function () {

            });
    }

    ShowItemDataDC(e) {
        // carga objeto.
        var data = JSON.parse(e);
        $.each(data, function (i) {
            $('#dataCenters').append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>');
        });
    };

    ShowItemDataSala(e) {
        // carga objeto.
        var data = JSON.parse(e);
        $.each(data, function (i) {
            $('#salas').append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>');
        });
    };

    get create() {
        $('#btnGuardarComponente').attr("disabled", "disabled");
        var miAccion = this.id == null ? 'create' : 'update';
        this.nombre = $("#nombreComponente").val();
        this.idDataCenter = $("#dataCenters").val();
        this.idSala = $("#salas").val();

        $.ajax({
            type: "POST",
            url: "class/componente.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(this)
            }
        })
            .done(function (e) {
                alert("OK");
            })
            .fail(function (e) {
                alert('Error Componente 1');
            })
            .always(function () {
                componente.clear();
                $('#btnGuardarComponente').attr("disabled", false);
            });

    }

    validaRevision() {
        //Valida que todos los elementos hayan sido revisados
    }

    actualizaEstadoVariable(idComponente, idVariable) {
        //////////////////////////////
        var item = objComponente.find(linea => linea.id = idComponente);

        // var item2 = item.find(linea => linea.id = idVariable);
        $.each(item.variables, function (key, value) {
            if (value.id == idVariable) {
                value.valor = $(`#inp_update_variable_${value.id}`).val();
            }
        })
    }

    // Dibuja los componentes por sala
    drawbySala(e) {
        objSalas = JSON.parse(e);
        sala.activa = document.getElementsByClassName("active sala");
        sala.activa = $(sala.activa).data("idsala")

        $.each(objSalas, function (key, sala) {

            $(`#tb_${sala.id}`).empty();
            mitabla[sala.id] = $(`#tb_${sala.id}`).DataTable({
                data: sala.componentes,
                destroy: true,
                "language": {
                    "infoEmpty": "Sin Elementos",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    "emptyTable": "Sin Elementos",
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
                        title: "idComponente",
                        data: "id",
                        visible: false,
                        searchable: false
                    },
                    {
                        title: "Nombre Componente",
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
                        defaultContent: '<button class="btn-link remove"><i class="fa fa-pencil componenteNoCheck" aria-hidden="true"> Pendiente </i></button>'
                    },
                    {
                        title: "Acción",
                        "searchable": false,
                        // "width": "10%",
                        data: null,
                        className: "center",
                        defaultContent: '<button class="btn-link"><i class="fa fa-check-circle-o componenteCheck" aria-hidden="true"> Todo OK</i></button>'
                    },
                ]
            });

        })


        $(`table tbody tr`).on('click', 'td', function () {
            for (let i = 0; i < componente.arrayComponentes; i++) {
                if (arrayComponentes[i].reportesComponente) {
                    alert("prueba");
                }
            }
            $(".panel_reportes").empty();//Limpia el cuerpo del modal para cargar los eventos

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                mitabla[sala.activa].$('tr.selected').removeClass('selected');
                $(this).addClass('selected');

                $(this).closest("tr").find("td:eq(2)").html('<i class="fa fa-check" aria-hidden="true"> Listo</i>');

                var btnGuardaRecorrido = document.getElementsByClassName("fa-pencil");
                if (btnGuardaRecorrido.length < 1) {
                    $("#btn_finalizaInspeccion").removeClass("disabled");
                }
            }


            if ($.trim(this.textContent) == ("Todo OK")
            )
                return false;


            // mitabla[sala.activa].rows;



            var fila = mitabla[sala.activa].row(this.parent).data();


            $("#modal_variable_componente_titulo").html(fila.nombre);
            componente.id = fila.id;
            componente.dataCenter = componente.getParameterByName('id');
            // $("#modal_variable_componente_cuerpo").empty();
            // $("#modal_variable_componente_cuerpo").append(`
            //     <div class="row">
            //         <div class="col-sm-4" style="font-weight: bold;">Nombre del Item</div>
            //         <div class="col-sm-1" style="font-weight: bold;">Max</div>
            //         <div class="col-sm-1" style="font-weight: bold;">Min</div>
            //         <div class="col-sm-1" style="font-weight: bold;">Optimo</div>
            //         <div class="col-sm-2" style="font-weight: bold;">Anterior</div>
            //         <div class="col-sm-3" style="font-weight: bold;">Nuevo Valor</div>
            //     </div>
            //     <hr>`
            // );

            // $.each(fila.variables, function (key, value) {
            //     var color = "";
            //     if (value.estados.length > 0) {
            //         if (value.estados[0].valor > value.max || value.estados[0].valor < value.min) {
            //             color = `red`
            //         }
            //         else {
            //             color = `blue`
            //         }

            //         $("#modal_variable_componente_cuerpo").append(`
            // <div class="row">
            //     <div class="col-sm-4" style="padding-top: 1%;">${value.nombre}</div>
            //     <div class="col-sm-1" style="padding-top: 1%;">${value.max}</div>
            //     <div class="col-sm-1" style="padding-top: 1%;">${value.min}</div>
            //     <div class="col-sm-1" style="padding-top: 1%;">${value.optimo}</div>
            //     <div class="col-sm-2" style="padding-top: 1%;color: ${color};">${parseFloat(value.estados[0].valor).toFixed(2)}</div>
            //     <div class="col-sm-3">
            //         <div class="input-group">
            //             <input id="inp_update_variable_${value.id}" value="${value.optimo}" onfocusout="componente.actualizaEstadoVariable('${mitabla[sala.activa].row(this).data()}', '${value.id}')" type="text" class="form-control" aria-label="...">
            //         </div><!-- /input-group -->

            //     </div>
            // </div>`
            //         );
            //         // $(`#inp_update_variable_${value.id}`).attr('idVariable', `${value.id}`);


            //     }
            // })

            $('#modal_variable_componente').modal('show');



        });

    };

    // Dibuja los componentes por DC
    drawByDC(e) {
        if (e == "false" || e == "") {
            return;
        }
        else {


            objComponente = JSON.parse(e);
            mitabla = [];

            if (!document.getElementById(`tb_${objComponente[0].idDataCenter}`)) {
                alert("no existe Sala");
            }
            else {
                $(`#tb_${objComponente[0].idDataCenter}`).empty();
                mitabla[objComponente[0].idDataCenter] = $(`#tb_${objComponente[0].idDataCenter}`).DataTable({
                    data: objComponente,
                    destroy: true,
                    "language": {
                        "infoEmpty": "Sin Productos Ingresados",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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
        }

        if (primerSala == true) {
            $(`#tb_${objComponente[0].idDataCenter} tbody`).on('click', 'tr', function () {
                objComponente;
                mitabla[objComponente[0].idDataCenter].rows;

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    mitabla[objComponente[0].idDataCenter].$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }

                var fila = mitabla[objComponente[0].idDataCenter].row(this).data();

                $("#modal_variable_componente_titulo").html(fila.nombre);
                $("#modal_variable_componente_cuerpo").empty();
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

                $.each(fila.variables, function (key, value) {
                    var color = "";
                    if (value.estados.length > 0) {
                        if (value.estados[0].valor > value.max || value.estados[0].valor < value.min) {
                            color = `red`
                        }
                        else {
                            color = `blue`
                        }

                        $("#modal_variable_componente_cuerpo").append(`
                        <div class="row">
                        <div class="col-sm-4" style="padding-top: 1%;">${value.nombre}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.max}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.min}</div>
                        <div class="col-sm-1" style="padding-top: 1%;">${value.optimo}</div>
                        <div class="col-sm-2" style="padding-top: 1%;color: ${color};">${parseFloat(value.estados[0].valor).toFixed(2)}</div>
                        <div class="col-sm-3">
                            <div class="input-group">
                                <input id="inp_update_variable_${value.id}" value="${value.optimo}" type="text" class="form-control" aria-label="...">
                            </div><!-- /input-group -->
    
                        </div>
                    </div>`
                        );
                    }
                })

                $('#modal_variable_componente').modal('show');
            });
        }



        tableActive = objComponente[0].idDataCenter;
    };

    clear() {
        $("#nombreComponente").val('');
        $("#dataCenters").val('');
        $("#salas").val('');
    }

    getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    Init() {
        var validator = new FormValidator({ "events": ['input']['select'] }, document.forms["frmComponentes"]);
        $('#frmComponentes').submit(function (e) {
            e.preventDefault();
            var validatorResult = validator.checkAll(this);
            if (validatorResult.valid)
                componente.create;
            return false;
        });
        //NProgress
        $(function () {
            $(document)
                .ajaxStart(NProgress.start)
                .ajaxStop(NProgress.done);
        });
    };


}
$(document).ready(function () {

    $("#btn_crea_inputs_reporte").click(function () {
        var fechaReporte = Math.round(new Date().getTime()/1000);
        arrayFechaReporte.push(fechaReporte);

        var titulo = $("#tituloReporte").val();
        $(".panel_reportes").append(
            `<div id="reporte${fechaReporte}" class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a id="titulo_${componente.id + "_" + fechaReporte}" data-toggle="collapse" data-parent="#accordion" href="#titulo_${fechaReporte}">${titulo}</a>
                    </h4>
                    <button id="remove${fechaReporte}" type="button" class="btn btn-round btn-info" >X</button>
                </div>
                <div id="titulo_${fechaReporte}" class="panel-collapse collapse">
                    <div class="panel-body">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="comment">Causa:</label>
                                <textarea id="causa_${componente.id + "_" + fechaReporte}" class="form-control" rows="5" id="comment"></textarea>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="comment">Solución:</label>
                                <textarea id="solucion_${componente.id + "_" + fechaReporte}" class="form-control" rows="5" id="comment"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        );
        $("#tituloReporte").val('');
    });

    $("#btn_guarda_estado_componente").click(function () {
        
        $.each(arrayFechaReporte, function( index, value ) {
            reportesComponente.dataCenter = componente.dataCenter;
            reportesComponente.id= componente.id;
            reportesComponente.titulo=$("#titulo_"+ componente.id + "_" + value).text();
            reportesComponente.causa=$("#causa_"+ componente.id + "_" + value).val();
            reportesComponente.solucion=$("#solucion_"+ componente.id + "_" + value).val();
            reportesComponente.fecha=value;
            arrayComponentes.push(reportesComponente); 
        });
    });

});



let componente = new Componente();
var objSalas = [];
var mitabla = [];
var tableActive;
var arrayComponentes = [];
var reportesComponente  = new Object;
var arrayFechaReporte = [reportesComponente];
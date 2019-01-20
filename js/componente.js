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


        // $(`#tb_${objComponente[0].idSala}`).empty();

        $(`#tb_${objComponente[0].idSala}`).DataTable({
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
                    "width": "10%",
                    data: null,
                    className: "center",
                    defaultContent: '<button class="btn-link"><i class="fa fa-check-circle-o" aria-hidden="true"></i></button>'
                },
                {
                    title: "idComponente",
                    data: "idComponente",
                    visible: false,
                    searchable: false
                },              
                {
                    title: "nombreComponente",
                    data: "nombreComponente",
                    "width": "40%",
                    visible: true
                },              
                {
                    title: "idSala",
                    data: "idSala",
                    visible: false,
                    searchable: false
                },              
                {
                    title: "nombreSala",
                    data: "nombreSala",
                    "width": "40%",
                    visible: true
                },
                {
                    title: "Acción",
                    "searchable": false,
                    "width": "10%",
                    data: null,
                    className: "center",
                    defaultContent: '<button class="btn-link remove"><i class="fa fa-check-circle" aria-hidden="true"></i>  Marcar todo OK</i></button>'
                }
            ]
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





/*

 $.each( objComponente, function( key, value ) {            
            var nomSala= (value.componente).replace(/ /g, "");            
            if (key == 0){
                $('#tab-panel-salas').append(`<div class="tab-pane fade in active" id="tab${nomSala.nombre}default">            
                    <div class="x_content">
                        <div class="table-responsive">
                            <table id="tb_sp" class="table table-striped jambo_table bulk_action">
                                <thead>
                                    <tr>
                                        <th>Nombre de Componente</th>
                                        <th>Estado Anterior</th>
                                        <th>Estado Actual</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    <tr>
                                        <th>Aire Acondicionado #4</th>
                                        <th>Reportado</th>
                                        <th>Apagado</th>
                                    </tr>
                                    <tr>
                                        <th>Aire Acondicionado #6</th>
                                        <th>OK</th>
                                        <th>OK</th>
                                    </tr>
                                    <tr>
                                        <th>Aire Acondicionado #8</th>
                                        <th>OK</th>
                                        <th>Apagado</th>
                                    </tr>
                                    <tr>
                                        <th>Aire Acondicionado #3</th>
                                        <th>Apagado</th>
                                        <th>OK</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`);
            }else{
                // $('#lst_DC').append(`<li><a href="#tab${nomSala.nombre}default" data-toggle="tab">${value.nombre}</a></li>`);

                // <li class="active"><a href="#tab${nomSala.nombre}default" data-toggle="tab">${value.nombre}</a></li>
            }

            
        });



        */
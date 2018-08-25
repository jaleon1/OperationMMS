class Monitoreo {
    // Constructor
    constructor(id, medicion, fecha) {
        this.id = id || null;
        this.medicion = medicion || '';
        this.fecha = fecha || '';
    }

    get tUpdate()  {
        return this.update ="update"; 
    }

    get tSelect()  {
        return this.select = "select";
    }

    set viewEventHandler(_t) {
        this.viewType = _t;        
    }

    //Getter
    get Read() {
        var miAccion = 'readEvent';
        //this.id == null ?  'ReadAll'  : 'Read';
        // if(miAccion=='ReadAll' && $('#tmonitoreo tbody').length==0 )
        //     return;
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: {
                action: miAccion,
                id: this.id
            }
        })
            .done(function (e) {
                monitoreo.Reload(e);
            })
            .fail(function (e) {
                monitoreo.showError(e);
            });
    }

    get Save() {
        $('#btnBodega').attr("disabled", "disabled");
        var miAccion = this.id == null ? 'Create' : 'Update';
        this.medicion = $("#medicion").val();
        this.fecha = $("#fecha").val();
        this.ubicacion = $("#ubicacion").val();
        this.contacto = $("#contacto").val();        
        this.telefono = $("#telefono").val();
        this.tipo = $('#tipo option:selected').val();
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(this)
            }
        })
            .done(monitoreo.showInfo)
            .fail(function (e) {
                monitoreo.showError(e);
            })
            .always(function () {
                $("#btnBodega").removeAttr("disabled");
                monitoreo = new Monitoreo();
                monitoreo.ClearCtls();
                monitoreo.Read;
                $("#medicion").focus();
            });
    }

    get Delete() {
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: {
                action: 'Delete',
                id: this.id
            }
        })
            .done(function () {
                swal({
                    //
                    type: 'success',
                    title: 'Eliminado!',
                    showConfirmButton: false,
                    timer: 1000
                });
            })
            .fail(function (e) {
                monitoreo.showError(e);
            })
            .always(function () {
                monitoreo = new Monitoreo();
                monitoreo.Read;
            });
    }

    get ListTipos() {
        var miAccion= 'ListTipos';
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: { 
                action: miAccion
            }
        })
        .done(function( e ) {
            monitoreo.ShowListTipo(e);
        })    
        .fail(function (e) {
            monitoreo.showError(e);
        })
        .always(function (e){
            $("#tipo").selectpicker("refresh");
        });
    }

    get List() {
        var miAccion= 'List';
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: { 
                action: miAccion
            }
        })
        .done(function( e ) {
            monitoreo.ShowList(e);
        })    
        .fail(function (e) {
            monitoreo.showError(e);
        })
        .always(function (e){
            $("#selbodega").selectpicker("refresh");
        });
    }

    get readByUser() {
        var miAccion = "readByUser";
        $.ajax({
            type: "POST",
            url: "class/monitoreo.php",
            data: {
                action: miAccion
            }
        })
            .done(function (e) {
                monitoreo.ShowAllD(e);
            })
            .fail(function (e) {
                monitoreo.showError(e);
            });
    }

    // Methods
    Reload(e) {
        if (this.id == null)
            this.ShowAll(e);
        else this.ShowItemData(e);
    };

    // Muestra información en ventana
    showInfo() {
        //$(".modal").css({ display: "none" });   
        $(".close").click();
        swal({
            
            type: 'success',
            title: 'Good!',
            showConfirmButton: false,
            timer: 1000
        });
    };

    // Muestra errores en ventana
    showError(e) {
        //$(".modal").css({ display: "none" });  
        var data = JSON.parse(e.responseText);
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Algo no está bien (' + data.code + '): ' + data.msg,
            footer: '<a href>Contacte a Soporte Técnico</a>',
        })
    };

    ClearCtls() {
        $("#id").val('');
        $("#medicion").val('');
        $("#fecha").val('');
        $("#ubicacion").val('');
        $("#contacto").val('');
        $("#telefono").val('');
        $('#tipo option').prop("selected", false);
    };

    ShowAll(e) {
        // revisa si el dt ya está cargado.
        var t= $('#tmonitoreo').DataTable();
         if(t.rows().count()==0){
            t.clear();
            t.rows.add(JSON.parse(e));
            t.draw();
            $( document ).on( 'click', '#tmonitoreo tbody tr td:not(.buttons)', monitoreo.viewType==undefined || monitoreo.viewType==monitoreo.tUpdate ? monitoreo.UpdateEventHandler : monitoreo.SelectEventHandler);
            $( document ).on( 'click', '.delete', monitoreo.DeleteEventHandler);
            $( document ).on( 'click', '.openView', monitoreo.OpenEventHandler);
         }else{
            t.clear();
            t.rows.add(JSON.parse(e));
            t.draw();
         }
    };

    ShowAllD(e) {
        b.clear();
        b.rows.add(JSON.parse(e));
        b.draw();
    };

    AddBodegaEventHandler(){
        monitoreo.id=$(this).find('td:eq(1)').html();
        monitoreo.medicion=$(this).find('td:eq(2)').html();
        monitoreo.fecha= $(this).find('td:eq(3)').html();
        monitoreo.tipo= $(this).find('td:eq(4)').html();
        //
        $('#medicion').val(monitoreo.medicion);
        $('#fecha').val(monitoreo.fecha);
        $('#tipo').val(monitoreo.tipo);
        $(".close").click();
    };

    OpenEventHandler() {
        // limpia dt
        var t= $('#tInsumo').DataTable();
        t.clear();
        t.draw();
        //
        insumobodega.idBodega = $(this).parents("tr").find(".itemId").text();  //Class itemId = ID del objeto.
        insumobodega.ReadByBodega;
        $(".bs-insumo-modal-lg").modal('toggle');
        $("#nombrebodega").text($(this).parents("tr").find("td:eq(1)").text());        
    };

    UpdateEventHandler() {
        monitoreo.id = $(this).parents("tr").find(".itemId").text() || $(this).find(".itemId").text();
        monitoreo.Read;
    };

    ShowItemData(e) {
        // Limpia el controles
        this.ClearCtls();
        // carga objeto.
        var data = JSON.parse(e)[0];
        monitoreo = new Monitoreo(data.id, data.medicion, data.fecha, data.ubicacion, data.contacto, data.telefono, data.tipo);
        // Asigna objeto a controles
        $("#id").val(monitoreo.id);
        $("#medicion").val(monitoreo.medicion);
        $("#myModalLabel").html('<h1>' + monitoreo.medicion + '<h1>' );
        $("#fecha").val(monitoreo.fecha);
        $("#ubicacion").val(monitoreo.ubicacion);
        $("#contacto").val(monitoreo.contacto);
        $("#telefono").val(monitoreo.telefono);
        //fk 
        $('#tipo option[value=' + monitoreo.tipo + ']').prop("selected", true);    
        $("#tipo").selectpicker("refresh");
        $(".bs-monitoreo-modal-lg").modal('toggle');
    };

    SelectEventHandler() {
        // Limpia el controles
        monitoreo.ClearCtls();
        // carga objeto.
        monitoreo= new Monitoreo();
        monitoreo.id = $(this).parents("tr").find(".itemId").text() || $(this).find(".itemId").text();
        monitoreo.medicion = $(this).parents("tr").find("td:eq(1)").text() || $(this).find("td:eq(1)").text();
        monitoreo.fecha = $(this).parents("tr").find("td:eq(2)").text() || $(this).find("td:eq(2)").text();
        monitoreo.tipo = $(this).parents("tr").find("td:eq(3)").text() || $(this).find("td:eq(3)").text();
        // Asigna objeto a controles
        $("#medicion").val(monitoreo.medicion);
        $("#fecha").val(monitoreo.fecha);
        $("#tipo").val(monitoreo.tipo);
        // oculta el modal   
        $(".bs-monitoreo-modal-lg").modal('toggle');
        if(monitoreo.tipo=='Interna')
            $("#frmTotales").hide();
        else
            $("#frmTotales").show(); 
    };

    ShowListTipo(e) {
        // carga lista con datos.
        var data = JSON.parse(e);
        // Recorre arreglo.
        $.each(data, function (i, item) {
            $('#tipo').append(`
                <option value=${item.id}>${item.medicion}</option>
            `);
        })
    };

    ShowList(e) {
        // carga lista con datos.
        var data = JSON.parse(e);
        // Recorre arreglo.
        $.each(data, function (i, item) {
                $('#selbodega').append(`
                    <option value=${item.id}>${item.medicion}</option>
                `);
        })
    };

    DeleteEventHandler() {
        monitoreo.id = $(this).parents("tr").find(".itemId").text();  //Class itemId = ID del objeto.
        // Mensaje de borrado:
        swal({
            title: 'Eliminar?',
            text: "Esta acción es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                monitoreo.Delete;
            }
        })
    };

    setTable(buttons=true){
        $('#tmonitoreo').DataTable({
            responsive: true,
            info: false,
            pageLength: 10,
            "order": [[ 1, "asc" ]],
            "language": {
                "infoEmpty": "Sin Usuarios Registrados",
                "emptyTable": "Sin Usuarios Registrados",
                "search": "Buscar",
                "zeroRecords":    "No hay resultados",
                "lengthMenu":     "Mostar _MENU_ registros",
                "paginate": {
                    "first":      "Primera",
                    "last":       "Ultima",
                    "next":       "Siguiente",
                    "previous":   "Anterior"
                }
            },
            columns: [
                {
                    title: "id",
                    data: "id",
                    className: "itemId",                    
                    searchable: false
                },
                { title: "Nombre", data: "medicion" },
                { title: "Descripción", data: "fecha" },
                { title: "Tipo", data: "tipo" },
                {
                    title: "Acción",
                    orderable: false,
                    searchable:false,
                    visible: buttons,
                    className: "buttons",
                    width: '5%',
                    mRender: function () {
                        return '<a class="delete" style="cursor: pointer;"> <i class="glyphicon glyphicon-trash"> </i> </a> | <a class="openView" style="cursor: pointer;"> <i class="glyphicon glyphicon-eye-open"> </i>  </a>' 
                    }
                }
            ]
        });
    }

    Init() {
        // validator.js
//         var validator = new FormValidator({ "events": ['blur', 'input', 'change'] }, document.forms["frmMonitoreo"]);
//         $('#frmMonitoreo').submit(function (e) {
//             e.preventDefault();
//             var validatorResult = validator.checkAll(this);
//             if (validatorResult.valid)
//                 monitoreo.Save;
//             return false;
//         });
//         // on form "reset" event
//         document.forms["frmMonitoreo"].onreset = function (e) {
//             validator.reset();
//         }
        $('#reload').click(function () {
            location.reload();
        });
        //NProgress
        $(function()
        {
            $(document)
                .ajaxStart(NProgress.start)
                .ajaxStop(NProgress.done);
        });

    };
}

let monitoreo = new Monitoreo();
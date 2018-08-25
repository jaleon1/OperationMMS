class Tipo {
    // Constructor
    constructor(id, nombre, unidad, alto, bajo) {
        this.id = id || null;
        this.nombre = nombre || '';
        this.unidad = unidad || '';
        this.alto= alto || '';
        this.bajo= bajo || '';
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
        var miAccion = 'readEvents';
        this.id= 1;
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: {
                action: miAccion,
                id: this.id
            }
        })
            .done(function (e) {
                tipo.Reload(e);
            })
            .fail(function (e) {
                tipo.showError(e);
            });
    }

    get readEvents() {
        var miAccion = 'readEvents';
        this.id= 5;
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: {
                action: miAccion,
                id: this.id
            }
        })
            .done(function (e) {
                tipo.showEvents(e);
            })
            .fail(function (e) {
                tipo.showError(e);
            });
    }

    get Save() {
        $('#btnBodega').attr("disabled", "disabled");
        var miAccion = this.id == null ? 'Create' : 'Update';
        this.nombre = $("#nombre").val();
        this.unidad = $("#unidad").val();
        this.alto = $("#alto").val();
        this.bajo = $("#bajo").val();        
        this.telefono = $("#telefono").val();
        this.tipo = $('#tipo option:selected').val();
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(this)
            }
        })
            .done(tipo.showInfo)
            .fail(function (e) {
                tipo.showError(e);
            })
            .always(function () {
                $("#btnBodega").removeAttr("disabled");
                tipo = new Tipo();
                tipo.ClearCtls();
                tipo.Read;
                $("#nombre").focus();
            });
    }

    get Delete() {
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
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
                tipo.showError(e);
            })
            .always(function () {
                tipo = new Tipo();
                tipo.Read;
            });
    }

    get ListTipos() {
        var miAccion= 'ListTipos';
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: { 
                action: miAccion
            }
        })
        .done(function( e ) {
            tipo.ShowListTipo(e);
        })    
        .fail(function (e) {
            tipo.showError(e);
        })
        .always(function (e){
            $("#tipo").selectpicker("refresh");
        });
    }

    get List() {
        var miAccion= 'List';
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: { 
                action: miAccion
            }
        })
        .done(function( e ) {
            tipo.ShowList(e);
        })    
        .fail(function (e) {
            tipo.showError(e);
        })
        .always(function (e){
            $("#selbodega").selectpicker("refresh");
        });
    }

    get readByUser() {
        var miAccion = "readByUser";
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: {
                action: miAccion
            }
        })
            .done(function (e) {
                tipo.ShowAllD(e);
            })
            .fail(function (e) {
                tipo.showError(e);
            });
    }

    // Methods
    Reload(e) {
        if (this.id == null)
            this.ShowAll(e);
        else this.ShowItemData(e);
    };

    showEvents(e){
        //var data = JSON.parse(e);
        var d3 = [[0, 17], [2, 15], [4,16], [6, 14], [8, 18]];
        var d4 = [[0, 15], [2, 10], [4,8],  [6, 6], [8, 13]];
        var d5 = [[0, 25], [2, 20], [4,25],  [6, 20], [8, 25]];
        var data = [];
        if ($("#chart_plot_01").length) {
            $.plot($("#chart_plot_01"), [d3, d4, d5], chart_plot_01_settings);
        }
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
        $("#nombre").val('');
        $("#unidad").val('');
        $("#alto").val('');
        $("#bajo").val('');
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
            $( document ).on( 'click', '#tmonitoreo tbody tr td:not(.buttons)', tipo.viewType==undefined || tipo.viewType==tipo.tUpdate ? tipo.UpdateEventHandler : tipo.SelectEventHandler);
            $( document ).on( 'click', '.delete', tipo.DeleteEventHandler);
            $( document ).on( 'click', '.openView', tipo.OpenEventHandler);
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
        tipo.id=$(this).find('td:eq(1)').html();
        tipo.nombre=$(this).find('td:eq(2)').html();
        tipo.unidad= $(this).find('td:eq(3)').html();
        tipo.tipo= $(this).find('td:eq(4)').html();
        //
        $('#nombre').val(tipo.nombre);
        $('#unidad').val(tipo.unidad);
        $('#tipo').val(tipo.tipo);
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
        tipo.id = $(this).parents("tr").find(".itemId").text() || $(this).find(".itemId").text();
        tipo.Read;
    };

    ShowItemData(e) {
        // Limpia el controles
        this.ClearCtls();
        // carga objeto.
        var data = JSON.parse(e)[0];
        tipo = new Tipo(data.id, data.nombre, data.unidad, data.alto, data.bajo, data.telefono, data.tipo);
        // Asigna objeto a controles
        $("#id").val(tipo.id);
        $("#nombre").val(tipo.nombre);
        $("#myModalLabel").html('<h1>' + tipo.nombre + '<h1>' );
        $("#unidad").val(tipo.unidad);
        $("#alto").val(tipo.alto);
        $("#bajo").val(tipo.bajo);
        $("#telefono").val(tipo.telefono);
        //fk 
        $('#tipo option[value=' + tipo.tipo + ']').prop("selected", true);    
        $("#tipo").selectpicker("refresh");
        $(".bs-tipo-modal-lg").modal('toggle');
    };

    SelectEventHandler() {
        // Limpia el controles
        tipo.ClearCtls();
        // carga objeto.
        tipo= new Tipo();
        tipo.id = $(this).parents("tr").find(".itemId").text() || $(this).find(".itemId").text();
        tipo.nombre = $(this).parents("tr").find("td:eq(1)").text() || $(this).find("td:eq(1)").text();
        tipo.unidad = $(this).parents("tr").find("td:eq(2)").text() || $(this).find("td:eq(2)").text();
        tipo.tipo = $(this).parents("tr").find("td:eq(3)").text() || $(this).find("td:eq(3)").text();
        // Asigna objeto a controles
        $("#nombre").val(tipo.nombre);
        $("#unidad").val(tipo.unidad);
        $("#tipo").val(tipo.tipo);
        // oculta el modal   
        $(".bs-tipo-modal-lg").modal('toggle');
        if(tipo.tipo=='Interna')
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
                <option value=${item.id}>${item.nombre}</option>
            `);
        })
    };

    ShowList(e) {
        // carga lista con datos.
        var data = JSON.parse(e);
        // Recorre arreglo.
        $.each(data, function (i, item) {
                $('#selbodega').append(`
                    <option value=${item.id}>${item.nombre}</option>
                `);
        })
    };

    DeleteEventHandler() {
        tipo.id = $(this).parents("tr").find(".itemId").text();  //Class itemId = ID del objeto.
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
                tipo.Delete;
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
                { title: "Nombre", data: "nombre" },
                { title: "Descripción", data: "unidad" },
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
//                 tipo.Save;
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
        // configuracion del plot
        chart_plot_01_settings = {
            series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2
            },
            grid: {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#fff'
            },
            colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
            xaxis: {
            tickColor: "rgba(51, 51, 51, 0.06)",
            mode: "time",
            tickSize: [1, "day"],
            //tickLength: 10,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
            },
            yaxis: {
            ticks: 8,
            tickColor: "rgba(51, 51, 51, 0.06)",
            },
            tooltip: true
        }

    };
}
var chart_plot_01_settings;
let tipo = new Tipo();
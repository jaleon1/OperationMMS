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
        var listaIds= $('#tipo option:selected').map(function () { return this.value; }).get();
        ts =  moment().unix(); // timestamp actual
        $.ajax({
            type: "POST",
            url: "class/tipo.php",
            data: {
                action: miAccion,
                listaIds: JSON.stringify(listaIds),
                ts: ts
            }
        })
            .done(function (e) {
                tipo.showEvents(e);
                rt = setTimeout(function(){ tipo.readEvents; }, 2000);
            })
            .fail(function (e) {
                //tipo.showError(e);
            });
    }

    get readEventsRT() {
        var miAccion = 'readEvents';
        var listaIds= $('#tipo option:selected').map(function () { return this.value; }).get();
        
        $.ajax({
            type: "POST",
            url: "class/tipo.php", 
            data: {
                action: miAccion,
                listaIds: JSON.stringify(listaIds),
                ts: ts
            }
        })
            .done(function (e) {
                tipo.updateEvents(e);
                rt = setTimeout(function(){ tipo.readEventsRT; }, 2000);
            })
            .fail(function (e) {
                //tipo.showError(e);
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
        var data = JSON.parse(e);
        series = data[1]; // event array.
        if ($("#chart_plot_01").length) {
            plot= $.plot($("#chart_plot_01"),  series,
                chart_plot_01_settings
            );
        }        
        // ultima toma
        ts= series[0];
        // debe recorrer los componentes seleccionados y desplegar los rangos, el % de cambio y el gauge.
        $.each(data[0], function (i, item) {
            // rangos
            if (i==0)
                var range=  $("#range_paramA").data("ionRangeSlider");
            else if (i==1)
                var range=  $("#range_paramB").data("ionRangeSlider");
            else if (i==2)
                var range=  $("#range_paramC").data("ionRangeSlider");
           range.update({
                type: "double",
                min: 0,
                max: 1.2,
                from: parseFloat(item.bajo),
                to: parseFloat(item.alto),
                step: 0.1,
                grid: true,
                grid_snap: true
            });
            // encabezado valor actual.
            var ultima= parseFloat(item.ultMedicion);
            if (i==0){
                $('#paramCA')[0].textContent = ultima;
                if(ultima<parseFloat(item.bajo))
                    $('#paramCA').addClass('red');
                else $('#paramCA').removeClass('red');
            }
            else if (i==1){
                $('#paramCB')[0].textContent = ultima;     
                if(ultima<parseFloat(item.bajo))
                    $('#paramCB').addClass('red');
                else $('#paramCB').removeClass('red');  
            }
            else if (i==2){
                $('#paramCC')[0].textContent = ultima;
                if(ultima<parseFloat(item.bajo))
                    $('#paramCC').addClass('red');
                else $('#paramCC').removeClass('red');
            }
            anterior= ultima;
            // actualiza GAUGE.
            var chart_gauge_elem;
            var chart_gauge;
            var txt;            
            //
            if (i==0){
                chart_gauge_elem = document.getElementById('chart_gauge_a');
                txt= document.getElementById("gauge-text-A");                
            }
            else if (i==1){
                chart_gauge_elem = document.getElementById('chart_gauge_b');
                txt= document.getElementById("gauge-text-B");                
            }
            else if (i==2){
                chart_gauge_elem = document.getElementById('chart_gauge_c');
                txt= document.getElementById("gauge-text-C");
            }
            if(ultima<parseFloat(item.bajo))
                chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings_err);
            else chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings); 
            //
            if(ultima>parseFloat(item.alto))
                ultima = 100;
            else if(ultima<parseFloat(item.bajo))
                ultima = 0;
            else ultima= ultima*100/parseFloat(item.alto);
            //            
            chart_gauge.maxValue = 100;
            chart_gauge.setMinValue(1);
            chart_gauge.animationSpeed = 10;
            chart_gauge.set(ultima);
            chart_gauge.setTextField(txt);   
            
        });

        // pendiente por hacer la consulta filtrada por fechas usando el control de fechas: reportrange.


        // actualemente el gráfico trae toda las filas de la tabla, falta un método que traiga solo la última medición y actualice los gráficos.

    };

    updateEvents(e){
        var data = JSON.parse(e);
        var nuevaSerie = data[1];
        var tam = nuevaSerie[0].data.length;
        if(tam==0) return;
        //
        //series[0].data = series[0].data.slice(tam);
        //series[0].data= series[0].data.concat(nuevaSerie[0].data);         
        $.each(nuevaSerie[0].data, function (i, item) {
            //series[0].data = series[0].data.slice(1);
            //if(series[0].data.length>1 )
            series[0].data = series[0].data.slice(1);
            var res = [];
			$.each(series[0].data, function (i, x) {
				res.push([i, x[1]])
			});
            res.push([res.length, item[1]]);
            series[0].data= res;
            //
            plot.setData(series);
            //plot.setupGrid();
            plot.draw();
            setTimeout(function(){
                    var a=0;                   
                 }, 100);
//             plot= $.plot($("#chart_plot_01"),  series,
//                 chart_plot_01_settings
//             );            
        });
        // debe recorrer los componentes seleccionados y desplegar los rangos, el % de cambio y el gauge.
        $.each(data, function (i, item) {
            $.each(item, function (i, comp) {
                // componente
                //tipo= new Tipo(comp.id, comp.nombre, comp.unidad, comp.alto, comp.bajo);
                // última medición.     
                ts= moment().unix(comp.lasq);  
                var ultima= comp[item.length-1]; 
                var pMedicion= ultima/tipo.max*100;
                // rangos
                if (i==0)
                    var range=  $("#range_paramA");
               range.ionRangeSlider({
                    type: "double",
                    min: 0.6,
                    max: 1.2,
                    from: comp.bajo,
                    to: comp.alto,
                    step: 0.1,
                    grid: true,
                    grid_snap: true
                });	
                // actualiza control.
//                 var chart_gauge_elem;
//                 if (i==0)
//                     chart_gauge_elem = document.getElementById('chart_gauge_a');
//                 var chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings);
//                 chart_gauge.maxValue = 100;
//                 chart_gauge.animationSpeed = 32;
//                 chart_gauge.set(pMedicion);
//                 chart_gauge.setTextField(document.getElementById("gauge-text"));   


            });
        });

        // pendiente por hacer la consulta filtrada por fechas usando el control de fechas: reportrange.


        // actualemente el gráfico trae toda las filas de la tabla, falta un método que traiga solo la última medición y actualice los gráficos.

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
        //
        // tipo.id= $('#tipo').val();
        // $('#tipo').change(function(){
        //     tipo.id=this.value;
        //     //tipo.readEvents;
        // });
        $('#btnIniciar').click(function(){
            tipo.readEvents;
            //rt= true;
        });
        $('#btnDetener').click(function(){
            clearTimeout(rt);
        });
        // gauge
        chart_gauge_settings = {
            lines: 12,
            angle: 0,
            lineWidth: 0.4,
            pointer: {
                length: 0.75,
                strokeWidth: 0.042,
                color: '#1D212A'
            },
            limitMax: 'false',
            colorStart: '#1ABC9C',
            colorStop: '#1ABC9C',
            strokeColor: '#F0F3F3',
            generateGradient: true
        };
        chart_gauge_settings_err = {
            lines: 12,
            angle: 0,
            lineWidth: 0.4,
            pointer: {
                length: 0.75,
                strokeWidth: 0.042,
                color: '#1D212A'
            },
            limitMax: 'false',
            colorStart: '#CF2B25',
            colorStop: '#CF644F',
            strokeColor: '#F0F3F3',
            generateGradient: true
        }; 
        //
        var chart_gauge_elem = document.getElementById('chart_gauge_a');
        var chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings);
        chart_gauge.maxValue = 100;
        chart_gauge.animationSpeed = 32;
        chart_gauge.set(0);
        chart_gauge.setTextField(document.getElementById("gauge-text"));
        //
        chart_gauge_elem = document.getElementById('chart_gauge_b');
        chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings);
        chart_gauge.maxValue = 100;
        chart_gauge.animationSpeed = 32;
        chart_gauge.set(0);
        chart_gauge.setTextField(document.getElementById("gauge-text"));
        //
        chart_gauge_elem = document.getElementById('chart_gauge_c');
        chart_gauge = new Gauge(chart_gauge_elem).setOptions(chart_gauge_settings);
        chart_gauge.maxValue = 100;
        chart_gauge.animationSpeed = 32;
        chart_gauge.set(0);
        chart_gauge.setTextField(document.getElementById("gauge-text"));
        //configuracion del plot
        chart_plot_01_settings = {
            series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.1,
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
                tickSize: [1, "second"],
                tickLength: 10,
                axisLabel: "Fq",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 10
            },
            yaxis: {
                ticks: 8,
                tickColor: "rgba(51, 51, 51, 0.06)",
                display: true,
            },
            tooltip: true,
            zoom: {
				interactive: true
			},
			pan: {
				interactive: true
            },
            
            /////////////////
            legend: {
                show: true,
                // labelBoxBorderColor: "red",
                // position: "ne" or "nw" or "se" or "sw"
                // margin: number of pixels or [x margin, y margin]
                backgroundColor: "black",
                backgroundOpacity: 0.5
            }
        }
        if( typeof ($.fn.ionRangeSlider) === 'undefined'){ return; }
        //console.log('init_IonRangeSlider');
        $("#range_paramA").ionRangeSlider({
            type: "double",
            min: 0,
            max: 0,
            from: 0,
            to: 0,
            step: 0,
            grid: true,
            grid_snap: true
        });	
        $("#range_paramB").ionRangeSlider({
            type: "double",
            min: 0,
            max: 0,
            from: 0,
            to: 0,
            step: 0,
            grid: true,
            grid_snap: true
        });	
        $("#range_paramC").ionRangeSlider({
            type: "double",
            min: 0,
            max: 0,
            from: 0,
            to: 0,
            step: 0,
            grid: true,
            grid_snap: true
        });	

    };
}

$(function() {
  
    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ////////////////////////
        buttonClasses: ['btn2', 'btn-sm2'],
        applyButtonClasses: 'btn-primary2',
        cancelButtonClasses: 'btn-default2',
        separator: ' to ',
        locale: {
            applyLabel: 'Solicitar',
            cancelLabel: 'Cancelar',
            fromLabel: 'Desde',
            toLabel: 'hasta',
            customRangeLabel: 'Personalizado',
            daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi','Sa'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            firstDay: 1
        },
        //////////////////////// 
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

});

$('#reportrange').on('apply.daterangepicker', function(ev, picker) {
    alert("ok");
    console.log(picker.startDate.format('YYYY-MM-DD'));
    console.log(picker.endDate.format('YYYY-MM-DD'));
  });


var anterior=0;
var rt= false;
var ts;
var series;
var plot;
var chart_gauge_settings;
var chart_gauge_settings_err;
var chart_plot_01_settings;
let tipo = new Tipo();
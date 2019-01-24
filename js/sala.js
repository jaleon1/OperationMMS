class Sala {
    // Constructor
    constructor(id, idDataCenter, nombre) {
        this.id = id || null;
        this.idDataCenter = idDataCenter || '';
        this.nombre = nombre || '';
    }

    //Getter
    get ReadbyDC() {
        var miAccion = 'ReadbyDC';
        
        $.ajax({
            type: "POST",
            url: "class/sala.php",
            data: {
                action: miAccion,
                idDataCenter: dataCenter.id
            }
        })
            .done(function (e) {
                sala.draw(e);
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
                sala.ShowItemData(e);
            })
            .fail(function (e) {
                // sala.showError(e);
            })
            .always(function () {
                
            });
    }

    ShowItemData(e) {
        // carga objeto.
        var data = JSON.parse(e);
        // carga Data Centers
        // $.each(data, function(i, item){
        //     $('#dataCenters option[value=' + item.id + ']').prop("selected", true);
        // });

        $.each(data, function() {
            $("#dataCenters").append($("<option />").val(data.id).text(data.nombre));
        });

        // $("#dataCenters").selectpicker("refresh");
    };

    get create(){
        $('#btnGuardar').attr("disabled", "disabled");
        var miAccion = this.id == null ? 'create' : 'update';
        this.nombre = $("#nombre").val();
        this.ubicacion = $("#ubicacion").val();

        $.ajax({
            type: "POST",
            url: "class/dataCenter.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(this)
            }
        })
            .done(function (e) {
                alert("OK");
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            })
            .always(function () {
                sala.clear();
                $('#btnGuardar').attr("disabled", false);
            });
        
    }

    // Methods
    draw(e) {
        var objSala = JSON.parse(e);

        $("#lst_DC").empty();
        $("#tab-panel-salas").empty();
        $.each( objSala, function( key, itemSala ) {
            var nomSala= itemSala.nombre.replace(/ /g, "")
            if (key == 0){
                $('#lst_Salas').append(`<li class="active"><a href="#tab_${itemSala.id}" data-toggle="tab">${itemSala.nombre}</a></li>`);

                $('#tab-panel-salas').append(`<div class="tab-pane fade in active" id="tab_${itemSala.id}">            
                    <div class="x_content">
                        <div class="table-responsive">
                            <table id="tb_${itemSala.id}" class="table table-striped jambo_table bulk_action">
                                
                            </table>                            
                        </div>
                    </div>
                </div>`);
            }else{
                $('#lst_Salas').append(`<li><a href="#tab_${itemSala.id}" data-toggle="tab">${itemSala.nombre}</a></li>`);

                $('#tab-panel-salas').append(`<div class="tab-pane fade" id="tab_${itemSala.id}">            
                    <div class="x_content">
                        <div class="table-responsive">
                            <table id="tb_${itemSala.id}" class="table table-striped jambo_table bulk_action" style="width: 100%;">
                                
                            </table>
                        </div>
                    </div>
                </div>`);
            }

            sala.id = itemSala.id;
            componente.ReadbySala;    
            
        });
        
    };

    clear(){
        $("#nombre").val('');
        $("#dataCenter").val('');
    }

    Init() {
        var validator = new FormValidator({ "events": ['input'] }, document.forms["frmSalas"]);
        $('#frmSalas').submit(function (e) {
            e.preventDefault();
            var validatorResult = validator.checkAll(this);
            if (validatorResult.valid)
                sala.create;
            return false;
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

let sala = new Sala();
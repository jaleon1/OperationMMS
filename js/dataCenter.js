class DataCenter {
    // Constructor
    constructor(id, nombre, ubicacion) {
        this.id = id || null;
        this.nombre = nombre || '';
        this.ubicacion = ubicacion || '';
    }

    //Getter
    get ReadAll() {
        var miAccion = 'ReadAll';
        
        $.ajax({
            type: "POST",
            url: "class/dataCenter.php",
            data: {
                action: miAccion
            }
        })
            .done(function (e) {
                dataCenter.draw(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

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
                dataCenter.clear();
                $('#btnGuardar').attr("disabled", false);
            });
        
    }

    // Methods
    draw(e) {
        var objDataCenter = JSON.parse(e);

        $("#lst_DC").empty();
        $("#tab-panel-componentes").empty();

        $.each( objDataCenter, function( key, itemDC ) {
            if (key == 0){
                $('#lst_DC').append(`<li class="active"><a href="#tab_${itemDC.id}" data-toggle="tab">${itemDC.nombre}</a></li>`);
                
                $('#tab-panel-componentes').append(`<div class="tab-pane fade in active" id="tab_${itemDC.id}">            
                    <div class="x_content">
                        <div class="table-responsive">
                            <table id="tb_${itemDC.id}" class="table table-striped jambo_table bulk_action">
                                
                            </table>                            
                        </div>
                    </div>
                </div>`);
            
            }else{
                $('#lst_DC').append(`<li><a href="#tab_${itemDC.id}" data-toggle="tab">${itemDC.nombre}</a></li>`);

                $('#tab-panel-componentes').append(`<div class="tab-pane fade" id="tab_${itemDC.id}">            
                    <div class="x_content">
                        <div class="table-responsive">
                            <table id="tb_${itemDC.id}" class="table table-striped jambo_table bulk_action" style="width: 100%;">
                                
                            </table>
                        </div>
                    </div>
                </div>`);
            }        
            dataCenter.id = itemDC.id;
            componente.ReadbyDC; 
        });   
    };

    clear(){
        $("#nombre").val('');
        $("#ubicacion").val('');
    }

    Init() {
        var validator = new FormValidator({ "events": ['input'] }, document.forms["frmDataCenters"]);
        $('#frmDataCenters').submit(function (e) {
            e.preventDefault();
            var validatorResult = validator.checkAll(this);
            if (validatorResult.valid)
                dataCenter.create;
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

let dataCenter = new DataCenter();
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


    // Methods
    draw(e) {
        var objDataCenter = JSON.parse(e);

        $("lst_DC").empty();

        $.each( objDataCenter, function( key, value ) {
            if (key == 0){
                $('#lst_DC').append(`<li class="active"><a href="#tab${key}default" data-toggle="tab">${value.nombre}</a></li>`);
            }else{
                $('#lst_DC').append(`<li><a href="#tab${key}default" data-toggle="tab">${value.nombre}</a></li>`);
            }
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

let dataCenter = new DataCenter();
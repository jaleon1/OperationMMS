class Variable {
    // Constructor
    constructor(id, idComponente, nombre, estado, valor) {
        this.id = id || null;
        this.estado = estado || null;
        this.valor = valor || null;
        this.idComponente = idComponente || '';
        this.nombre = nombre || '';
    }

    //Getter
    get ReadbyComponente() {
        var miAccion = 'ReadbyComponente';
        
        $.ajax({
            type: "POST",
            url: "class/variable.php",
            data: {
                action: miAccion,
                idComponente: componente.id
            }
        })
            .done(function (e) {
                variable.draw(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    

    // Methods
    draw(e) {
        
    };

    nuevoEstadoVariable(id, idComponente, reportar) {
        variable.valor = document.getElementById(`inp_update_variable_${id}`).value;
        variable.id = id;
        variable.idComponente = idComponente
        // alert(id + reportar + nuevoValor);
        var miAccion = 'nuevoEstadoVariable';
        
        $.ajax({
            type: "POST",
            url: "class/variable.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(variable),
                reportar: reportar
            }
        })
            .done(function (e) {
                if (e=="200"){Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Valor Actualizado',
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });

    }

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

let variable = new Variable();
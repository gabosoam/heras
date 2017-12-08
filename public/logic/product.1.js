

$('#btnPrin').hide();

$("#save").on("click", function () {

    save();

});
var bill;


function generateBarcode() {
    $.get("/generateBarcode", function (data) {

        $('#barcode').val(data[0].barcode);

    });
}

$("#saveModel").on("click", function () {
    if (validatorModel.validate()) {
        saveModel();
    }
});

$("#closeBill").on("click", function () {


    if (userBill == userSession) {
        const confirmation = confirm('Al cerrar el ingreso ya no se podrá agregar ni eliminar productos a esta orden \n ¿Desea continuar?');
        if (confirmation) {
            $.post("/bill/close", { code: bill }, function (data) {
                if (data.affectedRows > 0) {
                    location.href = "/bill/" + bill;

                } else {

                }
            });
        } else {

        }
    } else {
        alert('Sólo el usuario ' + user + ' puede cerrar el ingreso');
    }


});

$('#barcode').keypress(function (e) {
    if (e.which == 13) {
        if ($(this).val() != '') {
            save();

        } else {

        }

    }
});

$('#code2').keypress(function (e) {
    if (e.which == 13) {

        if ($('#code2').val() != '') {
            $.ajax({
                type: 'GET',
                url: '/model/' + $(this).val(),
                success: sendData
            });
        }
    }
});



function sendData2(data) {
    if (data.length > 0) {
        $('#modelProduct').val(data[0].id)

    } else {
        var r = confirm("El producto con el código " + $('#code2').val() + " no existe \n ¿Desea agregarlo?");
        if (r == true) {
            $('#myModal').modal('show');
            $('#codeModal').val($('#code2').val());
        } else {
            alert('not okay');
        }
    }

}

function save() {
    var barcode = $('#barcode').val();
    if (barcode == '') {
        swal(
            'Existió un error!',
            'Ingrese el código de barras!'
        )
        $('#barcode').focus()
    } else {
        var data = {
            bill: bill,
            variant: $('#nameProduct').val(),
            unit: $('#cbxunit2').val(),
            location: $('#location2').val(),
            barcode: $('#barcode').val().toUpperCase(),
            cant: 1
        }
        swal({
            //position: 'top',
            title: $('#nameProduct').data('kendoComboBox').text(),
            text: data.cant + " " + $('#cbxunit2').data('kendoDropDownList').text() + "(s)",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Registrar ingreso',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                $.post("/product/createproduct", data, function (data) {
                    if (data.affectedRows == 1) {
                        swal(
                            'Ingreso registrado!',
                            'El producto ha sido ingresado en la bodega',
                            'success'
                        )

                        $('#grid2').data('kendoGrid').dataSource.read();
                        $('#grid2').data('kendoGrid').refresh();
                    } else {
                        swal(
                            'Error en el ingreso!',
                            'El producto no ha podido ser ingresado en la bodega',
                            'error'
                        )
                    }
                });



            }
        })

    }

}

function saveModel() {

    var data = $('#formSaveModel').serialize();
    var data2 = $('#formSaveModel').serializeArray();


    $.post("/model/create", data, function (info) {

        if (info) {
            $('#nameProduct').data('kendoComboBox').dataSource.read();
            $('#nameProduct').data('kendoComboBox').refresh();

            $.ajax({
                type: 'GET',
                url: '/model/' + data2[0].value,
                success: sendData
            });
            $('#myModal').modal('toggle');
            $('#formSaveModel')[0].reset();

        } else {


        }



    });
}

$(document).ready(function () {

    dataSourceCombo = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/model/readsell",
                dataType: "json"
            }
        }
    });

    dataSourceProvider = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/provider/read",
                dataType: "json"
            }
        }
    });



    dataSourceLocation = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/location/read",
                dataType: "json"
            }
        }
    });

    dataSourceBrand = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/brand/read",
                dataType: "json"
            }
        }
    });

    dataSourceCategory = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/category/read",
                dataType: "json"
            }
        }
    });

    dataSourceUnit = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/unit/readsell",
                dataType: "json"
            }
        }
    });

    dataSourceUnit2 = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/unit/readsell2",
                dataType: "json"
            }
        }
    });


    $("#nameProduct").kendoComboBox({
        dataSource: dataSourceCombo,
        filter: "contains",
        dataTextField: "description",
        dataValueField: "id",
        placeholder: "Escribe el nombre de un producto por ejemplo: carne...",
        minLength: 1,
        change: onChange
    });

    $("#nameProvider").kendoComboBox({
        dataSource: dataSourceProvider,
        filter: "contains",
        dataTextField: "name",
        dataValueField: "id",
        placeholder: "Escribe el nombre de un proveedor por ejemplo: Luis...",
        minLength: 1
    });

    $("#cbxunit").kendoDropDownList({
        dataSource: dataSourceUnit,

        dataTextField: "description",
        dataValueField: "id",

    });

    $("#cbxunit2").kendoDropDownList({
        dataSource: dataSourceUnit2,

        dataTextField: "description",
        dataValueField: "id",

    });

    function onChange(e) {
        var code = this.value();

        $.get("/model/readsell/" + code, function (data) {

            console.log(data);

            if (data[0].idDecimal == 1) {
                $('#idDecimal').removeClass('hidden');
                $('#units').addClass('hidden');
                $('#cantProduct').focus()
            } else {
                $('#idDecimal').addClass('hidden');
                $('#units').removeClass('hidden');
            }
        });
    };



    $("#location").kendoDropDownList({
        dataSource: dataSourceLocation,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar Ubicación",
        minLength: 1

    });

    $("#location2").kendoDropDownList({
        dataSource: dataSourceLocation,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar Ubicación",
        minLength: 1

    });

    $("#brand").kendoDropDownList({
        dataSource: dataSourceBrand,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar Ubicación",
        minLength: 1

    });

    $("#category").kendoDropDownList({
        dataSource: dataSourceCategory,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar Ubicación",
        minLength: 1

    });





    $("#unit").kendoDropDownList({
        dataSource: dataSourceUnit,
        editable: false,
        dataTextField: "smallDescription",
        dataValueField: "id",
        title: "Seleccionar Ubicación",
        minLength: 1

    });
    $('#formSaveModel')[0].reset();

    function userNameAutoCompleteEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoAutoComplete({
                dataSource: dataSourceCombo,
                placeholder: "Busca un producto",
                dataTextField: "description",
                filter: "contains",
                minLength: 1
            });
    }

    function editNumberWithoutSpinners(container, options) {
        $('<input data-text-field="' + options.field + '" ' +
            'data-value-field="' + options.field + '" ' +
            'data-bind="value:' + options.field + '" ' +
            'data-format="' + options.format + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                spinners: false
            });
    }

  

   





})

function saveProvider() {
    if ($('#nameProvider').val()!='') {
        var body = {
            provider: $('#nameProvider').val(),
            user: idUser
    
        }
        $.post("/bill/createbuy", body, function (data) {
            if (data[0].name) {
    
                bill= data[0].id;
                $('#txtProvider').text(data[0].name)
                $('#divProduct').removeClass('hidden');
                $('#divProvider').addClass('hidden');
                chargeData(data[0].id);
            }
        });
    } else {
        swal('Seleccione un proveedor');
    }
    

}
function saveDecimal() {
    var data = {
        bill: bill,
        variant: $('#nameProduct').val(),
        cant: $('#cantProduct').val(),
        unit: $('#cbxunit').val(),
        location: $('#location').val()
    }
    swal({
        //position: 'top',
        title: $('#nameProduct').data('kendoComboBox').text(),
        text: data.cant + " " + $('#cbxunit').data('kendoDropDownList').text() + "(s)",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Registrar ingreso',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            $.post("/product/createdecimal", data, function (data) {
                if (data.affectedRows == 1) {
                    swal(
                        'Ingreso registrado!',
                        'El producto ha sido ingresado en la bodega',
                        'success'
                    )

                    $('#grid2').data('kendoGrid').dataSource.read();
                    $('#grid2').data('kendoGrid').refresh();
                } else {
                    swal(
                        'Error en el ingreso!',
                        'El producto no ha podido ser ingresado en la bodega',
                        'error'
                    )
                }
            });



        }
    })
}

function chargeData(bill){
    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/bill/read/" + bill, dataType: "json" },
            update: { url: "/product/update", type: "POST", dataType: "json" },
            destroy: { url: "/product/delete", type: "POST", dataType: "json" },
            create: {
                url: "/product/create", type: "POST", dataType: "json", success: function (data) {

                },
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },

        batch: true,
        pageSize: 10,
        serverFiltering: false,
        schema: {
            model: {
                id: "id",
                fields: {
                    Producto: { editable: false },
                    barcode: { validation: { required: true }, type: 'string', editable: false },
                    description: { validation: { required: true, }, type: 'string', editable: false },
                    bill: { type: 'string', defaultValue: bill, editable: false, visible: false },
                    location: { type: 'number' },
                    code: { editable: false }
                }
            }
        },

        pageSize: 1000
    },
    );

    $.get("/location/read2", function (data) {
        $("#grid2").kendoGrid({
            dataSource: dataSource,
            height: 400,
            resizable: true,
            scrollable: true,

            filterable: false,
            resizable: true,


            pageable: { refresh: true, pageSizes: true, },


            columns: [
                { field: 'id', hidden: true },

                { field: "cant", title: "Cantidad", filterable: { search: true } },
                { field: "unit", title: "Unidad", filterable: { search: true } },
                { field: "code", title: "Código", filterable: { search: true } },
                { field: "description", title: "Producto", filterable: { search: true } },
                { field: "barcode", title: "Código de barras", filterable: { search: true } },
                { field: "location", title: "Ubicación", values: data },
                { field: "bill", title: "Factura", width: '1px' },
                { command: ["destroy"], title: "Acciones" }],
            editable: "inline"
        })
    });
}
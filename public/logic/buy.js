var voucher;
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
           
        }
    }
});



$(document).ready(function () {

   

    $("#grid").kendoGrid({
        dataSource: {
            pageSize: 20
        },
        height: 450,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [ {
            field: "a",
            title: "Cantidad",
            width: 100
        }, {
            field: "b",
            title: "Producto"
        },
        { command: ["edit", "destroy"], title: "Acciones", width:250 }
    ]
    });
   

    dataSourceCombo = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/model/read",
                dataType: "json"
            }
        }
    });
    

    $("#nameProduct").kendoComboBox({
        dataSource: dataSourceCombo,
        filter: "contains",
        dataTextField: "description",
        dataValueField: "id",
        placeholder: "Buscar producto",
        minLength: 1,
        change: onChange
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


})

function enviarData(){
    var data = {
        cant: $('#code2').val(),
        product: $('#nameProduct').val()
    }
    var grid = $("#grid").data("kendoGrid");
    grid.dataSource.add( { a: data.cant, b: data.product } );
}

function saveClient(params) {
   
    
    swal({
        title: $('#selectClient option:selected').text(),
        
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
            var body={
                client: $('#selectClient').val(),
                user: user
            }
        
            $.post( "/voucher/create",body, function( data ) {
                if (data[0].id) {
                    voucher=data.id
                    $('#divSearch').removeClass('hidden');
                    $('#divClient').addClass('hidden');
                } else {
                    
                }
              
              });


        }
      })



   
    
}


function saveDecimal() {
    var data = {
        bill: voucher,
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
        confirmButtonText: 'Registrar venta',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            $.post("/product/selldecimal", data, function (data) {
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



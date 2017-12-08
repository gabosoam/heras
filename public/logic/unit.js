

kendo.culture("es-ES");
$(document).ready(function () {

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/unit/read", dataType: "json" },
            update: { url: "/unit/update", type: "POST", dataType: "json" },
            destroy: { url: "/unit/delete", type: "POST", dataType: "json" },
            create: { url: "/unit/create", type: "POST", dataType: "json" },
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
                    description: { validation: { required: true, }, type: 'string' },
                    smallDescription: { validation: { required: true, }, type: 'string' }
                }
            }
        }
    },
    );

    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: 475,
        filterable: true,
        resizable: true,
        pageable: { refresh: true, pageSizes: true, },
        toolbar: ['create','excel'],
        columns: [
        { field: "description", title: "Descripción", filterable: { multi: true, search: true, search: true } },
        { field: "smallDescription", title: "Descripción corta", filterable: { multi: true, search: true, search: true } },
        { command: ["edit", "destroy",{ text: "Salida", click: showDetails, iconClass: 'icon icon-chart-column' }], title: "Acciones"}],
        editable: "inline"
    });

    function showDetails(e) {

        
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $('#txtModal').text(dataItem.description);

        var socket = io.connect();
        socket.emit('getDates', function (category, brand,unit) {

            dataSourcePrice = new kendo.data.DataSource({
                transport:{
                    read: {url:"/price/read/"+dataItem.id, dataType: "json"},
                    create: {url:"/price/create",type:"POST", dataType: "json"},
                    destroy: { url: "/price/delete", type: "POST", dataType: "json" },
                    update: { url: "/price/update", type: "POST", dataType: "json" },
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
                            variant: {editable:false,defaultValue: dataItem.id, validation: { required: true, size:13 }, type: 'string' },
                            size: { validation: { required: true, }, type: 'number' },
                            unit: { validation: { required: true, }, type: 'number' },
                            
                        
                        }
                    }
                }
            },
            );
    
            $("#tablePrice").kendoGrid({
                dataSource: dataSourcePrice,
                height:400,
               
                resizable: true,
                
                pageable: { refresh: true, pageSizes: true, },
                toolbar: ['create'],
                
             
                columns: [
                    { field: "variant", title: "Code", filterable:false, hidden:true },
                    { field: "unit",values:unit, title: "U. de medida de salida", filterable:false },
                    { field: "size", title: "Tamaño", filterable:false },
                    { command: ["edit","destroy"], title: "Acciones" }
                    ],
                editable: "popup"
            });



        })
      

        $('#myModal').modal();
      }


});


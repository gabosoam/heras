

kendo.culture("es-ES");
$(document).ready(function () {
    var socket = io.connect();
    socket.emit('getDates', function (category, brand,unit) {
    dataSource = new kendo.data.DataSource({
        transport:{
            read: {url:"/model/read", dataType: "json"},
            create: {url:"/model/create",type:"POST", dataType: "json"},
            destroy: { url: "/model/delete", type: "POST", dataType: "json" },
            update: { url: "/model/update", type: "POST", dataType: "json" },
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
                    code: { validation: { required: true, size:13 }, type: 'string' },
                    description: { validation: { required: true, size:13 }, type: 'string' },
                 
                    brand: { validation: { required: true, }, type: 'string' },
                    category: { validation: { required: true, }, type: 'string' },
                    count: { validation: { required: true, }, type: 'number', editable: false  }
                }
            }
        }
    },
    );

    
    
      $("#grid").kendoGrid({
          dataSource: dataSource,
          filterable: true,
          resizable: true,
          
          pageable: { refresh: true, pageSizes: true, },
          toolbar: ['create'],
          
       
          columns: [
              { field: "code", title: "Código", filterable:false },
              { field: "description", title: "Producto",width:450 ,filterable:  { multi: true, search: true }
            },
              { field: "brand", values:brand, title: "Marca", filterable:  { multi: true, search: true }},
              { field: "category", values:category, title: "Categoría", filterable:  { multi: true, search: true }},
            
              { command: ["edit"], title: "Acciones" }],
          editable: "popup"
      });

      function showDetails(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

        console.log(dataItem.id)
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
                        variant: { validation: { required: true, size:13 }, type: 'string' }
                    
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
                { field: "variant", title: "Code", filterable:false },
                { field: "size", title: "Code", filterable:false },
                { field: "unit", title: "Code", filterable:false }],
            editable: "popup"
        });

        $('#myModal').modal();
      }

    })


});


var types = [{
    "value": 1,
    "text": "FACTURA"
}, {
    "value": 2,
    "text": "ACTA"
}, {
    "value": 3,
    "text": "GUÍA DE REMISIÓN"
}, {
    "value": 4,
    "text": "OTRO"
}];




kendo.culture("es-ES");
$(document).ready(function () {

    dataSourceCombo = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/provider/read",
                dataType: "json"
            }
        }
    });

    function userNameComboBoxEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                dataSource: dataSourceCombo,
                dataTextField: "name",
                dataValueField: "id",
                filter: "contains",
                minLength: 1
            });
    }

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/bill/read", type: 'POST', dataType: "json" },
            update: { url: "/bill/update", type: "POST", dataType: "json" },
            destroy: { url: "/bill/delete", type: "POST", dataType: "json" },
            create: { url: "/bill/create", type: "POST", dataType: "json" },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },
        batch: true,
        pageSize: 1000,
        serverFiltering: false,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false},
                    provider: { validation: { required: true, size: 13 }, type: 'string' },
                    type: { validation: { required: true, size: 13 }, type: 'string' },
                    date: { validation: { required: true, }, type: 'date' },
                    reference: { validation: { required: true, }, type: 'string' },
                    user: { type: 'string', defaultValue: user, editable: false, visible: false },
                }
            }
        }
    },
    );

    var wnd,
        detailsTemplate;

    var socket = io.connect();
    socket.emit('getProvider', function (providers) {
     

        $.get("/user/read2", function (users) {
          

            $("#grid").kendoGrid({
                dataSource: dataSource,
                height: 475,
              

                pageable: { refresh: true, pageSizes: true, },
            
               
                
                columns: [
                    { field: "id",hidden:true, title: "Código", filterable: { search: true, multi:true } },
                    { field: "provider",values: providers,editor: userNameComboBoxEditor , title: "Proveedor", filterable: {multi:true, search: true } },
                    { field: "date", title: "Fecha", filterable: { search: true, search: true }, format: "{0:dd/MM/yyyy}" },

                    { field: "user", values: users, title: "Creado por", filterable: {multi:true, search: true }  },

                    { command: [ { text: "Ver detalles", click: showDetails, iconClass: 'icon icon-chart-column' }], title: "Acciones" }],
                editable: "popup"
            });

        });



    })

    function showDetails(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        location.href = "/bill/" + dataItem.id;
    }



});

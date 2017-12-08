var connection = require('../config/connection.js');


module.exports = {
  read: function (callback) {
    connection.query('SELECT  * FROM price;', function (error, results, fields) {
      if (error) {
        callback('error en la consulta: ' + error, null);
      } else {
        callback(null, results);
      }
    });
  },

  readOne: function (variant,callback) {
    connection.query('SELECT  * FROM price WHERE variant =?;',variant, function (error, results, fields) {
      if (error) {
        callback('error en la consulta: ' + error, null);
      } else {
        callback(null, results);
      }
    });
  },

  update: function (datos, callback) {
    connection.query('UPDATE price SET variant=?,price=?,size=?,unit=? WHERE (id=?) LIMIT 1', [datos.variant,0, datos.size, datos.unit,datos.id], function (error, results, fields) {//
      if (error) {

        callback('error en la consulta: ' + error, null);
      } else {
        callback(null, results);
        
      }
    });
  },

  delete: function (datos, callback) {
    connection.query('DELETE FROM price WHERE id=?', [datos.id], function (error, results, fields) {//
      if (error) {
        callback('error en la consulta: ' + error, null);
      } else {
        callback(null, results);
        
      }
    });
  },

  create: function (datos, callback) {
    connection.query('INSERT INTO price (variant, price, size, unit) VALUES (?, ?, ?, ?)', [datos.variant,0,datos.size,datos.unit], function (error, results, fields) {//
      if (error) {
        callback('error en la consulta: ' + error, null);
      } else {
        callback(null, results);
        
      }
    });
  }
}

let mongoose = require('mongoose')

let Scheam = mongoose.Schema;

let productScheam = new Scheam({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
});

module.exports = mongoose.model('Good',productScheam);

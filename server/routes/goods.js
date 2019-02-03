let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('./../mock/goods');
let Users = require('./../mock/users');


//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/market');

//查看数据库是否连接成功

mongoose.connection.on('connected', function () {
  console.log("MongoDB connected success.")
});
mongoose.connection.on('error', function () {
  console.log("MongoDB connected fail.")
});
mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected')
});



//查询商品的列表数据
router.get('/list', function (req, res, next) {
  let page = parseInt(req.param('page'));//获取页数
  let pageSize = parseInt(req.param('pageSize'));//获取每页多少数据
  let skip = (page-1) * pageSize;//分页的公式
  let sort = req.param('sort');

  let goodsModel = Goods.find().skip(skip).limit(pageSize);//skip()--跳过多少条数据,limit()---每页多少条数据

  goodsModel.sort({'salePrice':sort});//排序


  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status:'1',
        msg:err.message
      });
    } else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  });
});

//添加商品进入购物车
router.post('/addCart', function (req, res, next) {
  if (req.cookies.userId) {
    let userId = req.cookies.userId;//获取userId
    let productId = req.body.productId;//获取商品的Id
    Users.findOne({userId:userId}, function (err, userDoc) {
      if (err) {
        res.json({
          status:'1',
          msg: err.message,
          result:''
        })
      } else {
        //查看购物车中是否有相同的商品
        if (userDoc) {
          let goods = '';//第三方变量，用于存储相同商品的信息
          userDoc.cartList.forEach((item) => {
            if (item.productId === productId) {
              goods = item;
              item.productNum++;
            }
          });
          if (goods) {
            userDoc.save(function (err2, doc2) {
              if (err2) {
                res.json({
                  status:'1',
                  msg: err2.message
                })
              } else {
                res.json({
                  status:'0',
                  msg:' ',
                  result:'success'
                })
              }
            })
          } else {
            Goods.findOne({productId:productId}, function (err, doc) {
              if (err) {
                res.json({
                  status:'1',
                  msg: err.message,
                  result:''
                })
              } else {
                if (doc) {
                  doc.productNum = 1;//商品数量为1
                  doc.checked = 1;//选中状态
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2, doc2) {
                    if (err2) {
                      res.json({
                        status:'1',
                        msg: err2.message
                      })
                    } else {
                      res.json({
                        status:'0',
                        msg:' ',
                        result:'success'
                      })
                    }
                  })
                }
              }
            })
          }
        }
      }
    });
  } else {
    res.json({
      status:'1001',
      msg:'未登录',
      result:''
    });
  }





});




module.exports = router;









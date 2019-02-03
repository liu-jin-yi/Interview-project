var express = require('express');
var router = express.Router();
let User = require('./../mock/users')




router.post('/login', function(req, res, next) {
  let prarm = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }

  User.findOne(prarm, function (err, doc) {
    if (err) {
      res.json({
        status:'1',
        msg:err.message
      });
    }  else {
      //浏览器缓存用户名和ID
      res.cookie('userId', doc.userId, {
        path:'/',//存在跟路径中
        maxAge: 1000*60*60//一小时
      })

      res.cookie('userName', doc.userName, {
        path:'/',
        maxAge: 1000*60*60
      })
      if (doc) {
        res.json({
          status:'0',
          msg:'',
          result: doc.userName
        });
      }
    }
  });

  //检查是否登陆
  router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
      res.json({
        status: '0',
        msg:'',
        result: req.cookies.userName || ' '
      })
    } else {
      res.json({
        status: '1001',
        msg: '未登录',
        result: ''
      })
    }
  })
//退出登陆
  router.get('/logout', function (req, res, next) {
    //清除cookies
    res.cookie('userId','',{
      path:'/',
      maxAge:-1
    })
    res.cookie('userName','',{
      path:'/',
      maxAge:-1
    })
    res.json({
      status: '0',
      msg:'',
      result:''
    })
  })
//获取购物车的列表
  router.get('/getAddList', function (req, res, next) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err, doc) {
      if (err) {
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      } else {
        res.json({
          status:'0',
          msg:'',
          result: doc.cartList
        });
      }
    })

  });
});

//删除购物车中的商品
router.post('/delGoods', function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;

  User.update({userId:userId}, {
    $pull:{
      'cartList': {
        'productId':productId
      }
    }
  },function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  })

});

//商品数量的增减
router.post('/cartEdit', function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  User.update({userId:userId, 'cartList.productId':productId}, {
    'cartList.$.productNum':productNum,
    'cartList.$.checked':checked
  },function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  })

});

//全选的转换
router.post('/editCheckAll', function (req, res, next) {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({'userId':userId}, function (err, user) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: "0",
              msg: '',
              result: 'success'
            })
          }
        });
      }

    }
  });

});
//查询用户购物车商品的数量
router.get('/getCartCount', function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        })
      } else {
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.forEach((item) => {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: "0",
          msg: '',
          result: cartCount
        })
      }
    });
  }
});

module.exports = router;

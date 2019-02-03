<template>
<div class="container-fluid">
  <nav-header></nav-header>
  <!--走马灯-->
  <div class="container">
    <nav-carousel></nav-carousel>
  </div>
  <!--价格的升降-->
  <div class="container price">
    <span>Hot commodity</span>
    <div class="price-r">
      <a href="javaScript:;" v-on:click="sortGoods">
        Price
        <span class="el-icon-sort-down" v-bind:class="{'price-r-check': !sortFlag}"></span>
      </a>
    </div>
  </div>

  <!--商品模块-->
  <div class="container mer">
    <ul class="list-unstyled" >
      <li class="cars"v-for="(item, index) in goodslist" :key="index">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img v-lazy="'/static/' + item.productImage" class="image">
          <div style="padding: 14px;">
            <span v-cloak>{{ item.productName }}</span>
            <div class="bottom clearfix">
              <time class="time" v-cloak>{{ item.salePrice | currency }}</time>
              <el-button type="text" class="button" @click="openCart(item.productId)">加入购物车</el-button>
            </div>
          </div>
        </el-card>
      </li>
    </ul>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50">
      <img src="/static/loading-svg/loading-spinning-bubbles.svg" v-show="loading"/>
    </div>
  </div>
  <nav-footer></nav-footer>
</div>
</template>

<script>
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavCarousel from '@/components/NavCarousel'
  import axios from 'axios'
  import { currency } from '@/util/currency'
    export default {
        name: "goodsList",
        filters:{
          currency
        },
        data () {
          return {
            goodslist:[],//购物车列表
            page:1,//页
            pageSize:4,//没有加载多少数据
            busy: true,//分页参数
            loading: false,//控制loading的显示
            productId:'',//全局的的商品Id
            sortFlag: true,//排序参数
            addflag:false,


          }
        },
      components:{
        NavHeader,
        NavFooter,
        NavCarousel
      },
      mounted () {
          this.getGoodsList()

      },
      methods:{
          getGoodsList (flag) {
            let param = {
              page:this.page,
              pageSize: this.pageSize,
              sort:this.sortFlag ? 1 : -1
            }
            this.loading = true;//loading显示
            axios.get('/goods/list', {
              params:param
            }).then((response) => {
              this.loading = false;
              let res = response.data;
              if (res.status === '0') {
                if (flag) {
                  this.goodslist = this.goodslist.concat(res.result.list);
                  if (res.result.count === 0) {
                    this.loading = false;
                    this.busy = true;//禁用加载
                  } else {
                    this.busy = false;
                    this.loading = false;
                  }
                } else {
                  this.goodslist = res.result.list;
                  this.busy = false;
                  this.loading = false;
                }

              } else {
                this.goodslist = [];
              }
            })

          },
        loadMore: function() {
            //分页函数
          this.busy = true;

          setTimeout(() => {
            this.page++;
            this.getGoodsList(true);


          }, 1000);
        },
        openCart(productId) {
          this.productId = productId;
          if (this.addflag) {
            this.$confirm('请你登陆！')
          } else {
            this.addCart();//加入购物车
            this.$confirm('加入购物车成功！', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '继续购物',
              cancelButtonText: '前往购物车'
            })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '祝您购物愉快！'
                });
              })
              .catch(() => {
                this.$router.push('cart')
              });
          }


        },
        addCart () {
            //添加商品进入购物车
          axios.post('/goods/addCart', {
            productId: this.productId
          }).then((response) => {
            let res = response.data;
            this.$store.commit('updateCount', 1)
            if (res.status === '1001') {
              this.addflag = true;
            }
          })
        },
        sortGoods () {
          //控制价格的升降
          this.sortFlag = !this.sortFlag;//升降序
          this.page = 1;//从第一页开始排序
          this.getGoodsList();
        },
      },

    }
</script>

<style scoped>
  .mer {
    margin-top: 20px;
    margin-bottom: 40px;

  }
  .cars {
    width: 235px;
    height: 280px;
    display: block;
    float: left;
    background-color: pink;
    margin:0 65px 60px 0;transition: all 0.5s;
  }
  .cars:hover{
    transform: translate(0,-10px);

  }
  .cars img {
    transition: all 0.5s;
  }
  .cars img:hover {
    transform: translate(0,-6px);
  }
  .list-unstyled li:nth-child(4n) {
    margin-right: 0;
  }
  .price {
    height: 100px;

    margin-bottom: 35px;
    line-height: 100px;

    box-sizing: border-box;
    padding-left: 20px;
  }
  .price span {
    font-size: 20px;

  }
  .price-r {
    width: 100px;
    height: 100px;
    float: right;
    text-align: center;
    text-decoration: none;
  }
  .price-r:hover{
    text-decoration: none;
  }
  .price-r span {
    text-align: center;
    margin-top: 5px;
    margin-left: 10px;
    transition: all 0.5s;
  }
  .price-r-check{

    transform: rotate(180deg);

  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }
  .button:hover{
    color: pink;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

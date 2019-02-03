<template>
 <div>
   <NavHeader></NavHeader>
   <div class="container">
     <div class="cart">
       <div class="page-title-normal">
         <h2 class="page-title-h2"><span>My Cart</span></h2>
       </div>
       <div class="item-list-wrap">
         <div class="cart-item">
           <div class="cart-item-head">
             <ul>
               <li>Items</li>
               <li>Price</li>
               <li>Quantity</li>
               <li>Subtotal</li>
               <li>Edit</li>
             </ul>
           </div>
           <ul class="cart-item-list">
             <li v-for="(item, index) in goodslist" :key="index">
               <div class="cart-tab-1">
                 <div class="cart-item-check">
                   <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked === '1'}" @click="editCart('checked',item)">
                     <svg class="icon icon-ok">
                       <use xlink:href="#icon-ok"></use>
                     </svg>
                   </a>
                 </div>
                 <div class="cart-item-pic">
                   <img :src="'/static/' + item.productImage">
                 </div>
                 <div class="cart-item-title">
                   <div class="item-name" v-cloak>{{ item.productName }}</div>
                 </div>
               </div>
               <div class="cart-tab-2">
                 <div class="item-price" v-cloak>{{ item.salePrice | currency }}</div>
               </div>
               <div class="cart-tab-3">
                 <div class="item-quantity">
                   <div class="select-self select-self-open">
                     <div class="select-self-area don">
                       <a class="input-sub" v-on:click="editCart('minu', item)">-</a>
                       <span class="select-ipt" v-cloak>{{ item.productNum }}</span>
                       <a class="input-add" v-on:click="editCart('add', item)">+</a>
                     </div>
                   </div>
                 </div>
               </div>
               <div class="cart-tab-4">
                 <div class="item-price-total" v-cloak>{{ (item.salePrice * item.productNum) | currency }}</div>
               </div>
               <div class="cart-tab-5">
                 <div class="cart-item-opration">
                   <a href="javascript:;" class="item-edit-btn">
                     <span class="el-icon-delete" @click="delGoods(item)" ></span>
                   </a>
                 </div>
               </div>
             </li>
           </ul>
         </div>
       </div>
       <div class="cart-foot-wrap">
       <div class="cart-foot-inner">
         <div class="cart-foot-l">
           <div class="item-all-check">
             <a href="javascipt:;" v-on:click="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn" v-bind:class="{'check':checkAllFlag}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
               <span>Select all</span>
             </a>
           </div>
         </div>
         <div class="cart-foot-r">
           <div class="item-total">
             Item total: <span class="total-price">{{ totalPrice | currency }}</span>
           </div>
           <div class="btn-wrap">
             <a class="btn btn--red ce">Checkout</a>
           </div>
         </div>
       </div>
     </div>
     </div>
   </div>
    <nav-footer></nav-footer>
   </div>


</template>

<script>
  import '@/assets/base.css'
  import '@/assets/checkout.css'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import axios from 'axios'
  import { currency } from '@/util/currency'
    export default {
        name: "Cart",
      filters:{
        currency
      },
      data () {
          return {
            goodslist:[],
            productId:'',
          }
      },
        components:{
          NavHeader,
          NavFooter
        },
      computed:{
        totalPrice () {
          //计算购物车中的总价格
          let money = 0;
          this.goodslist.forEach((item) => {
            if (item.checked === '1') {
              money += parseFloat(item.salePrice) * parseInt(item.productNum)
            }

          });
          return money;
        },
        checkAllFlag () {
          //判断是否全选
          return this.checkedCount === this.goodslist.length;
        },
        checkedCount () {
          //判断选中了多少个商品
          let i = 0;
          this.goodslist.forEach((item) => {
            if (item.checked === '1') i++;

          });
          return i;
        }

      },
      mounted () {
        this.getGoodsList()
      },
      methods:{
          getGoodsList () {
            axios.get('/users/getAddList').then((response) => {
              let res = response.data;
              if (res.status === '0') {
                this.goodslist = res.result;
              }
            })
          },
        delGoods(item) {
            this.productId = item.productId;
            this.$store.commit('updateCount', - item.productNum)
            this.delGoodsList()
          this.$notify({
            title: '成功',
            message: '您成功的删除了该商品',
            type: 'success'
          });
        },
        delGoodsList () {
          axios.post('/users/delGoods', {
            productId: this.productId
          }).then((response) => {
            let res = response.data
            if (res.status === '0') {
              this.getGoodsList()
            }
          })
        },
        editCart (flag, item) {
          //商品数量的增减
          var num = 0;
          if (flag === 'add') {
            item.productNum ++;
            num = 1;
          } else if (flag === 'minu') {
            num = -1;
            if (item.productNum <= 1) {
              return;
            }
            item.productNum --;
          } else {
            item.checked = item.checked === '1' ? '0' : '1'
          }
          axios.post('/users/cartEdit', {
            productId:item.productId,
            productNum: item.productNum,
            checked: item.checked
          }).then((response) => {
            let res = response.data
            this.$store.commit('updateCount', num)
          })
        },
        toggleCheckAll () {
          //全选的切换
          let flag = !this.checkAllFlag;
          this.goodslist.forEach((item) => {
            item.checked = flag ? '1' : '0';
          });
          axios.post('/users/editCheckAll', {
            checkAll: flag
          }).then((response) => {
            let res = response.data
          })
        },
      }
    }
</script>

<style scoped>
  .don{
    margin-top: 10px;
  }
  .ce {
    text-align: center;
    padding-top: 15px;
    box-sizing: border-box;
  }
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>

<template>
  <header class="container head">
    <div class="logo">
      <a href="#" title="淘宝网">淘宝商城</a>
    </div>
    <div class="personal">
      <ul class="list-unstyled list-inline">
        <li>
          <img src="/static/pic.png">
          <a href="javaScript:;" v-text="nickName"></a>
        </li>
        <li>
          <a href="javaScript:;" v-if="!loginFlag" v-on:click="login">login</a>
          <a href="javaScript:;" v-else v-on:click="logout">logout</a>
        </li>
        <li>
          <el-badge :value="count" class="">
            <span class="el-icon-goods"></span>
          </el-badge>
        </li>
      </ul>
    </div>
  </header>

</template>

<script>
  import '@/assets/index.css'
  import axios from 'axios'
    export default {
        name: "NavHeader",
      data () {
          return {
            loginFlag: false,
          }
      },
      computed:{
        // ...mapState(['nickName', 'count'])
         nickName () {
           return this.$store.state.name;
         },
         count () {
           return this.$store.state.count
        }
      },
    created () {
        this.checkUpLogin()
      },
      methods:{
          checkUpLogin () {
            axios.get('/users/checkLogin').then((response) => {
              let res = response.data
              if (res.status === '0') {
                this.$store.commit('initName', res.result)
                this.loginFlag = true
                this.getCartCount();
              } else {
                this.$store.commit('initName', '未登录');
                this.loginFlag = false;
                this.login()
              }
            })
          },
        logout () {
          axios.get('/users/logout').then((res) => {
            this.login()
          })
        },
        login () {
            this.$router.push({name:'Login'})
        },
        getCartCount () {
            axios.get('/users/getCartCount').then((response) => {
              let res = response.data;
              if (res.status === '0') {
                this.$store.commit('initCount', res.result)
              }
            })
        }
      }
    }
</script>

<style scoped>
.head {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>

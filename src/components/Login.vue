<template>
  <div class="container login">
    <div class="cen">

        <div class="form-group">
          <label for="name">Address</label>
          <input type="text" v-model="userName" class="form-control" id="name" placeholder="User">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" v-model="userPwd" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-success btn-block" v-on:click="login">login</button>

    </div>

  </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "Login",
      data () {
          return {
            userName:'admin',
            userPwd:'123456'
          }
      },
      mounted () {

      },
      methods:{
          login () {
            if (!this.userName || !this.userPwd) {
              return
            }
            axios.post('/users/login', {
              userName:this.userName,
              userPwd:this.userPwd
            }).then((res) => {

              if (res.data.status === '0') {
                this.getCartCount();
                this.$router.push({name: 'GoodsList'})
              }
            })
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
  .login {
    padding-top: 300px;
  }
  .cen{
    width: 400px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>

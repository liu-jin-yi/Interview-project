// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入bootstrap-vue
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//导入bootstrap样式
import 'bootstrap/dist/css/bootstrap.css'
import '../src/assets/base.css'

//实现图片懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading:'/static/loading-svg/loading-bars.svg'
});
//实现分页功能
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
import Vuex from 'vuex'

Vue.use(Vuex)

//vux
const store = new Vuex.Store({
  state:{
    count:0,
    name:''
  },
  mutations:{
   initName (state, name) {
     state.name = name;
   },
    initCount (state, count) {
     state.count = count;
    },
    getCount (state) {
     return state.count;
    },
    updateCount (state, num) {
     state.count += num;
    }
  },
});




Vue.config.productionTip = false
//使用BootstrapVue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

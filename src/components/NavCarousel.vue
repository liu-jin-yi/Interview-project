<template>
  <div class="caro">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="index in 4" :key="index" v-bind:class="'pop' + index"></el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

    export default {
        name: "NavCarousel",
      data () {
        return {
          slide: 0,
          sliding: null
        }
      },
      methods: {
        onSlideStart (slide) {
          this.sliding = true
        },
        onSlideEnd (slide) {
          this.sliding = false
        },

      }
    }
</script>

<style scoped>
  .caro {
    margin-bottom: 25px;
  }

  .pop1{
    background: url("/static/xmad1.jpg");
    background-position: center;
    background-size: cover;
  }
  .pop2{
    background: url("/static/xmad2.jpg");
    background-position: center;
    background-size: cover;
  }
  .pop3{
    background: url("/static/xmad3.jpg");
    background-position: center;
    background-size: cover;
  }
  .pop4{
    background: url("/static/xmad4.jpg");
    background-position: center;
    background-size: cover;
  }
</style>

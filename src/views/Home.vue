<template>
  <div class="home">
    <Header></Header>
    <section class="section">
      <router-view></router-view>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/Header'
import Footer from '../components/Footer'
export default {
  data () {
    return {}
  },
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.section {
  flex: 1;
  margin: 56px 0;
}
</style>

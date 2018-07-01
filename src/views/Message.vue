<template>
  <div class="message">
    <Dialog v-if="!isLogin"></Dialog>
    <mu-grid-list class="grid-list">
      <mu-sub-header>Theme</mu-sub-header>
      <mu-grid-tile v-for="item in list" :key="item.id">
        <div class="img">{{item.theme}}</div>
        <span slot="title">{{item.title}}</span>
        <span slot="subTitle">by <b>{{item.author}}</b></span>
        <mu-icon slot="action" value="star_border"></mu-icon>
      </mu-grid-tile>
    </mu-grid-list>
  </div>
</template>

<script>
import Dialog from '../components/Dialog'

export default {
  data () {
    return {
      isLogin: localStorage.getItem('userName'),
      list: [
        {title: 'Monday', author: 'TBH', theme: 'G'},
        {title: 'Tuesday', author: 'BING', theme: 'X'},
        {title: 'Wensday', author: 'HUA', theme: 'A'},
        {title: 'Thursday', author: 'ZZJ', theme: 'P'},
        {title: 'Firday', author: 'LHH', theme: 'B'}
      ]
    }
  },
  components: {
    Dialog
  }
}
</script>

<style>
.message {
  padding: 0 10px;
}

.grid-list .img {
  font-size: 70px;
  font-weight: bold;
  text-align: center;
}
</style>

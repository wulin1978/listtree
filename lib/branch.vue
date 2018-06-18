<template>
<div>
  <div v-for="smalllist in listData" :key="smalllist.name">
    <div>{{smalllist.router}}、{{smalllist.name}}</div>
    <div class="box">
      <branch :listData="smalllist.childer" v-if="smalllist.childer&&smalllist.childer.length>0"></branch>
    </div>
  </div>
</div>
</template>
<script>
import Branch from './branch'
export default {
  name: 'branch',
  components: {
    Branch
  },
  props: {
    listData: {
      default: function () {
        return []
      }
    }
  }
}
</script>
<style>
</style>

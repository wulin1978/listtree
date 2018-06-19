<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <div></div>
    <div @click="clickBranch('branchBox'+branchI+(index+1))" :data-index="branchI+(index+1)">{{item.name}}</div>
    <div :style="boxStyle" :id="'branchBox'+branchI+(index+1)">
      <branch :listData="item.childer" :indentIcon="indentIcon" v-if="item.childer&&item.childer.length>0" :branchI="branchI+(index+1)+'-'"></branch>
    </div>
  </div>
</div>
</template>
<script>
import Branch from './branch'
export default {
  name: 'branch',
  data () {
    return {
      boxDisplay: 'none'
    }
  },
  components: {
    Branch
  },
  props: {
    branchI: {
      default: 0
    },
    listData: {
      default: function () {
        return []
      }
    },
    indentIcon: {
      default: 24
    },
    color: {
      default: 'red'
    }
  },
  methods: {
    clickBranch (id) {
      let box = document.getElementById(id)
      box.style.display = box.style.display === 'none' ? '' : 'none'
    }
  },
  computed: {
    boxStyle () {
      return `padding-left: ${this.indentIcon}px`
    }
  }
}
</script>
<style>
</style>

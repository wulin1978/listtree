<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <div :style="branchStyle" @click="clickBranch(branchId+(index+1))" :data-index="branchId+(index+1)" class='listTreeBranch'>
      <div class='listTreeIconBg' v-if="item.childer&&item.childer.length>0"><div :id="'listTreeIcon'+(branchId+(index+1))" :style="rightDownTriangleCSS"></div></div>
      {{item.name}}
    </div>
    <div :style="branchBoxStyle" :id="'branchBox'+(branchId+(index+1))">
      <branch :listData="item.childer" :indentIcon="indentIcon" v-if="item.childer&&item.childer.length>0" :branchId="branchId+(index+1)+'-'"></branch>
    </div>
  </div>
</div>
</template>
<script>
import Branch from './branch'
import Triangle from './triangle'

export default {
  name: 'branch',
  data () {
    return {
      boxDisplay: 'none',
      rightTriangleCSS: `border: 5.5px solid transparent;
                         border-left: 6px solid ${this.triangleColor};
                         height: 0px;
                         width: 0px;
                         position: absolute;
                         transform:translateY(-50%);
                         top: 50%;`,
      downTriangleCSS: `border: 5.5px solid transparent;
                        border-top: 6px solid ${this.triangleColor};
                        height: 0px;
                        width: 0px;
                        position: absolute;
                        transform:translateY(-50%);
                        top: 50%;`,
      rightDownTriangleCSS: `border: 4px solid transparent;
                             border-bottom: 4px solid ${this.triangleColor};
                             border-right: 4px solid ${this.triangleColor};
                             height: 0px;
                             width: 0px;
                             position: absolute;
                             transform:translateY(-50%);
                             top: 50%;`
    }
  },
  components: {
    Branch,
    Triangle
  },
  props: {
    branchId: {
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
    indentLetter: {
      default: 10
    },
    cursor: {
      default: 'default'
    },
    triangleColor: {
      default: '#222'
    },
    customIcon: {
      default: function () {
        return []
      }
    },
    open: {
      default: 1
    }
  },
  methods: {
    clickBranch (id) {
      let box = document.getElementById('branchBox' + id)
      let icon = document.getElementById('listTreeIcon' + id)
      if (box.style.display === 'none') {
        box.style.display = ''
        icon.style = this.rightDownTriangleCSS
      } else {
        box.style.display = 'none'
        icon.style = this.rightTriangleCSS
      }
    }
  },
  computed: {
    branchBoxStyle () {
      return `padding-left: ${this.indentIcon}px;`
    },
    branchStyle () {
      return `padding-left:  ${this.indentLetter}px;
      cursor: ${this.cursor};`
    }
  }
}
</script>
<style>
.listTreeBranch{
  position: relative;
  text-align: left;
}
.listTreeIconBg{
  width: 20px;
  height: 20px;
  position: absolute;
  transform:translateY(-50%);
  top: 50%;
  left: 0;
}
</style>

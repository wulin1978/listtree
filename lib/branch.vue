<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <div :style="branchStyle" @click="clickBranch(branchLevel+(index+1))" :data-index="branchLevel+(index+1)" class='listTreeBranch'>
      <div class='listTreeIconBg' v-if="item.childer&&item.childer.length>0">
        <div :id="'listTreeIcon'+(branchLevel+(index+1))" :style="listTreeIconStyle"></div>
      </div>
      {{item.name}}
    </div>
    <div :style="branchBoxStyle" :id="'branchBox'+(branchLevel+(index+1))">
      <branch :listData="item.childer" :indentIcon="indentIcon" v-if="item.childer&&item.childer.length>0" :branchLevel="branchLevel+(index+1)+'-'"></branch>
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
      branchState: 'open',
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
    open: {// -------------------------------设置初始状态下各分支展开或闭合情况
      default: 3
    },
    branchLevel: { // ---------分支级别，顶级分支为x，二级分支为x-x，三级分支为x-x-x，以此类推
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
    }
  },
  methods: {
    clickBranch (id) {
      let box = document.getElementById('branchBox' + id)
      let icon = document.getElementById('listTreeIcon' + id)
      if (!icon) return
      if (box.style.display === 'none') {
        box.style.display = ''
        icon.style = this.rightDownTriangleCSS
      } else {
        box.style.display = 'none'
        icon.style = this.rightTriangleCSS
      }

      if (this.open === 2) { // -----open为2 时同级分支只能展开一个分支，所以这里用循环把所有和当前点击分支的所有同级分支都关闭-----------
        let str = ''
        if (id.length > 1) {
          str = id.split('')
          str.pop()
          str = str.join('')
        }
        let n = 1
        while (document.getElementById('branchBox' + str + n)) {
          let bBox = document.getElementById('branchBox' + str + n)
          let bIcon = document.getElementById('listTreeIcon' + str + n)
          if (str + n !== '' + id) { // -----------判断循环到的分支和当前点击的分支不是同一个分支才关闭，否则会出现点击不能展开分支的情况。当点击一级目录分支时，id为纯数字，(str + n) 为 (''+数字)，是一个字符串，所以这里要在id前加空字符串，使等式两边数据类型一致
            if (bBox) bBox.style.display = 'none'
            if (bIcon) bIcon.style = this.rightTriangleCSS
          }
          n++
        }
      }// -------------------------------------------------------------------------------------------------------------------------
    }
  },
  computed: {
    branchBoxStyle () {
      let theDisplay = this.branchState === 'open' ? '' : 'none'
      if (this.open === 3 || this.open === 4) {
        if (this.branchLevel === 0) {
          theDisplay = ''
        } else {
          theDisplay = 'none'
        }
      }
      return `padding-left: ${this.indentIcon}px;
              display: ${theDisplay};`
    },
    branchStyle () {
      return `padding-left:  ${this.indentLetter}px;
      cursor: ${this.cursor};`
    },
    listTreeIconStyle () {
      let iconStyle
      if (this.branchState === 'close') {
        iconStyle = this.rightTriangleCSS
      } else {
        iconStyle = this.rightDownTriangleCSS
      }
      return iconStyle
    }
  },
  mounted () {
    if (this.open === 2 || this.open === 0) this.branchState = 'close'
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

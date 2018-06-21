<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的id为X，二级branch的id为：X-X，三级branch的id为：X-X-X，以此类推 -->
    <div :style="branchStyle(branchLevel+(index+1))" @click="clickBranch(branchLevel+(index+1), item.children)" :data-index="branchLevel+(index+1)" class='listTreeBranch' :id="'branch'+(branchLevel+(index+1))" @mouseover="mouseOver(branchLevel+(index+1), item.children)" @mouseout="mouseOut(branchLevel+(index+1), item.children)">
      <div class='branchIconBg' :style="branchIconBgStyle" v-if="item.children&&item.children.length>0">
        <div :id="'branchIcon'+(branchLevel+(index+1))" :style="branchIconStyle(branchLevel+(index+1))" v-if="nowState['branchIcon'+(branchLevel+(index+1))]==='show'"></div>
      </div>
      {{item.name}}
    </div>
    <!--=============== box ================= 每个branch下都有个box层，branch所有的下级分支都在box内，branch的展开和闭合就可以用box的显示隐藏来实现。另外box与左边框的距离可以实现上下级branch的缩进 -->
    <div :style="branchBoxStyle(branchLevel+(index+1), item.children)" :id="'branchBox'+(branchLevel+(index+1))">
      <branch :listData="item.children" :indent="indent" v-if="item.children&&item.children.length>0" :branchLevel="branchLevel+(index+1)+'-'" :depth="depth+1"></branch>
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
      nowState: {}, // -----------------各个branch,icon的展开或闭合状态以及鼠标悬停所在branch
      branchState: 'open',
      rightTriangleStyle: `border: 5.5px solid transparent;
                         border-left: 6px solid ${this.iconColor};
                         height: 0px;
                         width: 0px;
                         position: absolute;
                         transform:translateY(-50%);
                         top: 50%;`,
      downTriangleStyle: `border: 5.5px solid transparent;
                        border-top: 6px solid ${this.iconColor};
                        height: 0px;
                        width: 0px;
                        position: absolute;
                        transform:translateY(-50%);
                        top: 50%;`,
      rightDownTriangleStyle: `border: 4px solid transparent;
                             border-bottom: 4px solid ${this.iconColor};
                             border-right: 4px solid ${this.iconColor};
                             height: 0px;
                             width: 0px;
                             position: absolute;
                             transform:translateY(-50%);
                             top: 50%;`
    }
  },
  components: {
    Branch
  },
  props: {
    open: {// -------------------------------设置初始状态下各分支展开或闭合情况
      default: 4
    },
    branchLevel: { // ---------分支级别，顶级分支为x，二级分支为x-x，三级分支为x-x-x，以此类推
      default: 0
    },
    depth: { // ------------分支级别的深度，一级分支深度为0，二级分支深度为1，三级分支深度为2，以此类推
      default: 0
    },
    listData: { // -----------json格式的数据，每个分支目录有name,router,icon,children四个个字段，name为分支的文字内容（必须有）。router为点击分支时跳转的路由地址,如果不跳转可省略router字段。icon为该分支前的图标地址（包括展开时和闭合时的图标，所以icon是个数组），如果使用默认图标icon字段可以省略。children为该分支的下级分支，如果没有下级分支children字段也可以省略
      default: function () {
        return []
      }
    },
    indent: { // -----子级分支相对父级分支的缩进距离
      default: 24
    },
    spacing: { // -----目录文字与图标间的距离
      default: 10
    },
    left: { // ---列表树与左边框之间的距离
      default: 8
    },
    branchSpacing: { // ----垂直方向上分支之间间隔
      default: 5
    },
    cursor: { // -----鼠标移到branch上时指针的样式
      default: 'pointer'
    },
    iconColor: { // -----branch前图标三角形的颜色
      default: '#222'
    },
    customIcon: { // -----自定义branch前的小图标，customIcon为一个数组，数组第一个元素为展开时图标的位置，第一个元素为闭合时图标的位置
      default: function () {
        return []
      }
    },
    mouseOverStyle: {
      default: function () {
        return {
          branchStyle: {
            color: 'white',
            background: 'rgb(174, 180, 194)'
          },
          iconColor: 'white'
        }
      }
    }
  },
  methods: {
    clickBranch (id) { // -----------------------------branch 点击事件
      this.nowState['branch' + id][0] = this.nowState['branch' + id][0] === 'open' ? 'close' : 'open'
      this.nowState['branch' + id][2] = 1
      this.renewStyle(id)
      // if ((this.open === 4 && (id + '').length === 1) || !children || children.length === 0) return
      // let box = document.getElementById('branchBox' + id)
      // let icon = document.getElementById('branchIcon' + id)
      // let branch = document.getElementById('branch' + id)
      // if (!icon) return
      // if (box.style.display === 'none') {
      //   box.style.display = ''
      //   icon.style = this.iconOpenStyle
      //   branch.style = `${this.branchOpenStyle}
      //                   cursor: ${this.cursor}`
      // } else {
      //   box.style.display = 'none'
      //   icon.style = this.iconCloseStyle
      //   branch.style = `${this.branchCloseStyle}
      //                   cursor: ${this.cursor}`
      // }

      // if (this.open === 2) { // -----open为2 时同级分支只能展开一个分支，所以这里用循环把所有和当前点击分支的所有同级分支都关闭-----------
      //   let str = ''
      //   if (id.length > 1) {
      //     str = id.split('')
      //     str.pop()
      //     str = str.join('')
      //   }
      //   let n = 1
      //   while (document.getElementById('branchBox' + str + n)) {
      //     let bBox = document.getElementById('branchBox' + str + n)
      //     let bIcon = document.getElementById('branchIcon' + str + n)
      //     if (str + n !== '' + id) { // -----------判断循环到的分支和当前点击的分支不是同一个分支才关闭，否则会出现点击不能展开分支的情况。当点击一级目录分支时，id为纯数字，(str + n) 为 (''+数字)，是一个字符串，所以这里要在id前加空字符串，使等式两边数据类型一致
      //       if (bBox) bBox.style.display = 'none'
      //       if (bIcon) bIcon.style = this.iconCloseStyle
      //     }
      //     n++
      //   }
      // }// -------------------------------------------------------------------------------------------------------------------------
    },
    branchStyle (id) { // --------branch的样式
      let branchStyle = ''
      // console.log(id + '///' + this.nowState['branch' + (this.branchLevel + id)])
      let cursor = this.nowState['branch' + id][1]
      if (this.nowState['branch' + id][0] === 'open') {
        branchStyle = this.branchOpenStyle
      } else {
        branchStyle = this.branchCloseStyle
      }
      if (this.nowState['branch' + id][2] === 1) {
        branchStyle += this.branchMouseOverStyle
      }
      return `${branchStyle}
              cursor: ${cursor};`
    },
    branchBoxStyle (id) { // -------box的样式
      let theDisplay
      if (this.nowState['branch' + id][0] === 'open') {
        theDisplay = ''
      } else {
        theDisplay = 'none'
      }
      return `${this.boxStyle}
              display: ${theDisplay};`
    },
    branchIconStyle (id) { // -------图标的样式
      let iconStyle
      if (this.nowState['branch' + id][0] === 'open') {
        iconStyle = this.iconOpenStyle
      } else {
        iconStyle = this.iconCloseStyle
      }
      return iconStyle
    },
    renewStyle (id) { // --------刷新branch,box和icon的样式（点击或者鼠标移进移出的时候）
      console.log(id)
      let theBranchId = document.getElementById('branch' + id)
      let theIconId = document.getElementById('branchIcon' + id)
      let theBoxId = document.getElementById('branchBox' + id)

      if (theBranchId) theBranchId.style = this.branchStyle(id)
      if (theIconId) theIconId.style = this.branchIconStyle(id)
      if (theBoxId) theBoxId.style = this.branchBoxStyle(id)
    },
    mouseOver (id) { // ----------------鼠标移到branch上时修改this.nowState
      this.nowState['branch' + id][2] = 1
      this.renewStyle(id)
    },
    mouseOut (id) { // ----------------鼠标移出branch上时修改this.nowState
      this.nowState['branch' + id][2] = 0
      this.renewStyle(id)
    }
  },
  computed: {
    branchIconBgStyle () { // ----图标背景层距离左边的距离，控制图标的位置
      let theLeft = this.indent * this.depth + this.left
      return 'left: ' + theLeft + 'px'
    },
    iconOpenStyle () { // -----图标展开时的样式
      if (this.customIcon.length === 2) {
        return `position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: url('${this.customIcon[0]}') center no-repeat;`
      }
      return this.rightDownTriangleStyle
    },
    iconCloseStyle () { // -----图标闭合时的样式
      if (this.customIcon.length === 2) {
        return `position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: url('${this.customIcon[1]}') center no-repeat;`
      }
      return this.rightTriangleStyle
    },
    branchOpenStyle () { // ---branch展开时的样式
      let theLeft = this.indent * this.depth + this.spacing + this.left
      return `padding-left: ${theLeft}px;
              margin: ${this.branchSpacing}px 0px;`
    },
    branchCloseStyle () { // ---branch闭合时的样式
      let theLeft = this.indent * this.depth + this.spacing + this.left
      return `padding-left: ${theLeft}px;
              margin: ${this.branchSpacing}px 0px;`
    },
    boxStyle () {
      return ''
      // return `padding-left: ${this.indent}px;`
    },
    branchMouseOverStyle () { // ----鼠标移到branch上时的样式
      let overStyle = ''
      for (let key in this.mouseOverStyle.branchStyle) {
        overStyle += key + ':' + this.mouseOverStyle.branchStyle[key] + ';'
      }
      return overStyle
    }
  },
  created () {
    for (let n = 1; n < this.listData.length + 1; n++) {
      this.$set(this.nowState, 'branch' + (this.branchLevel + n), ['close', this.cursor, 0]) // ----------默认情况，所有branch都为闭合状态，且可以控制鼠标样式(数组第一个元素表示branch的展开或闭合状态['open'为展开，'close'为闭合]，第二个元素表示鼠标移到branch上时鼠标样式，第三个元素表示鼠标此时是否悬停在该branch上[0为否，1为是])
      this.$set(this.nowState, 'branchIcon' + (this.branchLevel + n), 'show') // ----------默认情况，所有icon都为显示状态('show'为显示，'hidden'为隐藏)

      if (this.open === 1) {
        this.nowState['branch' + (this.branchLevel + n)][0] = 'open' // ----------当open值为1时，所有branch都为展开状态
      } else if ((this.open === 3 || this.open === 4) && this.depth === 0) {
        this.nowState['branch' + n][0] = 'open' // ----------当open值为3或4时，所有一级branch都为展开状态
      } else if (this.open === 2 && (this.branchLevel + n) === 1) {
        this.nowState['branch1'][0] = 'open' // ----------当open值为2时，只有第一个一级branch为展开状态
      }
      if ((this.open === 4 && this.depth === 0) || !this.listData[n - 1].children || this.listData[n - 1].children.length === 0) {
        this.nowState['branchIcon' + (this.branchLevel + n)] = 'hidden' // ----------当open为4且branch为一级分支或者该branch没有children字段或children字段长度为0时，该branch前的icon为隐藏状态
        this.nowState['branch' + (this.branchLevel + n)][1] = '' // -----branch上鼠标样式不能被更改（即保留它默认的样式）
      }
    }
    // console.log(this.nowState)
  }
}
</script>
<style>
.listTreeBranch{
  position: relative;
  text-align: left;
}
.branchIconBg{
  width: 20px;
  height: 20px;
  position: absolute;
  transform:translateY(-50%);
  top: 50%;
  left: 0;
}
</style>

<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的id为X，二级branch的id为：X-X，三级branch的id为：X-X-X，以此类推 -->
    <div :style="branchStyle(branchLevel+(index+1))" @click="clickBranch(branchLevel+(index+1), item.children)" :data-index="branchLevel+(index+1)" class='listTreeBranch' :id="'branch'+(branchLevel+(index+1))" @mouseover="mouseOver(branchLevel+(index+1), item.children)" @mouseout="mouseOut(branchLevel+(index+1), item.children)">
      <div class='branchIconBg' :style="branchIconBgStyle" v-if="item.children&&item.children.length>0">
        <div :id="'branchIcon'+(branchLevel+(index+1))" :style="branchIconStyle(branchLevel+(index+1))" v-if="control['branchIcon'+(branchLevel+(index+1))]==='show'"></div>
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
      control: {}, // -----------------控制各个branch,box,icon的展开或闭合以及鼠标悬停状态
      branchState: 'open',
      rightTriangleStyle: `border: 5.5px solid transparent;
                         border-left: 6px solid ${this.iconColor[0]};
                         height: 0px;
                         width: 0px;
                         position: absolute;
                         transform:translateY(-50%);
                         top: 50%;`,
      downTriangleStyle: `border: 5.5px solid transparent;
                        border-top: 6px solid ${this.iconColor[0]};
                        height: 0px;
                        width: 0px;
                        position: absolute;
                        transform:translateY(-50%);
                        top: 50%;`,
      rightDownTriangleStyle: `border: 4px solid transparent;
                             border-bottom: 4px solid ${this.iconColor[0]};
                             border-right: 4px solid ${this.iconColor[0]};
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
    open: {// -------------------------------设置初始状态下各分支展开或闭合情况
      default: 2
    },
    indent: { // -----子级分支相对父级分支的缩进距离
      default: 24
    },
    spacing: { // -----目录文字与图标间的距离
      default: 20
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
    iconColor: { // -----branch前图标三角形的颜色，数组第一个元素为图标默认颜色（必须），第二个元素为鼠标经过时的颜色（可省略）
      default: function () {
        return ['#222', '#fff']
      }
    },
    customIcon: { // -----自定义branch前的小图标，customIcon为一个数组，数组第一个元素为展开时图标的位置，第一个元素为闭合时图标的位置
      default: function () {
        return []
      }
    },
    mouseOverStyle: { // -------鼠标经过时的样式（branchStyle为鼠标经过时branch的样式，iconStyle为鼠标经过时图标的样式，如果是默认图标，在this.iconColor设置图标的颜色）
      default: function () {
        return {
          branchStyle: {
            color: 'white',
            background: 'green'
          },
          iconStyle: {
            opacity: 0.2
          }
        }
      }
    }
  },
  methods: {
    clickBranch (id) { // -----------------------------branch 点击事件
      if (this.open === 2) { // -------open为2是通过循环将所有同级别的branch都关闭
        let n = 1
        let el
        do {
          if ((this.branchLevel + n) !== id) {
            this.control['branch' + (this.branchLevel + n)][0] = 'close'
            this.renewStyle(this.branchLevel + n) // -------------------------这里renewStyle刷新的是所有同级的分支样式，函数结尾的renewStyle刷新的只是被点击的分支的style
          }
          n++
          el = document.getElementById('branch' + (this.branchLevel + n))
        } while (el)
      }

      this.control['branch' + id][0] = this.control['branch' + id][0] === 'open' ? 'close' : 'open'

      if (this.depth === 0 && this.open === 4) this.control['branch' + id][0] = 'open' // ---open为4的时候，一级分支总是处于展开状态

      this.control['branch' + id][2] = 1 // -----当点击某一个分支时，鼠标肯定是悬停在该分支上的
      this.renewStyle(id)
    },
    branchStyle (id) { // --------branch的样式
      let branchStyle = ''
      let cursor = this.control['branch' + id][1]
      if (this.control['branch' + id][0] === 'open') {
        branchStyle = this.branchOpenStyle
      } else {
        branchStyle = this.branchCloseStyle
      }
      if (this.control['branch' + id][2] === 1) {
        branchStyle += this.mouseOverBranchStyle
      }
      return `${branchStyle}
              cursor: ${cursor};`
    },
    branchBoxStyle (id) { // -------box的样式
      let theDisplay
      if (this.control['branch' + id][0] === 'open') {
        theDisplay = ''
      } else {
        theDisplay = 'none'
      }
      return `${this.boxStyle}
              display: ${theDisplay};`
    },
    branchIconStyle (id) { // -------图标的样式
      let iconStyle
      if (this.control['branch' + id][0] === 'open') {
        iconStyle = this.iconOpenStyle
      } else {
        iconStyle = this.iconCloseStyle
      }
      if (this.control['branch' + id][2] === 1) {
        iconStyle = iconStyle.replace(new RegExp(this.iconColor[0], 'gim'), this.iconColor[1])
        iconStyle += this.mouseOverIconStyle
        console.log(this.mouseOverIconStyle)
      }
      return iconStyle
    },
    renewStyle (id) { // --------刷新branch,box和icon的样式（点击或者鼠标移进移出的时候）
      let theBranchId = document.getElementById('branch' + id)
      let theIconId = document.getElementById('branchIcon' + id)
      let theBoxId = document.getElementById('branchBox' + id)

      if (theBranchId) theBranchId.style = this.branchStyle(id)
      if (theIconId) theIconId.style = this.branchIconStyle(id)
      if (theBoxId) theBoxId.style = this.branchBoxStyle(id)
    },
    mouseOver (id) { // ----------------鼠标移到branch上时修改this.control
      this.control['branch' + id][2] = 1
      this.renewStyle(id)
    },
    mouseOut (id) { // ----------------鼠标移出branch上时修改this.control
      this.control['branch' + id][2] = 0
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
    },
    mouseOverBranchStyle () { // ----鼠标移到branch上时的样式
      let overStyle = ''
      for (let key in this.mouseOverStyle.branchStyle) {
        overStyle += key + ':' + this.mouseOverStyle.branchStyle[key] + ';'
      }
      return overStyle
    },
    mouseOverIconStyle () { // ----鼠标移到branch上时icon的样式
      let overStyle = ''
      for (let key in this.mouseOverStyle.iconStyle) {
        overStyle += key + ':' + this.mouseOverStyle.iconStyle[key] + ';'
      }
      return overStyle
    }
  },
  created () {
    for (let n = 1; n < this.listData.length + 1; n++) {
      this.$set(this.control, 'branch' + (this.branchLevel + n), ['close', this.cursor, 0]) // ----------默认情况，所有branch都为闭合状态，且可以控制鼠标样式(数组第一个元素表示branch的展开或闭合状态['open'为展开，'close'为闭合]，第二个元素表示鼠标移到branch上时鼠标样式，第三个元素表示鼠标此时是否悬停在该branch上[0为否，1为是])
      this.$set(this.control, 'branchIcon' + (this.branchLevel + n), 'show') // ----------默认情况，所有icon都为显示状态('show'为显示，'hidden'为隐藏)

      if (this.open === 1) {
        this.control['branch' + (this.branchLevel + n)][0] = 'open' // ----------当open值为1时，所有branch都为展开状态
      } else if ((this.open === 3 || this.open === 4) && this.depth === 0) {
        this.control['branch' + n][0] = 'open' // ----------当open值为3或4时，所有一级branch都为展开状态
      } else if (this.open === 2 && (this.branchLevel + n) === 1) {
        this.control['branch1'][0] = 'open' // ----------当open值为2时，只有第一个一级branch为展开状态
      }
      if ((this.open === 4 && this.depth === 0) || !this.listData[n - 1].children || this.listData[n - 1].children.length === 0) {
        this.control['branchIcon' + (this.branchLevel + n)] = 'hidden' // ----------当open为4且branch为一级分支或者该branch没有children字段或children字段长度为0时，该branch前的icon为隐藏状态
        this.control['branch' + (this.branchLevel + n)][1] = '' // -----branch上鼠标样式不能被更改（即保留它默认的样式）
      }
    }
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

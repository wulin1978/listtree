<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的id为X，二级branch的id为：X-X，三级branch的id为：X-X-X，以此类推 -->
    <div :style="branchStyle(branchLevel+(index+1), item.children)" @click="clickBranch(branchLevel+(index+1), item.children)" :data-index="branchLevel+(index+1)" class='listTreeBranch' :id="'branch'+(branchLevel+(index+1))" @mouseover="mouseOver()" @mouseout="mouseOut()">
      <div class='listTreeIconBg' :style="listTreeIconBgStyle" v-if="item.children&&item.children.length>0">
        <div :id="'listTreeIcon'+(branchLevel+(index+1))" :style="listTreeIconStyle(branchLevel+(index+1), item.children)"></div>
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
      branchState: 'open',
      rightTriangleStyle: `border: 5.5px solid transparent;
                         border-left: 6px solid ${this.triangleColor};
                         height: 0px;
                         width: 0px;
                         position: absolute;
                         transform:translateY(-50%);
                         top: 50%;`,
      downTriangleStyle: `border: 5.5px solid transparent;
                        border-top: 6px solid ${this.triangleColor};
                        height: 0px;
                        width: 0px;
                        position: absolute;
                        transform:translateY(-50%);
                        top: 50%;`,
      rightDownTriangleStyle: `border: 4px solid transparent;
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
    Branch
  },
  props: {
    open: {// -------------------------------设置初始状态下各分支展开或闭合情况
      default: 1
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
    triangleColor: { // -----branch前图标三角形的颜色
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
          background: 'blue',
          color: 'white'
        }
      }
    }
  },
  methods: {
    clickBranch (id, children) { // -----------------------------branch 点击事件
      if ((this.open === 4 && (id + '').length === 1) || !children || children.length === 0) return
      let box = document.getElementById('branchBox' + id)
      let icon = document.getElementById('listTreeIcon' + id)
      let branch = document.getElementById('branch' + id)
      if (!icon) return
      if (box.style.display === 'none') {
        box.style.display = ''
        icon.style = this.iconOpenStyle
        branch.style = `${this.branchOpenStyle}
                        cursor: ${this.cursor}`
      } else {
        box.style.display = 'none'
        icon.style = this.iconCloseStyle
        branch.style = `${this.branchCloseStyle}
                        cursor: ${this.cursor}`
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
            if (bIcon) bIcon.style = this.iconCloseStyle
          }
          n++
        }
      }// -------------------------------------------------------------------------------------------------------------------------
    },
    branchStyle (i, children) { // --------初始状态时branch的样式
      let cursor = this.cursor
      let theStyle = this.branchCloseStyle
      if (this.open === 1 || ((this.open === 3 || this.open === 4) && (i + '').length === 1)) { // open等于1时或者open等于3或者4并且branch为一级分支时，这2种情况branch初始状态是展开的
        theStyle = this.branchOpenStyle
      }
      if ((this.open === 4 && (i + '').length === 1) || !children || children.length === 0) {
        cursor = ''
      }
      return `${theStyle}
              cursor: ${cursor};`
    },
    branchBoxStyle (i, children) { // -------初始状态时box的样式
      let theDisplay = 'none' // ---默认情况下每个branch为闭合状态
      if (this.open === 1 || ((this.open === 3 || this.open === 4) && (i + '').length === 1)) { // open等于1时或者open等于3或者4并且branch为一级分支时，这2种情况branch初始状态是展开的
        theDisplay = ''
      }
      return `${this.boxStyle}
              display: ${theDisplay};`
    },
    listTreeIconStyle (i, children) { // -------初始状态时图标的样式
      let iconStyle = this.iconCloseStyle
      let theDisplay = ''
      if (this.open === 1 || ((this.open === 3 || this.open === 4) && (i + '').length === 1)) {
        iconStyle = this.iconOpenStyle
        if (this.open === 4 && (i + '').length === 1) theDisplay = 'none'
      }
      return `${iconStyle}
              display: ${theDisplay};`
    },
    mouseOver () {
      let el = document.getElementById(event.target.id)
      let theStyle = ''
      for (let key in this.mouseOverStyle) {
        theStyle += key + ':' + this.mouseOverStyle[key] + ';'
      }
      el.style = el.style.cssText + theStyle
    },
    mouseOut () {
      let el = document.getElementById(event.target.id)
      let theStyle = ''
      for (let key in this.mouseOverStyle) {
        theStyle += key + ': ' + this.mouseOverStyle[key] + '; '
      }
      theStyle = theStyle.replace(/\s+/g, '')
      let oldStyle = el.style.cssText.replace(/\s+/g, '')
      el.style = oldStyle.replace(theStyle, '')
      console.log(oldStyle.replace(theStyle, ''))
    }
  },
  computed: {
    listTreeIconBgStyle () { // ----图标背景层距离左边的距离，控制图标的位置
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
      let theStyle = ''
      for (let key in this.mouseOverStyle) {
        theStyle += `
                    ${key}: ${this.mouseOverStyle[key]}`
      }
      return `${theStyle}`
    }
    // branchBoxStyle () { // -------每个branch分支下box的样式
    //   let theDisplay = this.branchState === 'open' ? '' : 'none'
    //   return `padding-left: ${this.indent}px;
    //           display: ${theDisplay};`
    // },
    // branchStyle () { // --------每个branch的样式
    //   return `padding-left:  ${this.spacing}px;
    //           cursor: ${this.cursor};`
    // },
    // listTreeIconStyle () { // -------branch前面小图标的样式
    //   let iconStyle
    //   if (this.branchState === 'close') {
    //     iconStyle = this.rightTriangleStyle
    //   } else {
    //     iconStyle = this.rightDownTriangleStyle
    //   }
    //   return iconStyle
    // },
    // branchLevel_0_BoxStyle () { // ---------所有一级branch下box的样式
    //   let theDisplay = this.branchState === 'open' ? '' : 'none'
    //   if (this.open === 3 || this.open === 4) {
    //     theDisplay = ''
    //   }
    //   return `${this.branchBoxStyle}
    //           display: ${theDisplay};`
    // }
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

<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的index为X，二级branch的index为：X-X，三级branch的index为：X-X-X，以此类推 -->
    <a :href="item.router">
      <div :id="'lt-branch_'+(branchLevel+(index+1))"
          :data-index="branchLevel+(index+1)"
          :class="['lt-branch','lt-branchlevel_'+(depth+1),{'lt-branchlevel_0':(!item.children||item.children.length===0)}]"
          :style="branchStyle(branchLevel+(index+1))"
          @click.prevent="clickBranch(branchLevel+(index+1), item.router)"
          @mouseover="mouseOver(branchLevel+(index+1))"
          @mouseout="mouseOut(branchLevel+(index+1))">
        <div :id="'lt-branchIconbg_'+(branchLevel+(index+1))"
             class='lt-branchIconBg'
             :style="branchIconBgStyle"
             v-if="item.children&&item.children.length>0">
          <span :id="'lt-branchIcon_'+(branchLevel+(index+1))"
                :class='branchIconClassName(branchLevel+(index+1))'
                :style="branchIconStyle(branchLevel+(index+1))"
                v-if="control['lt-branchIcon_'+(branchLevel+(index+1))]==='show'"></span>
        </div>
        {{item.name}}
      </div>
    </a>
    <!--=============== box ================= 每个branch下都有个box层，branch所有的下级分支都在box内，branch的展开和闭合就可以用box的显示隐藏来实现。另外box与左边框的距离可以实现上下级branch的缩进 -->
    <div :style="branchBoxStyle(branchLevel+(index+1), item.children)" :id="'branchBox'+(branchLevel+(index+1))">
      <branch @getClickBranchIndex="getIndex"
              :clickBranchIndex="clickBranchIndex"
              :listData="item.children"
              :indent="indent" v-if="item.children&&item.children.length>0"
              :branchLevel="branchLevel+(index+1)+'-'" :depth="depth+1" :treerouter="treerouter"></branch>
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
      mouseOverIndex: 0, // -----鼠标正悬停的branch的index号
      branchState: 'open',
      triangleColor: this.icon.color[0]
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
    clickBranchIndex: '', // -----------被点击的分支index，由父组件传过来
    treerouter: {
      default: function () {
        return {}
      }
    },
    listData: { // -----------json格式的数据，每个分支目录有name,router,icon,children四个个字段，name为分支的文字内容（必须有）。router为点击分支时跳转的路由地址,如果不跳转可省略router字段。icon为该分支前的图标地址（包括展开时和闭合时的图标，所以icon是个数组），如果使用默认图标icon字段可以省略。children为该分支的下级分支，如果没有下级分支children字段也可以省略
      default: function () {
        return []
      }
    },
    open: {// -------------------------------设置初始状态下各分支展开或闭合情况
      default: 1
    },
    indent: { // -----子级分支相对父级分支的缩进距离
      default: 24
    },
    spacing: { // -----目录文字与图标间的距离
      default: 18
    },
    left: { // ---列表树与左边框之间的距离
      default: 8
    },
    branchSpacing: { // ----垂直方向上分支之间间隔
      default: 15
    },
    cursor: { // -----鼠标移到branch上时指针的样式
      default: 'pointer'
    },
    icon: {
      default: function () {
        return {
          /* source为 default 的时候图标使用默认的三角图标，source为数组且数组内元素为图片地址的时候，图标为自定义图片，source为数组且数组内元素为className的时候，图标为第三方库图标。数组第一个元素为展开时图标的位置，第二个元素为闭合时图标的位置。自定义图片须放在static文件夹里 */
          // source: 'default',
          // source: ['fa fa-folder-open', 'fa fa-folder'],
          source: ['../static/arrow_triangle-down.png', '../static/arrow_triangle-right.png'],
          style: '', // ---------style 对默认图标和自定义图标都有效
          size: 'middle', // ----------size 只对默认图标有效
          color: ['#222', '#fff'] // --color 默认图标和第三方图标有效，对自定义图片无效，数组第一个元素是图标颜色，第二个元素为鼠标经过branch时图标的颜色（可省略，省略时表示鼠标经过时icon不变色，所以在下面created中要判断这个值是否省略，如果省略需要将this.icon.color[1]的值设置为和this.icon.color[0]一样）
        }
      }
    },
    mouseOverStyle: { // -------鼠标经过时的样式（branchStyle为鼠标经过时branch的样式，iconStyle为鼠标经过时图标的样式，如果是默认图标，在this.icon设置图标的各属性）
      default: function () {
        return {
          branchStyle: {},
          iconStyle: {} // ----iconStyle 对默认图标和自定义图标都有效
        }
      }
    }
  },
  methods: {
    clickBranch (id, router) { // -----------------------------branch 点击事件--------------------------------
      if (this.open === 2) { // -------open为2时通过循环将所有同级别的branch都关闭
        let n = 1
        let el
        do {
          if ((this.branchLevel + n) !== id) {
            this.control['lt-branch_' + (this.branchLevel + n)][0] = 'close'
            this.renewStyle(this.branchLevel + n) // -------------------------这里renewStyle刷新的是所有同级的分支样式，函数结尾的renewStyle刷新的只是被点击的分支的style
          }
          n++
          el = document.getElementById('lt-branch_' + (this.branchLevel + n))
        } while (el)
      }

      this.control['lt-branch_' + id][0] = this.control['lt-branch_' + id][0] === 'open' ? 'close' : 'open'

      if (this.depth === 0 && this.open === 4) this.control['lt-branch_' + id][0] = 'open' // ---open为4的时候，一级分支总是处于展开状态

      this.renewStyle(id)
      console.log(this.clickBranchIndex)
      if (router) {
        this.treerouter.push(router)
        this.setActiveClass(this.clickBranchIndex, id)
      }
    },
    getIndex (index) { // ---------------------------------获取当前点击的branch的index，
      this.$emit('getClickBranchIndex', index) // ---------并把该index值通过自定义事件传给父组件
      // this.clickBranchIndex_data = index // ---------------同时把该nowclickId值赋予本组件data中的clickBranchIndex_data
    },
    mouseOver (id) { // ----------------鼠标移到branch上时修改this.control------------------------
      this.mouseOverIndex = id
      this.renewStyle(id)
    },
    mouseOut (id) { // ----------------鼠标移出branch上时修改this.control--------------------------
      this.mouseOverIndex = 0
      this.renewStyle(id)
    },
    branchStyle (id) { // --------branch的样式
      let branchStyle = ''
      let cursor = this.control['lt-branch_' + id][1]
      if (this.control['lt-branch_' + id][0] === 'open') {
        branchStyle = this.branchOpenStyle
      } else {
        branchStyle = this.branchCloseStyle
      }
      if (this.mouseOverIndex === id) {
        branchStyle += this.mouseOverBranchStyle
      }
      return `position: relative;
              text-align: left;
              ${branchStyle}
              cursor: ${cursor};`
    },
    branchBoxStyle (id) { // -------------------------------------box的样式-----------------------
      let theDisplay
      if (this.control['lt-branch_' + id][0] === 'open') {
        theDisplay = ''
      } else {
        theDisplay = 'none'
      }
      return `${this.boxStyle}
              display: ${theDisplay};`
    },
    branchIconStyle (id) { // ---------------------------------图标的样式-------------------------
      let iconStyle
      if (this.control['lt-branch_' + id][0] === 'open') { // ----------分支展开或闭合的情况
        iconStyle = this.iconOpenStyle
      } else {
        iconStyle = this.iconCloseStyle
      }
      if (this.mouseOverIndex === id) { // ---------如果鼠标悬停在该分支上
        iconStyle += this.mouseOverIconStyle
        // ------------使用第三方图标时鼠标经过时，需要先把设置该颜色的css语句删除再重新添加设置鼠标经过颜色的css语句，而不能简单的把鼠标经过的颜色替换原先的颜色，因为在iconStyle中也许用户会添加设置颜色的css，这个css语句也许会覆盖你想要的css语句，但如果我们在它后面新添加一个css语句就不会被覆盖了
        iconStyle = iconStyle.replace(new RegExp('color:' + this.icon.color[0] + ';', 'gim'), '')
        iconStyle = iconStyle.replace(new RegExp('color: ' + this.icon.color[0] + ';', 'gim'), '') // ---把鼠标经过之前的颜色删掉
        iconStyle += `color: ${this.icon.color[1]};` // -----使用第三方图标时修改图标的颜色为鼠标经过的颜色

        iconStyle = iconStyle.replace(new RegExp('solid ' + this.icon.color[0], 'gim'), 'solid ' + this.icon.color[1]) // ---使用默认三角图标时，设置鼠标经过的颜色时只需将这个颜色覆盖原来的颜色就可以了
      } else {
        iconStyle = iconStyle.replace(new RegExp('solid ' + this.icon.color[1], 'gim'), 'solid ' + this.icon.color[0])
      }
      return iconStyle
    },
    branchIconClassName (id) { // ------------------------图标的className(当使用第三方图标库时需要设定className)-------------------
      let iconClass
      if (this.control['lt-branch_' + id][0] === 'open') {
        iconClass = this.iconOpenClassName
      } else {
        iconClass = this.iconCloseClassName
      }
      return iconClass
    },
    renewStyle (id) { // --------刷新branch,box和icon的样式（点击或者鼠标移进移出的时候）
      let theBranchId = document.getElementById('lt-branch_' + id)
      let theIconId = document.getElementById('lt-branchIcon_' + id)
      let theBoxId = document.getElementById('branchBox' + id)

      if (theBranchId) theBranchId.style.cssText = this.branchStyle(id)
      if (theIconId) {
        theIconId.style.cssText = this.branchIconStyle(id)
        theIconId.className = this.branchIconClassName(id)
      }
      if (theBoxId) theBoxId.style.cssText = this.branchBoxStyle(id)
    },
    setActiveClass (lastclickId, nowclickId) { // --------------------设置active className
      if (lastclickId !== nowclickId) {
        // ----删除branch上的活动className(这里的参数lastclickId是上次点击的branch的index)
        let theClickId = document.getElementById('lt-branch_' + lastclickId)
        if (theClickId) {
          theClickId.className = theClickId.className.replace(' lt-branch_active', '')
          for (let n = 0; n < this.listData.length; n++) {
            let theId = lastclickId.toString().split('-')
            let thisId0 = document.getElementById('lt-branch_' + theId[0])
            thisId0.className = thisId0.className.replace(' lt-branchlevel_active_1', '')

            let theIdN = theId[0]
            for (let n = 1; n < theId.length; n++) {
              theIdN += '-' + theId[n]
              let thisIdN = document.getElementById('lt-branch_' + theIdN)
              thisIdN.className = thisIdN.className.replace(' lt-branchlevel_active_' + (n + 1), '')
            }
          }
        }
        // -------增加branch的活动className，包括其所有祖先分支都增加活动className，活动className命名规则：一级分支为 lt-branchlevel_active_1，二级分支为 lt-branchlevel_active_2，三级分支为 lt-branchlevel_active_3，以此类推。当前被点击的分支的活动className为：lt-branch_active。
        let theId = nowclickId.toString().split('-')
        document.getElementById('lt-branch_' + theId[0]).className += ' lt-branchlevel_active_1'

        let theIdN = theId[0]
        for (let n = 1; n < theId.length; n++) {
          theIdN += '-' + theId[n]
          document.getElementById('lt-branch_' + theIdN).className += ' lt-branchlevel_active_' + (n + 1)
        }
        document.getElementById('lt-branch_' + nowclickId).className += ' lt-branch_active'
      }
      this.$emit('getClickBranchIndex', nowclickId) // -----自定义事件，向父组件传递当前点击的分支的index
      // this.clickBranchIndex_data = nowclickId // ----------------同时把该index值赋予本组件data中的clickBranchIndex_data
    }
  },
  computed: {
    rightTriangleStyle () {
      return `border: .35em solid transparent;
              border-left: .45em solid ${this.triangleColor};
              height: 0px;
              width: 0px;
              position: absolute;
              transform:translateY(-50%);
              top: 50%;`
    },
    downTriangleStyle () {
      return `border: .35em solid transparent;
              border-top: .45em solid ${this.triangleColor};
              height: 0px;
              width: 0px;
              position: absolute;
              transform:translateY(-50%);
              top: 50%;`
    },
    rightDownTriangleStyle () {
      return `border: .25em solid transparent;
              border-bottom: .25em solid ${this.triangleColor};
              border-right: .25em solid ${this.triangleColor};
              height: 0px;
              width: 0px;
              position: absolute;
              transform:translateY(-50%);
              top: 50%;`
    },
    branchIconBgStyle () { // ----图标背景层距离左边的距离，控制图标的位置，该图层的font-size可以控制图标尺寸
      let fontSize = '12px'
      let theLeft = this.indent * this.depth + this.left
      if (this.icon.size === 'large') {
        fontSize = '20px'
      } else if (this.icon.size === 'middle') {
        fontSize = '16px'
      }
      return `left: ${theLeft}px;
              font-size: ${fontSize}`
    },
    iconOpenStyle () { // -----图标展开时的样式
      if (typeof this.icon.source === 'object') {
        if (this.icon.source[0].indexOf('/') > -1) { // -----------此时用户使用自定义图片来作为图标
          return `position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  background: url('${this.icon.source[0]}') center no-repeat;`
        } else { // ---------------------------------------------此时用户使用第三方图标库来作为图标
          return `position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  color: ${this.icon.color[0]};`
        }
      }
      return this.rightDownTriangleStyle
    },
    iconCloseStyle () { // -----图标闭合时的样式
      if (typeof this.icon.source === 'object') {
        if (this.icon.source[0].indexOf('/') > -1) {
          return `position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  background: url('${this.icon.source[1]}') center no-repeat;`
        } else {
          return `position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  color: ${this.icon.color[0]};`
        }
      }
      return this.rightTriangleStyle
    },
    iconOpenClassName () {
      if (typeof this.icon.source === 'object' && this.icon.source[0].indexOf('/') === -1) {
        return this.icon.source[0]
      }
      return ''
    },
    iconCloseClassName () {
      if (typeof this.icon.source === 'object' && this.icon.source[1].indexOf('/') === -1) {
        return this.icon.source[1]
      }
      return ''
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
    if (!this.icon.color[1] || this.icon.color[1] === '') {
      this.icon.color[1] = this.icon.color[0]
    }
    /*
    将类似于下面 control 的值赋给data中的control，这样的话，就可通过this.control.branchLevel1[0]的值来控制分支branchLevel1的展开或闭合，通过控制this.control.branchLevel1[1]的值来控制鼠标经过分支branchLevel1时的样式。其中branchLevel1中的1与每个分支中的data-index相同，这样每个分支在control中都有个对应的值来控制和判断它的状态。
    control: {
      branchLevel1: ['close',  this.cursor],
      branchLevel2: ['close',  this.cursor],
      branchLevel3: ['close',  this.cursor],
    }
     */
    for (let n = 1; n < this.listData.length + 1; n++) {
      this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), ['close', this.cursor]) // ----------默认情况，所有branch都为闭合状态，且可以控制鼠标样式(数组第一个元素表示branch的展开或闭合状态['open'为展开，'close'为闭合]，第二个元素表示鼠标移到branch上时鼠标样式
      this.$set(this.control, 'lt-branchIcon_' + (this.branchLevel + n), 'show') // ----------默认情况，所有icon都为显示状态('show'为显示，'hidden'为隐藏)

      if (this.open === 1) {
        this.control['lt-branch_' + (this.branchLevel + n)][0] = 'open' // ----------当open值为1时，所有branch都为展开状态
      } else if ((this.open === 3 || this.open === 4) && this.depth === 0) {
        this.control['lt-branch_' + n][0] = 'open' // ----------当open值为3或4时，所有一级branch都为展开状态
      } else if (this.open === 2 && (this.branchLevel + n) === 1) {
        this.control['lt-branch_1'][0] = 'open' // ----------当open值为2时，只有第一个一级branch为展开状态
      }
      if ((this.open === 4 && this.depth === 0) || !this.listData[n - 1].children || this.listData[n - 1].children.length === 0) {
        this.control['lt-branchIcon_' + (this.branchLevel + n)] = 'hidden' // ----------当open为4且branch为一级分支或者该branch没有children字段或children字段长度为0时，该branch前的icon为隐藏状态
        this.control['lt-branch_' + (this.branchLevel + n)][1] = '' // -----branch上鼠标样式不能被更改（即保留它默认的样式）
      }
    }
    // console.log(this.clickBranchIndex)
  }
}
</script>
<style>
@import url('Font-Awesome/css/font-awesome.min.css');
.lt-branchIconBg{
  width: 20px;
  height: 20px;
  position: absolute;
  transform:translateY(-50%);
  top: 50%;
  left: 0;
}
</style>

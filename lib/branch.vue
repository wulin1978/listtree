<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的index为X，二级branch的index为：X-X，三级branch的index为：X-X-X，以此类推 -->
    <a :href="item.router">
      <div :id="'lt-branch_'+(branchLevel+(index+1))"
          :data-index="branchLevel+(index+1)"
          :class="branchClassName(branchLevel+(index+1))"
          :style="branchStyle(branchLevel+(index+1))"
          @click.prevent="clickBranch(branchLevel+(index+1), item.router)">
        <div :id="'lt-branch-Icon-bg_'+(branchLevel+(index+1))"
             class='lt-branch-Icon-Bg'
             :style="branchIconBgStyle"
             v-if="getIcon&&item.children&&item.children.length>0">
          <span :id="'lt-branch-Icon_'+(branchLevel+(index+1))"
                :class='branchIconClassName(branchLevel+(index+1))'
                :style="branchIconStyle(branchLevel+(index+1))"
                v-if="control['lt-branch-Icon_'+(branchLevel+(index+1))]==='show'"></span>
        </div>{{item.name}}</div>
    </a>
    <!--=============== animation ================= 每个branch下都有个animation层，是用来实现伸缩动画的 -->
    <div :id="'lt-branch-animation_'+(branchLevel+(index+1))"
         :style="branchAnimationStyle(branchLevel+(index+1))">
      <!--=============== box ================= 每个branch下都有个box层，branch所有的下级分支都在box内，branch的展开和闭合就可以用box的显示隐藏来实现。另外box与左边框的距离可以实现上下级branch的缩进 -->
      <div :id="'lt-branch-Box_'+(branchLevel+(index+1))"
          :style="branchBoxStyle(branchLevel+(index+1), item.children)">
        <branch :listData="item.children"
                :treerouter="treerouter"
                :open="open"
                :indent="indent"
                :spacing="spacing"
                :left="left"
                :branchSpacing="branchSpacing"
                :cursor="cursor"
                :icon="icon"
                :animation="animation"
                :clickBranchIndex="clickBranchIndex"
                @getClickBranchIndex="getIndex"
                :branchLevel="branchLevel+(index+1)+'-'"
                :depth="depth+1"
                v-if="item.children&&item.children.length>0"></branch>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Branch from './branch'
import IconFont from './icon.json'

export default {
  name: 'branch',
  data () {
    return {
      control: {}, // -----------------控制各个branch,box,icon的展开或闭合状态
      animationTime: 3 // -----------动画执行时间
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
    treerouter: { // ------------------------路由信息
      default: function () {
        return {}
      }
    },
    // -------------------------------------------以上props内容用户不能控制，以下props用户可以设置-------------------------------
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
      default: 1 // ------icon等于0时表示用户不需要图标，为大于0的整数时为系统自带的图标，为数组时为自定义图标（Font-Awesome和阿里巴巴图标）作为图标，数组第一个元素为展开时图标，第二个元素为闭合时图标，当数组内元素为图片地址时，也可以用自定义图片做图标
    },
    animation: {
      default: 1
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
            this.renewStyle([this.branchLevel + n]) // -------------------------这里renewStyle刷新的是所有同级的分支样式，函数结尾的renewStyle刷新的只是被点击的分支的style
          }
          n++
          el = document.getElementById('lt-branch_' + (this.branchLevel + n))
        } while (el)
      }

      this.control['lt-branch_' + id][0] = this.control['lt-branch_' + id][0] === 'open' ? 'close' : 'open'

      if (this.depth === 0 && this.open === 4) this.control['lt-branch_' + id][0] = 'open' // ---open为4的时候，一级分支总是处于展开状态

      if (router) {
        this.treerouter.push(router)
        this.$emit('getClickBranchIndex', id)
      }
      this.renewStyle([id])
    },
    getIndex (index) { // ---------------------------------获取当前点击的branch的index，
      this.$emit('getClickBranchIndex', index) // ---------并把该index值通过自定义事件传给父组件
    },
    branchStyle (id) { // --------branch的样式
      let branchStyle = ''
      let cursor = this.control['lt-branch_' + id][1]
      if (this.control['lt-branch_' + id][0] === 'open') {
        branchStyle = this.branchOpenStyle
      } else {
        branchStyle = this.branchCloseStyle
      }
      return `position: relative;
              text-align: left;
              ${branchStyle}
              cursor: ${cursor};`
    },
    branchClassName (id) { // ------------branch的className
      let branchClass = ''
      let theId = id.toString()
      let theChildren = ''
      let theData = ''

      if (this.depth === 0) { // --获取branch的children值，如果该branch没有children(即没有子分支)，就给它加上lt-branch_level_0样式
        theData = this.listData[id - 1]
        if (theData.children) theChildren = theData.children
      } else {
        theData = this.listData[theId.replace(this.branchLevel, '') - 1]
        if (theData.children) theChildren = theData.children
      }

      branchClass = 'lt-branch lt-branch_level_' + (this.depth + 1)
      if (theChildren.length === 0) { // ------如果branch没有子分支，就给branch加上 lt-branch_level_0 样式
        branchClass += ' lt-branch_level_0'
      }
      if (theId === this.clickBranchIndex.toString().substring(0, theId.length)) { // ------判断是否为当前active状态branch的祖先，如果是就加上active状态的className
        branchClass += ' lt-branch_level_active_' + (this.depth + 1)
      }
      if (theId === this.clickBranchIndex) { // ------判断是否为当前active状态branch，如果是就加上active状态的className
        branchClass += ' lt-branch_active'
      }
      return branchClass
    },
    branchIconStyle (id) { // ---------------------------------图标的样式-------------------------
      if (this.icon === 0) return ''
      let iconStyle
      if (this.control['lt-branch_' + id][0] === 'open') { // ----------分支展开或闭合的情况
        iconStyle = this.iconOpenStyle
      } else {
        iconStyle = this.iconCloseStyle
      }
      return iconStyle
    },
    branchIconClassName (id) { // ---------------图标的className(当使用默认图标或第三方图标库时需要设定className)-------------------
      let iconClass = 'lt-branch-Icon '
      if (this.control['lt-branch_' + id][0] === 'open') {
        iconClass += this.iconOpenClassName
      } else {
        iconClass += this.iconCloseClassName
      }

      let theId = id.toString()
      let theChildren = ''
      let theData = ''

      if (this.depth === 0) { // --获取branch的children值，如果该branch没有children(即没有子分支)，就给它加上lt-branch_level_0样式
        theData = this.listData[id - 1]
        if (theData.children) theChildren = theData.children
      } else {
        theData = this.listData[theId.replace(this.branchLevel, '') - 1]
        if (theData.children) theChildren = theData.children
      }

      if (theChildren.length === 0) { // ------如果branch没有子分支，就给branch加上 lt-branch-icon_level_0 样式
        iconClass += ' lt-branch-icon_level_0'
      }
      if (theId === this.clickBranchIndex.toString().substring(0, theId.length)) { // ------判断是否为当前active状态branch的祖先，如果是就加上active状态的className
        iconClass += ' lt-branch-Icon_level_active_' + (this.depth + 1)
      }
      if (theId === this.clickBranchIndex) { // ------判断是否为当前active状态branch，如果是就加上active状态的className
        iconClass += ' lt-branch-Icon_active'
      }
      return iconClass
    },
    branchAnimationStyle (id) { // ----animation的样式
      if (this.clickBranchIndex !== id) { // ------点击带有router属性的分支时，都会到祖先组件更新clickBranchIndex，祖先组件再把clickBranchIndex传给子组件，那么组件中的animation层就会立即闭合或展开，而动画由于是用setTimeout函数执行，它会在vue的下一帧才执行完，可那时候branch的状态已经发生改变，本来是执行展开动画的，可是动画还没执行就已经展开了，或者本来执行闭合动画的，动画还没执行branch就已经闭合了，所以这里禁止正在执行动画的branch改变状态（也就是this.clickBranchIndex不能等于当前id）
        let theStyle = ''
        if (this.control['lt-branch_' + id][0] === 'open') {
          theStyle += this.animationOpenStyle
        } else {
          theStyle += this.animationCloseStyle
        }
        return theStyle
      }
    },
    branchBoxStyle (id) { // -------------------------------------box的样式-----------------------
      // let elAnimation = document.getElementById('lt-branch-Animation_' + id)
      // let elBox = document.getElementById('lt-branch-Box_' + id)
      // console.log(elBox)
      // if (this.control['lt-branch_' + id][0] === 'open') { /* 页面加载的时候animation设置高度没有成功，这里补充设置 */
      //   elAnimation.style.height = `${elBox.offsetHeight}px`
      // } else {
      //   elAnimation.style.height = '0px'
      // }
      return `margin:0px;
              padding:0px;
              border:0px;
              ${this.boxStyle}`
    },
    renewStyle (arr) { // --------刷新branch,box和icon的样式（点击或者鼠标移进移出的时候）(arr里面包含的index都刷新)
      for (let n = 0; n < arr.length + 1; n++) {
        let id = arr[n]
        let theBranchId = document.getElementById('lt-branch_' + id)
        let theIconId = document.getElementById('lt-branch-Icon_' + id)
        let theAnimationId = document.getElementById('lt-branch-animation_' + id)

        if (theBranchId) {
          theBranchId.style.cssText = this.branchStyle(id)
          theBranchId.className = this.branchClassName(id)
        }
        if (theIconId) {
          theIconId.style.cssText = this.branchIconStyle(id)
          theIconId.className = this.branchIconClassName(id)
        }
        if (theAnimationId) {
          if (this.animation === 0 || this.animation === false) {
            theAnimationId.style.cssText = this.branchAnimationStyle(id)
          } else {
            this.doAnimation(id)
          }
        }
      }
    },
    doAnimation (id) { // --------------------------------展开收缩动画--------------------------------------------
      let elAnimation = document.getElementById('lt-branch-animation_' + id)
      elAnimation.style.display = 'block'
      let elBox = document.getElementById('lt-branch-Box_' + id)
      let boxH = elBox.offsetHeight
      let animationH = elAnimation.offsetHeight
      elAnimation.style.overflowY = 'hidden'
      /* 发现将overflow设为hidden后，div里的内容和边框的距离会增加， 所以这里暂时将elBox的margin-top设为负值以抵消和边框距离的增加 */
      elBox.style.marginTop = '-15px'

      let addHeight = 5 // -----每次增加或减小的高度
      if (this.control['lt-branch_' + id][0] === 'open') { // -----当前该id的状态open是点击branch后改的，改动后立即执行animation，说明原来是闭合的，现在要在animation里面通过动画的方式展开来
        console.log(this.control['lt-branch_' + id] + ':' + animationH + '///' + boxH)
        elAnimation.style.height = (animationH + addHeight) + 'px'
        if (animationH > boxH || animationH === boxH) { // -------如果elAnimation的高大于elBox的高，把elAnimation的style设为animationOpenStyle，同时退出循环
          elAnimation.style.cssText = this.animationOpenStyle
          elBox.style.marginTop = ''
          return
        }
      } else {
        if (animationH < addHeight || animationH === addHeight) { // -------如果elAnimation的高小于等于addHeight，把elAnimation的style设为animationCloseStyle，同时退出循环
          console.log(animationH + '????' + this.control['lt-branch_' + id])
          elAnimation.style.cssText = this.animationCloseStyle
          elBox.style.marginTop = ''
          return
        }
        console.log(this.control['lt-branch_' + id] + ':' + animationH + '///' + boxH)
        console.log(elAnimation.offsetHeight + '####')
        elAnimation.style.height = (animationH - 5) + 'px'
        console.log(elAnimation.offsetHeight + '@@@@')
      }

      console.log(elAnimation.offsetHeight + '///111111|||' + this.clickBranchIndex)
      setTimeout(() => {
        console.log(elAnimation.offsetHeight + '///0000000000|||' + this.clickBranchIndex)
        this.doAnimation(id)
      }, this.animationTime)
    }
  },
  computed: {
    iconIsTrue () { // ------判断用户是否设置icon为false
      if (this.icon === false) return false
      return true
    },
    getIcon () { // ---------图标来源，用户设置完来源后全部在这里集成
      let icon = this.icon
      if (icon === '' || icon === 'undefined') icon = 1
      if (!isNaN(parseInt(icon))) {
        if (icon === 0 || icon === false) return false // -----icon等于0或者false时不显示图标
        icon = IconFont['icon' + icon] // ----------把icon.json里的数据赋予icon
      }
      console.log(this.icon)
      return icon // -----不管用户是使用系统默认图标、自定义图片还是使用第三方图标，icon都为数组，数组第一个元素为展开时的图标，第二个元素为闭合时图标
    },
    branchIconBgStyle () { // ----图标背景层距离左边的距离，控制图标的位置，该图层的font-size可以控制图标尺寸
      if (!this.iconIsTrue) return ''
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
      if (this.getIcon[0].indexOf('/') > -1) { // -----------this.getIcon中的元素包含“/”说明用户使用自定义图片作为图标
        return `position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: url('${this.getIcon[0]}') center no-repeat;`
      } else { // ---------------------------------------------此时用户使用默认图标或第三方图标库来作为图标
        return `position: absolute;
                top: 50%;
                transform: translateY(-50%);`
      }
    },
    iconCloseStyle () { // -----图标闭合时的样式
      if (this.getIcon[0].indexOf('/') > -1) { // -----------this.getIcon中的元素包含“/”说明用户使用自定义图片作为图标
        return `position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: url('${this.getIcon[1]}') center no-repeat;`
      } else { // ---------------------------------------------此时用户使用默认图标或第三方图标库来作为图标
        return `position: absolute;
                top: 50%;
                transform: translateY(-50%);`
      }
    },
    iconOpenClassName () { // ----------展开时图标层的className
      if (!this.getIcon) return ''
      if (this.getIcon[0].indexOf('/') === -1) { // ---如果图标是使用默认图标或第三方图标
        return this.getIcon[0]
      }
      return ''
    },
    iconCloseClassName () { // ----------闭合时图标层的className
      if (!this.getIcon) return ''
      if (this.getIcon[1].indexOf('/') === -1) { // ---如果图标是使用默认图标或第三方图标
        return this.getIcon[1]
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
    animationOpenStyle () {
      return `margin:0px;
              padding:0px;
              border:0px;`
    },
    animationCloseStyle () {
      return `margin:0px;
              padding:0px;
              border:0px;
              height:0px;
              display:none;`
    },
    boxStyle () {
      return ''
    }
  },
  created () {
    /*
    将类似于下面 control 的值赋给data中的control，这样的话，就可通过this.control.branchLevel1[0]的值来控制分支branchLevel1的展开或闭合，通过控制this.control.branchLevel1[1]的值来控制鼠标经过分支branchLevel1时的样式。其中branchLevel1中的1与每个分支中的data-index相同，这样每个分支在control中都有个对应的值来控制和判断它的状态。
    control: {
      lt-branch_1: ['close',  this.cursor],
      lt-branch_2: ['close',  this.cursor],
      lt-branch_3: ['close',  this.cursor],
    }
     */
    for (let n = 1; n < this.listData.length + 1; n++) {
      this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), ['close', this.cursor]) // ----------默认情况，所有branch都为闭合状态，且可以控制鼠标样式(数组第一个元素表示branch的展开或闭合状态['open'为展开，'close'为闭合]，第二个元素表示鼠标移到branch上时鼠标样式
      this.$set(this.control, 'lt-branch-Icon_' + (this.branchLevel + n), 'show') // ----------默认情况，所有icon都为显示状态('show'为显示，'hidden'为隐藏)

      if (this.open === 1) {
        this.control['lt-branch_' + (this.branchLevel + n)][0] = 'open' // ----------当open值为1时，所有branch都为展开状态
      } else if ((this.open === 3 || this.open === 4) && this.depth === 0) {
        this.control['lt-branch_' + n][0] = 'open' // ----------当open值为3或4时，所有一级branch都为展开状态
      } else if (this.open === 2 && (this.branchLevel + n) === 1) {
        this.control['lt-branch_1'][0] = 'open' // ----------当open值为2时，只有第一个一级branch为展开状态
      }
      if ((this.open === 4 && this.depth === 0) || !this.listData[n - 1].children || this.listData[n - 1].children.length === 0) {
        this.control['lt-branch-Icon_' + (this.branchLevel + n)] = 'hidden' // ----------当open为4且branch为一级分支或者该branch没有children字段或children字段长度为0时，该branch前的icon为隐藏状态
        this.control['lt-branch_' + (this.branchLevel + n)][1] = '' // -----branch上鼠标样式不能被更改（即保留它默认的样式）
      }
    }
  }
}
</script>
<style>
@import url("//at.alicdn.com/t/font_722547_htppq8yd7b.css");

.iconfont {
    font-family:"iconfont" !important;
    font-style:normal;
    font-weight: normal;
    font-size:20px;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.lt-branch-Icon-Bg{
  width: 20px;
  height: 20px;
  position: absolute;
  transform:translateY(-50%);
  top: 50%;
  left: 0;
}
</style>

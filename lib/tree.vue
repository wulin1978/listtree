<template>
  <div class='tree'></div>
</template>
<script>
/* eslint-disable spaced-comment */
export default {
  name: 'mytree',
  data () {
    return {
      /* 展开方式：当open为0时所有目录初始状况下全部关闭。当open为1时所有目录初始状况下全部展开。当open为2时所有目录初始状况下全部关闭，并且同时只能展开一个目录。当open为3时初始状态下所有顶级目录展开，其他目录关闭。当open为4时初始状态下所有顶级目录展开，其他目录关闭，并且顶级目录始终保持展开不能被闭合 */
      open: 1,
      /* 目录前是否带图标：ifIcon为true时，每级目录前带有表示展开或关闭的图标，展开或关闭的图标路径可通过样式表里的imgtitleopen或imgtitleclose来设定 */
      ifIcon: true,
      /* 当某个底级目录（所谓底级目录即其下面没有子目录）被点击时，其祖先目录中的一级目录会被改变样式。如果把数字改为2，则祖先目录中的二级目录会被改变样式 */
      checkedparents: 1,
      /* allellist收集了所有目录父元素div的信息，通过循环allellist可操作任意目录样式 */
      allellist: []
    }
  },
  props: ['list'],
  methods: {
    /* mylist函数把从外部读取的数组转化为树形结构，x为代表目录信息的数组，parent为目录的父元素，t为中介参数，用来传递arr的值，arr的值包含了目录在树状结构中所处级别和位置的信息 */
    mylist (x, parent, t = []) {
      let _this = this
      if (x.length > 0) {
        /* 设定arr的值，使arr的长度和目录在树状结构中所处级别对应，arr内元素的值和目录位置对应。比如arr值为[0,3]时，表示该目录处于第一大类（arr第一个元素值为0）第四个分类（arr第二个元素值为3），目录的级别为第二小分类（arr长度为2）。arr值为[2]时，表示该目录处于第三大类，目录级别为大类。知道目录所处级别就可以为不同级别的目录设定不同的样式 */
        let arr = []

        /* 通过循环设定arr的值等于t，但不能通过arr=t来设定，这样设定的话就把arr的值和t的值绑定，改变其中一个的值就会改变另一个的值，这不是我们想要的 */
        for (let k = 0; k < t.length; k++) {
          arr[k] = t[k]
        }
        /* 每次执行mylist函数的时候都将arr的长度增加1（创建下一级目录时都要执行mylist函数），从而达到使arr.length与目录级别一致的目的*/
        arr.push(0)

        /* ellist收集了所有当前级别目录所在div，当需要改变所有目录样式的时候可以通过循环ellist来设定每个目录的样式 ，allellist则是所有目录所在div的集合，通过循环allellist可获取非本级别的目录*/
        let ellist = []

        /* 根据x中的各元素创建树状目录及其属性 */
        for (let n = 0; n < x.length; n++) {
          /* 目录展开或关闭：当目录样式名称中包含openr表示该目录是展开的，当目录样式名称中包含closer表示该目录是关闭的。反过来当要展开目录时则将目录样式添加openr，并删除closer。当要关闭目录时则将目录样式添加closer，并删除openr。 */
          let openr = ' titleopen'
          let closer = ' titleclose'
          if (_this.ifIcon === true) {
            openr = openr + ' imgtitleopen'
            closer = closer + ' imgtitleclose'
          }

          /* 创建目录 */
          let link
          let par = document.createElement('div')
          let node = document.createTextNode(x[n].name)
          if (!x[n].childer || x[n].childer.length === 0) {
            link = document.createElement('a')
            link.appendChild(node)
            par.appendChild(link)
          } else {
            par.appendChild(node)
          }

          /* 当open等于1时，设定所有目录初始状态都是展开的，当open不等于1时，设定所有目录初始状态都是关闭的，*/
          switch (_this.open) {
            case 1: par.className = 'par' + openr
              break
            default: par.className = 'par' + closer
          }

          /* 为每个目录添加一个' title' + arr.length 样式，即给一级目录添加title1样式，给二级目录添加title2样式，给三级目录添加title3样式……，使得每级目录可以从外观上区别开来*/
          par.className = par.className + ' title' + arr.length

          /* 每个目录下都有个box，其所有子目录都在box中 */
          let box = document.createElement('div')
          parent.appendChild(par)
          parent.appendChild(box)

          /* 设定box的样式，通过设定该样式可以改变子目录左边框和父目录左边框的距离 */
          box.className = 'box'

          /* child等于1的时候表示该目录下还有子目录，child等于0时表示该目录为底目录，下面已经没有子目录了。点击底目录可打开新的页面内容，点击非底目录则显示或隐藏下面的子目录 */
          let child
          if (x[n].childer && x[n].childer.length > 0) {
            child = 1
          } else {
            child = 0
          }

          /* 当open不等于1时隐藏box，即隐藏子目录，换句话说就是关闭所有目录 */
          if (_this.open !== 1) {
            box.style.display = 'none'
          }
          /* 当open等于3或4时，展开一级目录（arr.length与目录级别一致）*/
          if ((_this.open === 3 || _this.open === 4) && arr.length === 1) {
            par.className = par.className.replace(closer, openr)
            box.style.display = ''
          }

          /* ------------------------点击事件--------------------------- */
          par.onclick = function () {
            /* 当open等于2并且当前被点击的目录为关闭状态的时候关闭所有的目录，为展开当前目录做准备（因为open等于2时在同一时间只允许展开一个目录） */
            if (_this.open === 2 && par.className.indexOf(closer) !== -1) {
              for (let k = 0; k < ellist.length; k++) {
                ellist[k].par.className = ellist[k].par.className.replace(openr, closer)
                ellist[k].box.style.display = 'none'
              }
            }

            /* 当该目录为展开状态时，点击后闭合，当该目录为闭合状态时，点击后展开，但open等于4并且被点击的目录为一级目录时点击无效 */
            if (_this.open !== 4 || arr.length > 1) {
              box.style.display = box.style.display === 'none' ? '' : 'none'
              if (par.className.indexOf(openr) !== -1) {
                par.className = par.className.replace(openr, closer)
              } else if (par.className.indexOf(closer) !== -1) {
                par.className = par.className.replace(closer, openr)
              }
            }

            /* 当被点击的目录为底层目录时使得该目录及其中的一个祖先目录成选中状态 */
            if (!x[n].childer || x[n].childer.length === 0) {
              _this.$router.push('/' + x[n].id)
              /* 通过循环allellist里的所有元素查找被点击目录的所有祖先目录，然后通过checkedparents值来确定一级祖先目录还是二级祖先目录设定为选中状态 */
              for (let l = 0; l < _this.allellist.length; l++) {
                if (_this.allellist[l].child === 0) {
                  _this.allellist[l].par.className = _this.allellist[l].par.className.replace(' checkedself', '')
                } else if (_this.checkedparents === 1) {
                  if (_this.allellist[l].arr.length === 1) {
                    /* 当allellist[l]为一级目录（即allellist[l].arr.length === 1）时，点击它下面的子孙目录时allellist[l]的样式才会改变。 */
                    _this.allellist[l].par.className = _this.allellist[l].par.className.replace(' checkedparents', '')
                    if (_this.allellist[l].arr[0] === arr[0]) {
                      /* 通过判断allellist[l].arr中第一个元素和当前arr第一个元素是否相等来判断allellist[l]是否当前点击的这个目录的祖先目录，如果是则改变allellist[l]的样式 */
                      _this.allellist[l].par.className = _this.allellist[l].par.className + ' checkedparents'
                    }
                  }
                } else if (_this.checkedparents === 2) {
                  if (_this.allellist[l].arr.length === 2) {
                    /* 当allellist[l]为二级目录（即allellist[l].arr.length === 2）时，点击它下面的子孙目录时allellist[l]的样式才会改变 */
                    _this.allellist[l].par.className = _this.allellist[l].par.className.replace(' checkedparents', '')
                    if (_this.allellist[l].arr[0] === arr[0] && _this.allellist[l].arr[1] === arr[1]) {
                      /* 通过判断allellist[l].arr中前2个元素和当前arr前2个元素是否相等来判断allellist[l]是否当前点击的这个目录的祖先目录，如果是则改变allellist[l]的样式 */
                      _this.allellist[l].par.className = _this.allellist[l].par.className + ' checkedparents'
                    }
                  }
                }
              }
              /* 改变被点击的底层目录自身为选中状态 */
              par.className = par.className + ' checkedself'
            }
          }
          /* ----------------------------------------------------------- */

          /* 将每个目录所在div信息收集起来，这里arr必须用一个中介（thearr）来转一下，否则后面push的arr值会覆盖前面的arr值 */
          /* ellist收集的是本级目录信息，因为创建每级目录时都会执行一次mylist，而每次执行mylist都会重新定义ellist，所以每个ellist收集的都是本次执行函数mylist时push给ellist的值 */
          /* allellist收集的是所有目录的信息，因为allellist是函数mylist外面的数据，每次push给allellist的值都保存在allellist里面 */
          let thearr = []
          for (let kk = 0; kk < arr.length; kk++) {
            thearr[kk] = arr[kk]
          }
          let theel = {
            par: par,
            box: box,
            child: child,
            arr: thearr
          }
          ellist.push(theel)
          _this.allellist.push(theel)

          /* 如果当前创建的目录还有子目录则再执行函数mylist来创建子目录，*/
          if (x[n].childer && x[n].childer.length > 0) {
            _this.mylist(x[n].childer, box, arr)
          } else {
            par.className = 'par title' + arr.length
          }

          /* 进入下次循环前将arr最后一个元素值加1，使得arr每个元素值与对应目录所处位置一致：元素值为0表示对应的目录在同级目录中为第一个目录，元素值为1表示对应的目录在同级目录中为第二个目录 */
          /* arr.length则与对应目录所处级别一致：arr.length为1表示该目录为一级目录，arr.length为2表示该目录为二级目录 */
          arr[arr.length - 1]++
        }
      }
    }
  },
  mounted: function () {
    this.$options.methods.mylist.bind(this)(this.list, document.getElementsByClassName('tree')[0])
  }
}
</script>
<style lang='scss'>
$indent: 24px;//子目录缩进距离
.tree {
  a {
    text-decoration: none;
    color: black;
  }
  a:hover {
    color: red;
    text-decoration: underline;
  }
  .par{
    margin: 12px 0;
    cursor: pointer;
    font-size: 15px;
    padding-left: 24px;
  }
  .par:hover{
    color: red;
  }
  .box{
    padding-left: $indent;
  }
  //titleopen和titleclose分别表示目录展开和闭合时候的样式，imgtitleopen和imgtitleclose分别表示目录展开和闭合时候前面的图标样式
  .titleopen{

  }
  .imgtitleopen{
    background: url('./arrow_triangle-down.png') left center/24px 24px no-repeat padding-box;
  }
  .titleclose{

  }
  .imgtitleclose{
    background: url('./arrow_triangle-right.png') left center/24px 24px no-repeat padding-box;
  }
  /* title[X] 表示X级目录的样式，比如：title1是一级目录样式，title2是二级目录样式 */
  .title1{
    font-size: 20px;
    font-weight: 900;
    color: #6B6B6B;
  }
  .title2{
    font-size: 13px;
    font-weight: bold;
  }
  @for $i from 3 to 6 {
    .title#{$i} {
      font-size: 15px;
      font-weight: bold;
    }
  }
  .checkedparents{
    background-color: #117301;
    color: #fff;
  }
  .checkedself{
    color: #117301;
    font-weight: bold;
  }
  .checkedself:hover{
    cursor: default;
    color: #117301;
  }
}
</style>

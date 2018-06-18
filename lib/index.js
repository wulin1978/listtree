import ListTree from './tree' // 导入组件
const tree = {
  install (Vue, o) {
    var ele = '.listtree'
    o.el && (ele = o.el)
    const LTree = Vue.extend(ListTree)
    const listtree = new LTree({propsData: {
      listData: o.listData,
      open: o.open,
      ifIcon: o.ifIcon,
      customIcon: o.customIcon,
      checkedparents: o.checkedparents,
      indentIcon: o.indentIcon,
      indentLetter: o.indentLetter,
      branchSpace: o.branchSpace
    }})
    Vue.nextTick(() => {
      listtree.$mount(ele)
    })
    // Vue.component(ListTree.name, ListTree)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(tree)
}
export default tree

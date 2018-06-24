import ListTree from './tree'
const tree = {
  install (Vue, o) {
    var ele = '.listtree'
    o.el && (ele = o.el)
    const LTree = Vue.extend(ListTree)
    const listtree = new LTree({propsData: {
      listData: o.listData,
      treerouter: o.router,
      open: o.open,
      indent: o.indent,
      spacing: o.spacing,
      left: o.left,
      branchSpacing: o.branchSpacing,
      cursor: o.cursor,
      icon: o.icon,
      mouseOverStyle: o.mouseOverStyle
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

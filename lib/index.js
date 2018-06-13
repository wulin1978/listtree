import ListTree from './tree' // 导入组件
const tree = {
  install (Vue, options) {
    var ele = '.listtree'
    options.el && (ele = options.el)
    const LTree = Vue.extend(ListTree)
    const listtree = new LTree({propsData: {list: options.list}})
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

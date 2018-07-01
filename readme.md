# v-listtree —— vue无限级菜单

v-listtree 是基于vue设计的无限级菜单插件，基本可以满足大部分纵列多级别菜单的需求，并且用户定义菜单样式的自由度非常高，具体到每一级别的菜单甚至每一个菜单分支的单独样式都可以自由定义，和自己写css样式没有任何区别。菜单前的小图标可以使用系统默认的图标，也可以使用阿里巴巴图标库和Font Awesome图标库里的图标，当然你也可以使用自己设计的png、icon等格式的图标。

## 安装

    npm install v-listtree -S

## 使用

> 在 main.js 中插入下列代码：

    import Listtree from './plugin/listtree/lib'

    Vue.use(Listtree, {
      listData: require('../static/listdata.json'),
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }

> 然后在需要插入菜单的组件插入下面代码：

    <div class="listtree"></div>


> 其中listdata.json是菜单的数据内容，下面讲参数时会具体说明。
## 参数

> v-listtree 一共有7个参数，通过配置这7个参数可以使 v-listtree 适应不同类型的菜单需求

### 1、listdata

> __数据类型：__ 数组
> __详细说明：__ listdata 包含了所有菜单分支中的必要数据，包括：菜单的标题内容（name），菜单的路由地址（router），菜单的图标（icon）以及子级菜单（children）。类似于下面这段代码：

    [
      {
        "name": "一级目录一",
        "children": [
          {
            "name": "二级目录一",
            "router": "/erji"
          }
        ]
      },
      {
        "name": "一级目录二",
        "children": [
          {
            "name": "二级目录二",
            "icon": ["iconfont icon-yousanjiao", "iconfont icon-sanjiao3"]
            "router": "/po"
          },
          {
            "name": "二级目录三",
            "router": "/pl"
          }
        ]
      }
    ]

> 菜单分支四个属性：name,router,icon,children。name是菜单的文字内容，是必选的；router是菜单所指向的路由地址，可选；icon是该菜单分支前面的图标，这个后面介绍图标的时候会具体说，可选；children好理解就是子分支，可选。下面截图是 v-listtree 的一个典型例子：

<img src="https://github.com/wulin1978/vuetest/blob/master/static/lizi.png?raw=true">


### 2、open

> 多级菜单是可以展开闭合的，v-listtree 中，open 决定了菜单初始状态的展开闭合状态，它是 number 数据类型的，当 open 为 0 时所有菜单默认均为闭合状态；当 open 为 1 时所有菜单默认均为展开状态；当 open 为 2 时第一个一级菜单为展开状态，其他所有菜单默认均为闭合状态，并且所有同级分支同一时间只能展开一个分支；当 open 为 3 时，所有一级菜单均为展开状态，其他菜单都闭合；当 open 为 4 时，所有一级菜单均为展开状态，其他菜单都闭合，并且一级菜单不能被闭合，一级菜单前面也没有图标。open 的默认值为 1。

### 3、indent

> indent 是 number 数据类型的，它控制上下级菜单缩进距离，单位为 px。当 indent 为 0 时， 上下级菜单没有缩进，左边对齐。indent 默认值为 24。

### 4、spacing

> spacing 为 number 数据类型，它控制图标与菜单文字直接的间距。spacing 的默认值为 20。

### 5、icon

> icon 控制图标样式，它可以是数字，也可以是数组。当 icon 为数字时，图标显示的是 v-listtree 提供的图标样式，目前提供 1 到 10 十种样式。当图标为数组时，可以从阿里巴巴图标库或Font Awesome图标库选择图标
# v-listtree —— vue无限级菜单

v-listtree 是基于vue设计的无限级菜单插件，基本可以满足大部分纵列多级别菜单的需求，并且用户定义菜单样式的自由度非常高，具体到每一级别的菜单甚至每一个菜单分支的单独样式都可以自由定义，和自己写css样式没有任何区别。菜单前的小图标可以使用系统默认的图标，也可以使用阿里巴巴图标库和Font Awesome图标库里的图标，当然你也可以使用自己设计的图标。你可以自由控制图标的尺寸、颜色以及图标和文字之间的间距。

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


> 其中listdata.json是菜单的数据内容，它应当类似于下面这段代码：

  [
    {
      "name": "一级目录一",
      "children": [
        {
          "name": "二级目录一",
          "children": [
            {
              "name": "三级目录一",
              "router": "/rel"
            },
            {
              "name": "三级目录二",
              "router": "/rwr",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "一级目录二",
      "children": [
        {
          "name": "二级目录二",
          "router": "/po"
        },
        {
          "name": "二级目录三",
          "router": "/pl",
          "children": [
            {
              "name": "三级目录X",
              "router": "/sel"
            }
          ]
        },
        {
          "name": "二级目录四",
          "children": [
            {
              "name": "三级目录Y",
              "router": "/lew",
              "icon": ["iconfont icon-jiantou12", 45]
            }
          ]
        }
      ]
    },
    {
      "name": "一级目录三",
      "router": "/ire",
      "children": [
        {
          "name": "二级目录五",
          "router": "/jk"
        }
      ]
    }
  ]

> 从上面代码我们可以看到每一个菜单分支可能拥有四个属性：name,router,icon,children。name是菜单的文字内容，这个属性是必须；router是菜单所指向的路由地址；icon是该菜单分支前面的图标，这个后面介绍图标的时候会具体说；children好理解就是子分支。
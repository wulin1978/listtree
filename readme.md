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

### 1、listdata [数组 必选]

> listdata 包含了所有菜单分支中的必要数据，包括：菜单的标题内容（name），菜单的路由地址（router），菜单的图标（icon）以及子级菜单（children）。类似于下面这段代码：

    `[
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
    ]`

> 菜单分支四个属性：name,router,icon,children。name是菜单的文字内容，是必选的；router是菜单所指向的路由地址，可选；icon是该菜单分支前面的图标，这个后面介绍图标的时候会具体说，可选；children好理解就是子分支，可选。下面截图是 v-listtree 的一个典型例子：

<img src="https://github.com/wulin1978/vuetest/blob/master/static/lizi.png?raw=true">


### 2、open [number 1 可选]

<table style="border:1px solid #222">
  <tr style="background:#ccc">
    <td>open的值</td>
    <td>描述</td>
  </tr>
  <tr>
    <td>0</td>
    <td>在初始状态下所有菜单均为闭合状态</td>
  </tr>
  <tr>
    <td>1</td>
    <td>在初始状态下所有菜单均为展开状态，1 为 open 的默认值</td>
  </tr>
  <tr>
    <td>2</td>
    <td>在初始状态下第一个一级菜单为展开状态，其他所有菜单均为闭合状态，且所有同级菜单在同一时间只能有一个分支展开</td>
  </tr>
  <tr>
    <td>3</td>
    <td>在初始状态下所有一级菜单展开，其他菜单均为闭合状态</td>
  </tr>
  <tr>
    <td>4</td>
    <td>在初始状态下所有一级菜单展开，其他菜单均为闭合状态，且一级菜单不能被闭合，一级菜单没有图标（但listdata中对应的一级菜单如果包含icon属性的话该一级菜单仍然有图标）</td>
  </tr>
</table>

### 3、indent [number 24 可选]

> indent 可控制上下级菜单缩进距离，单位为 px。默认值为24px，当 indent 为 0 时， 上下级菜单没有缩进，所有菜单分支左边对齐。

### 4、spacing [number 20 可选]

> spacing 控制图标与菜单文字之间的间距，单位为 px。的默认值为20px。

### 5、icon [number/array 1 可选]

> icon 控制图标样式，它可以是数字，也可以是数组。当 icon 为数字时，图标显示的是 v-listtree 提供的图标样式，目前提供 1 到 10 十种样式。当图标为数组时，用户可以从阿里巴巴图标库或Font Awesome图标库选择图标，也可以使用png、icon等图片格式的图标。数组的第一个元素数据类型是字符串，指向菜单闭合时使用的图标。数组第二个元素可以是字符串也可以是number，当为字符串的时候它指向菜单展开时使用的图标，当为number时，表示菜单展开和闭合时使用同一个图标，但展开时图标顺时针旋转一个角度，这个角度的值即为数组第二个元素的值。

>icon 为数字时比较简单也好理解，下面我们举例详细说明下 icon 为数组时的各种情况(这里我们假设你要使用 v-listtree 插件的组件是 mytree.vue)。

**1、使用阿里巴巴图标库图标** 我们假设你已经在阿里巴巴图标库创建了自己的项目并已经添加或上传了自己的图标，现在打开[阿里巴巴图标库](http://www.iconfont.cn/)进入你的项目，选择 Font class，点击下载至本地，将其解压放到mytree.vue同一个文件夹下，如下图：

<img src="https://github.com/wulin1978/vuetest/blob/master/static/iconfont1.png?raw=true">

mytree.vue 组件中的代码(xxxxxxxx/iconfont.css 即为下载的阿里巴巴图标库的css文件)：

    `<template>
      <div class="hello">
        <div class="listtree"></div>
      </div>
    </template>
    <script>
    </script>
    <style>
    @import url("./xxxxxxxx/iconfont.css");
    </style>`

在 main.js 中插入下列代码(xxxxxxxxxxxxx 为闭合时的图标，yyyyyyyyyyyyyy 为展开时的图标，iconfont不可省略)：

    `import Listtree from 'v-listtree'

    Vue.use(Listtree, {
      listData: require('../static/data.json'),
      icon: ['iconfont xxxxxxxxxxxxx', 'iconfont yyyyyyyyyyyyyy']
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }`

当然上面代码中icon你也可以替换成：icon: ['iconfont xxxxxxxxxxxxx', 90] ，此时表示菜单展开和闭合时图标都是 xxxxxxxxxxxxx，只是展开时图标顺时针旋转90度

**2、使用Font Awesome图标库** 打开[Font Awesome网站](http://www.fontawesome.com.cn/)并下载最新版Font Awesome，将Font Awesome解压到mytree.vue同一个文件夹，mytree.vue 代码如下：

    `<template>
      <div class="hello">
        <div class="listtree"></div>
      </div>
    </template>
    <script>
    </script>
    <style>
    @import url("./font-awesome-4.7.0/css/font-awesome.min.css");
    </style>`

在 main.js 中插入下列代码(xxxxxxxxxxxxx 为闭合时的图标，yyyyyyyyyyyyyy 为展开时的图标，fa不可省略)：

    `import Listtree from 'v-listtree'

    Vue.use(Listtree, {
      listData: require('../static/data.json'),
      icon: ['fa xxxxxxxxxxxxx', 'fa yyyyyyyyyyyyyy']
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }`

上面代码中icon也可以替换成：icon: ['fa xxxxxxxxxxxxx', 90] ，此时表示菜单展开和闭合时图标都是 xxxxxxxxxxxxx，只是展开时图标顺时针旋转90度
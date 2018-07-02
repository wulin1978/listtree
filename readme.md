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

> v-listtree 一共有7个参数，通过配置这7个参数可以使 v-listtree 适应不同类型的菜单需求，为了描述方便，这里假设你要插入本插件的组件为mytree.vue(建议你用空组件来引入本插件，然后在需要使用本本插件的地方直接import该组件)

### 1、listdata [Array 必选]

> listdata 包含了所有菜单分支中的必要数据，包括：菜单的标题内容（name），菜单的路由地址（router），菜单的图标（icon）以及子级菜单（children）。类似于下面这段代码：

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


### 2、open [Number 1 可选]

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

### 3、indent [Number 24 可选]

> indent 可控制上下级菜单缩进距离，单位为 px。默认值为24px，当 indent 为 0 时， 上下级菜单没有缩进，所有菜单分支左边对齐。

### 4、spacing [Number 20 可选]

> spacing 控制图标与菜单文字之间的间距，单位为 px。的默认值为20px。

### 5、icon [Number/Array 1 可选]

> icon 控制图标样式，它可以是数字，也可以是数组。当 icon 为数字时，图标显示的是 v-listtree 提供的图标样式，目前提供 1 到 10 十种样式。当图标为数组时，用户可以从阿里巴巴图标库或Font Awesome图标库选择图标，也可以使用png、icon等图片格式的图标。数组的第一个元素数据类型是字符串，指向菜单闭合时使用的图标。数组第二个元素可以是字符串也可以是number，当为字符串的时候它指向菜单展开时使用的图标，当为number时，表示菜单展开和闭合时使用同一个图标，但展开时图标顺时针旋转一个角度，这个角度的值即为数组第二个元素的值。

>icon 为数字时比较简单也好理解，下面我们举例详细说明下 icon 为数组时的各种情况。

**a 使用阿里巴巴图标库图标** 我们假设你已经在阿里巴巴图标库创建了自己的项目并已经添加或上传了自己的图标，现在打开<a href="http://www.iconfont.cn/" target="_blank">阿里巴巴图标库</a>进入你的项目，选择 Font class，点击下载至本地，将其解压放到mytree.vue同一个文件夹下，如下图：

<img src="https://github.com/wulin1978/vuetest/blob/master/static/iconfont1.png?raw=true">

mytree.vue 组件中的代码(xxxxxxxx/iconfont.css 即为下载的阿里巴巴图标库中的css文件)：

    <template>
      <div class="hello">
        <div class="listtree"></div>
      </div>
    </template>
    <script>
    </script>
    <style>
    @import url("./xxxxxxxx/iconfont.css");
    </style>

在 main.js 中插入下列代码(xxxxxxxxxxxxx 为闭合时的图标，yyyyyyyyyyyyyy 为展开时的图标，iconfont不可省略)：

    import Listtree from 'v-listtree'

    Vue.use(Listtree, {
      listData: require('../static/data.json'),
      icon: ['iconfont xxxxxxxxxxxxx', 'iconfont yyyyyyyyyyyyyy']
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }

当然上面代码中icon你也可以替换成：icon: ['iconfont xxxxxxxxxxxxx', 90] ，此时表示菜单展开和闭合时图标都是 xxxxxxxxxxxxx，只是展开时图标顺时针旋转90度

**b 使用Font Awesome图标库** 打开<a href="http://www.fontawesome.com.cn/" target="_blank">Font Awesome网站</a>并下载最新版Font Awesome，将Font Awesome解压到mytree.vue同一个文件夹，mytree.vue 代码如下：

    <template>
      <div class="hello">
        <div class="listtree"></div>
      </div>
    </template>
    <script>
    </script>
    <style>
    @import url("./font-awesome-4.7.0/css/font-awesome.min.css");
    </style>

在 main.js 中插入下列代码(xxxxxxxxxxxxx 为闭合时的图标，yyyyyyyyyyyyyy 为展开时的图标，fa不可省略)：

    import Listtree from 'v-listtree'

    Vue.use(Listtree, {
      listData: require('../static/data.json'),
      icon: ['fa xxxxxxxxxxxxx', 'fa yyyyyyyyyyyyyy']
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }

上面代码中icon也可以替换成：icon: ['fa xxxxxxxxxxxxx', 90] ，此时表示菜单展开和闭合时图标都是 xxxxxxxxxxxxx，只是展开时图标顺时针旋转90度

**c 使用png、icon等图片格式作为图标** 建议将图片存放在static文件夹里，mytree.vue 代码如下：

    <template>
      <div class="hello">
        <div class="listtree"></div>
      </div>
    </template>
    <script>
    </script>
    <style>
    </style>

在 main.js 中插入下列代码(xxxxxxxxxxxxx 为闭合时的图标，yyyyyyyyyyyyyy 为展开时的图标)：

    import Listtree from 'v-listtree'

    Vue.use(Listtree, {
      listData: require('../static/data.json'),
      icon: ['../static/xxxxxxxxxxxxx', '../static/yyyyyyyyyyyyy']
    })
    Vue.prototype.$push = function (r) {
      router.push(r)
    }

上面代码中icon也可以替换成：icon: ['../static/xxxxxxxxxxxxx', 90] ，此时表示菜单展开和闭合时图标都是 ../static/xxxxxxxxxxxxx，只是展开时图标顺时针旋转90度

> 在icon里面设置的图标是单一的，也就是说所有的菜单分支图标都是一样的，如果你想要将某一个分支单独设置一个图标或者干脆让每个分支图标都不一样该怎么办呢，还记得前面提到过的 listtree 参数吗，listtree 元素里面有个icon属性，每个listtree 元素就代表一个菜单分支，设置某一分支的icon属性，该分支就拥有一个独立的图标。listtree 里面的icon数据类型是数组，同样该数组第一个元素代表的是菜单闭合时的图标，第二个元素如果是字符串代表的就是菜单展开时的图标，如果是数字代表的就是图标旋转的角度，此时菜单展开时的图标和闭合时的图标是一样的。listtree 元素里面有个icon属性和参数 icon 使用方法上都一样，它也可以使用阿里巴巴图标库、Font Awesome图标库和png、icon等格式图片作为图标。当然如果你不想在菜单里加任何的图标，可以将icon参数直接设为0就可以了。

### 6、iconSize [Number 可选]

> iconSize 控制图标的尺寸，单位为px，该参数没有默认值，如果你没有设置该值，则图标大小会被与之最近的fong-size控制，因为这里的图标本质上也是一种字体（用图片作为图标的除外），所以你也可以通过设置font-size的值来控制图标尺寸。但当图标为图片时，iconSize和font-size对图标无效。

### 7、animation [Boolean true 可选]

> animation 控制插件是否使用动画，默认值为true。当animation为true时，菜单展开闭合过程会有伸缩的一个动画，图标在菜单展开闭合过程中会有个旋转的动画（注：如果展开和闭合时不是同一个图标是不会产生旋转动画的）


## v-listtree 样式命名规则

> 在 v-listtree 插件中每一级菜单及其图标都有自己的样式表，如果你了解了这些样式表的命名规则，你就可以为不同级的菜单定义不同的样式，甚至可以为任何一个菜单分支定义不同的样式

### 1、菜单分支的index

1. 一级菜单index为自然数，从 1 开始分配，按照从上到下的顺序，每加一个一级分支index加1；
2. 除一级菜单以外的菜单index为其父级菜单index加“-”再加一个自然数，该自然数也是从 1 开始分配，按照从上到下的顺序，每加一个分支该自然数加1（比如：2-1-3代表的是第二个一级分支下的第一个子分支下的第三个子分支）;
3. 父级菜单不同的分支，其后面加的自然数互相不影响，也就是说每个菜单分配其子菜单的index时，其后面加的自然数都是从 1 开始。

> 简单来说菜单分支的index就是类似于这样的： a-b-c-d-e，其中“a-b-c-d”为该分支父级分支的index

### 2、菜单分支及其图标的 ID

菜单分支的 ID 等于 "lt-branch_" 加上该分支的index，该菜单分支所对应的图标 ID 等于 "lt-branch-icon_" 加上该分支的index。

### 3、不同级别菜单分支的 className

不同级别菜单分支的 className 等于 "lt-branch_level_" 加上该菜单的级别，比如每个一级菜单都包含一个样式表："_lt-branch_level_1_"，每个二级菜单都包含一个样式表："_lt-branch_level_2_" …… ，以此类推。同理不同级别菜单分支对应的图标的 className 等于 "lt-branch-icon_level_" 加上该菜单的级别。如果一个菜单分支没有子级菜单，该类菜单还拥有样式："_lt-branch_level_0_"，该类菜单的图标拥有样式："_lt-branch-icon_level_0_"。lt-branch-icon_level_0 和表示级别分支的 className 可同时存在。

### 4、菜单分支被点击后的 className

某个菜单分支被点击后会增加一个样式表："_lt-branch_active_"，这个被点击的分支父级分支也会增加一个样式表："_lt-branch_active_parent_"，同时这个被点击的分支所有祖先分支都会增加active样式表，这些active样式表名目规则是：如果祖先分支是一级分支，增加的样式表名为："_lt-branch_level_1_active_"，如果祖先分支是二级分支，增加的样式表名为："_lt-branch_level_2_active_" …… ，以此类推。lt-branch_active 和代表级别的active样式可同时存在，比如：点击一个二级分支，该二级分支会同时包含lt-branch_level_2_active 和 lt-branch_active 2个样式。同样，lt-branch_active_parent 和代表级别的active样式也可同时存在。

同理，某个菜单分支被点击后其对应的图标也会增加一个样式表："_lt-branch-icon_active_"，这个被点击的分支父级分支对应的图标增加一个样式表："_lt-branch-icon_active_parent_"，其祖先分支对应的图标增加的样式表为："_lt-branch-icon_level_1_active_"、 "_lt-branch-icon_level_2_active_"、 "_lt-branch-icon_level_3_active_" …… 。

__注意：只有包含 router 的菜单分支被点击时才会增加 active 样式（还记得 listdata 参数里的 router 属性吗）。__
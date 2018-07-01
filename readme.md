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
                    "children": [
                      {
                        "name": "四级目录一",
                        "router": 14
                      },
                      {
                        "name": "四级目录二",
                        "router": 15,
                        "children": [
                          {
                            "name": "五级目录一",
                            "router": "/abc",
                            "children": []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "三级目录二",
                    "router": 4,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "name": "一级目录二",
            "router": 5,
            "children": [
              {
                "name": "二级目录二",
                "router": 6,
                "children": [
                  {
                    "name": "三级目录三",
                    "router": 7
                  },
                  {
                    "name": "三级目录四",
                    "router": 8
                  }
                ]
              },
              {
                "name": "二级目录三",
                "router": 9,
                "children": [
                  {
                    "name": "三级目录X",
                    "router": 10
                  }
                ]
              },
              {
                "name": "二级目录四",
                "router": 11,
                "children": [
                  {
                    "name": "三级目录Y",
                    "router": 12
                  }
                ]
              }
            ]
          },
          {
            "name": "一级目录三",
            "router": 13,
            "children": [
              {
                "name": "二级目录五",
                "router": 14,
                "children": [
                  {
                    "name": "三级目录五",
                    "children": [
                      {
                        "name": "四级目录三",
                        "children": [
                          {
                            "name": "52",
                            "router": "/abc",
                            "children": [
                              {
                                "name": "61",
                                "children":[
                                  {
                                    "name": "71",
                                    "children": [
                                      {
                                        "name": "81",
                                        "router": "/abc"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
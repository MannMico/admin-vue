# 项目约定

## 命令
- npm run dev 本地开发

## 遵守文件路径
- 后台给到的api，我们需要再src/api下面建立对应模块的js，用来统一存放请求。详情参见src/api下具体文件
- 新写的页面加在src/views下面，一级目录建文件夹，可以复用的组件写在components下面
- 同属于一个目录下的页面写在一起，新增加的页面找到之前页面所在文件夹写在里面

## 其他
- v-permission 页面上涉及到权限的按钮需要加v-permission指令，具体方式参照以前的代码添加
- 在添加新后台左侧nav的时候，找一个合适的icon，目标是左侧的icon都不重样
- 写.vue文件的时候，下面style标签一般都要有scoped属性，用来防止影响到别的页面
- .vue结构，从上到下依次是template html, js, css
- 缩进格式为两个空格
- 一个vue文件500行左右比较好
- ⚠️ 由于前后分离，所以如果有hotfix涉及到后端的一定要同时更到线上

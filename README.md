##使用方法
```bash
#将apicloud生成项目的config.xml拷至本项目根路径，覆盖即可
#安装依赖
npm install
#如使用IDE或者插件实现同步，可以忽略以下几部，直接执行npm run dev
#安装apicloud-cli  
npm install apicloud -g
#开启wifi同步 
apicloud wifiStart --port 23456
#全量更新
apicloud wifiSync --project ./ --updateAll true --port 23456
#增量更新
apicloud wifiSync --project ./ --updateAll false --port 23456
#开发模式 开启热更新
npm run dev
#PC端调试访问 http://localhost:8010/html/index.html
#编译
npm run build
#编译后的dist文件夹可以使用svn上传至apicloud
```

##文件结构
```
      |---src
        |---assets 前端资源文件 需要编译
        |---componments 公共组件
        |---pages  
          |---index 页面文件夹
            |---index 示例页面构建文件夹
                |---app.html 父模板文件
                |---app.js 入口文件
                |---app.vue vue页面  //如不需要用到vue单文件构建，则不需要
          |---common  公共页面文件夹
              |---win  公共头部文件夹
      |---dist build出的文件夹，用于最终上传至apicloud
      |---res  不需要编译的资源文件夹，一般用于存放原生模块需要用到的资源文件或全局静态引用的css
      |---index.html 入口页面
      |---config.xml apicloud配置文件
      |---webpack.config.js webpack配置文件
      |---.syncignore   apicloud同步忽略文件
      |---.babelrc  babel配置文件，重要，删除会无法运行项目
```
##一些需要注意的问题或推荐写法
```javascript
apiready = function(){}
```
改为
```javascript
window.apiready = function(){}
```
原因是，apicloud通过全局的方式调用apiready方法，而使用webpack模块化打包的方法，是不注册全局函数的，故需要手动将apiready声明在window对象下。

使用vue等项目的话，在app.js中apiready之后再实例化vue，这样确保在.vue单文件组件中直接使用api对象下的接口是正常的。
```javascript
window.apiready = function(){
    new Vue({
        el: '#app',
        render: h => h(App)
    })
}
```
###热更新调试时入口index页面的写法
一般情况下，apicloud有一个入口window页面，页面里通过相对路径打开对应frame,需要做热更新调试时，只需要简单的将frame的路径改成http://地址，
例如你开发用的电脑IP为192.168.99.101，可以写成
```javascript
api.openFrame({
    name: 'frame',
     //url: 'dist/html/index.html', //上传打包时使用
    url: 'http://192.168.99.101:8010/html/index.html', //调试时使用
    rect: {
      x: 0,
      y: 45,
      w: 'auto',
      h: 'auto'
    },
    bounces: false,
    vScrollBarEnabled: true,
    hScrollBarEnabled: true
});
```
只需要在入口文件内这样写，即可使用热加载调试，实时的更新修改结果，其余页面按照正常的写法，最终上传到apicloud时将入口页面修改回来即可。
注:请使用真机调试以获取更好的效果，测试发现海马玩等安卓模拟器，在打开页面层级过多时会出现白屏。

const { join, resolve } = require('path');
const webpack = require('webpack');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

let entries = {};
let chunks = [];
getEntriesAndChunks();

let config = {
    entry: entries,
    // devtool: 'cheap-module-source-map',
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].js',
        // filename: 'script/[id].js',
        publicPath: process.env.NODE_ENV === 'production' ? '../' : '/'
    },
    resolve: {
        //配置别名，在项目中可缩减引用路径
        extensions: ['.js', '.vue'],
        alias: {
            assets: join(__dirname, '/src/assets'),
            components: join(__dirname, '/src/components'),
            public: join(__dirname, '/src/public'),
            root: join(__dirname, 'node_modules')
        }
    },
    externals: [
        // { apiready: "window.apiready" },
        { api: "window.api" }
        // { MYAPP: "window.APP" }
    ],
    module: {
        rules: [{
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        root: resolve(__dirname, 'src'),
                        attrs: ['img:src', 'link:href']
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg|svgz)(\?.+)?$/,
                exclude: /iconfont\.svg/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                include: /fonts/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/fonts/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        // new CommonsChunkPlugin({
        //     name: 'common',
        //     filename: 'assets/js/common.js',
        //     chunks: getCommonChunks(chunks),
        //     minChunks: 5
        // }),
        // new CommonsChunkPlugin({
        //     name: 'vendor',
        //     chunks: ['common'],
        //     filename: 'assets/js/vendor.bundle.js',
        //     minChunks: Infinity,
        // }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8010,
        historyApiFallback: false,
        noInfo: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8010',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            }
        },
    },
    devtool: '#eval-source-map'
};

const pages = getHtmls();

pages.forEach(function(pathname) {
    // filename 用文件夹名字

    let fileBasename = pathname.substring(6, pathname.length - 4);
    var conf = {
        filename: fileBasename + '.html', //生成的html存放路径，相对于path
        template: 'src/' + pathname + '.html', //html模板路径
    };
    var chunk = pathname.substring(6, pathname.length - 4);
    if (chunks.indexOf(chunk) > -1) {
        conf.inject = 'body';
        conf.chunks = ['common', chunk];
    }
    if (process.env.NODE_ENV === 'production') {
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

function getCommonChunks(chunks) {
    let newChunks = [];
    chunks.forEach(function(item) {
        if (!item.includes('questions')) {
            newChunks.push(item);
        }
    });
    // console.log(newChunks);
    return newChunks;
}

module.exports = config;

function getEntriesAndChunks() {
    glob.sync('./src/pages/**/*.js').forEach(function(name) {
        var n = name.slice(name.lastIndexOf('src/') + 10, name.length - 7);
        // var n = name.slice(name.lastIndexOf('src/') + 10, name.length - 3);
        entries[n] = [name];
        chunks.push(n);
    });

    // entries['vendor'] = ['vue'];

}

function getHtmls() {
    var htmls = [];
    glob.sync('./src/pages/**/*.html').forEach(function(name) {
        var n = name.slice(name.lastIndexOf('src/') + 4, name.length - 5);
        htmls.push(n);
    });
    return htmls;
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]);
}
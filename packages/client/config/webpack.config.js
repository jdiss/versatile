const path = require('path');
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

const config = {
    entry: [ './config/polyfills.js', './src/index.js' ],
    output: {
        path:  path.resolve(process.cwd(), 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
        chunkFilename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class',
            'styles' : path.resolve(process.cwd(), 'styles')
        },
        symlinks: false,
    },
    module: {
        rules: [{
            exclude: [
                /\.(js|jsx)$/,
                /\.scss$/,
                /\.jpg$/,
                /\.json$/,
            ],
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    outputPath: '',
                },
            }
        },
        {
            test: /\.(js|jsx)$/,
            include: path.resolve(process.cwd(), 'src'),
            use: {
                loader: 'babel-loader',
                options: {
                    filename: '[name].[ext]',
                }
            }
        },
        {
            test: /.+\.scss$/,
            include: [
                path.resolve(process.cwd(), 'styles'),
                path.resolve(process.cwd(), 'src'),
            ],
            use: ExtractCssChunks.extract({
                use: [ 'css-loader', 'sass-loader' ]
            })
        },
        {
            test: /\.jpg$/,
            loader: 'file-loader',
            query: {
                name: '[name].[ext]',
            }
        }]
    },
    plugins: [
        new ExtractCssChunks({
            filename: 'styles.css'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true)
            }
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(process.cwd(), 'config/sw.js'), to: './' },
        ]),
    ],
    devServer: {
        publicPath: "http://localhost:3000/static/",
        port: 3000,
        hot: true,
        proxy: {
            '/': {
                target: 'http://localhost:9999',
                bypass: function (req) {
                    if (req.url.indexOf('/static/') > -1 || req.url.indexOf('hot-update') > -1) {
                        return req.url;
                    }
                }
            }
        }
    }
};

const isProduction = process.env.NODE_ENV === 'production';

if(isProduction) {
    const loader = new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    });
    const minify = new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true
        },
        compress: {
            screw_ie8: true
        },
        comments: false
    });
    //const analyzer = new BundleAnalyzerPlugin();
    config.plugins = config.plugins.concat([ loader, minify ]);
} else {
    const hot = new webpack.HotModuleReplacementPlugin();
    config.plugins = config.plugins.concat([ hot ]);
}

module.exports = config;
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const htmlPlugin = new HtmlWebPackPlugin({
    favicon: "./src/favicon.ico",
    template: path.join(__dirname, "src", "index.html"),
});
const jqueryPlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
});
const cssPlugin = new CssMinimizerPlugin({
    minimizerOptions: {
        preset: [
            "default",
            {
                discardComments: { removeAll: true },
            },
        ],
    },
});
const miniCss = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
});
const copyPlugin = new CopyPlugin({
    patterns: [
        { from: './src/assets/images', to: 'images' },
        { from: './src/favicon.ico' },
    ],
});
module.exports = {
    entry: path.join(__dirname, "src", "index.js"),
    output: { path: path.resolve(__dirname, "dist"), filename: "[name].bundle.js", chunkFilename: "[name].bundle.js" },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), cssPlugin, '...'],
        splitChunks: {
            chunks: 'all',
        },
    },
    mode: process.env.NODE_ENV || "development",
    devtool: 'inline-source-map',
    resolve: { modules: [path.join(__dirname, "src"), "node_modules"] },
    devServer: { static: path.join(__dirname, "src"), compress: true, port: 8080 },
    plugins: [htmlPlugin, jqueryPlugin, miniCss, copyPlugin],
    module: {
        rules: [
            {
                test: /\.m?js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "resolve-url-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../',
                        publicPath: '/dist',
                    },
                },
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                }
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    sources: {
                        list: [
                            "...",
                            {
                                tag: "img",
                                attribute: "src",
                                type: "src",
                                filter: () => false,
                            },
                            {
                                tag: "source",
                                attribute: "src",
                                type: "src",
                                filter: () => false,
                            },
                        ],
                    },
                },
            },
        ]
    }
};

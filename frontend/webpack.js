const VueLoaderPlugin = require("vue-loader/lib/plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./main.js",
	mode: "development",
	devtool: "inline-source-map",
	output: {
		path: `${__dirname}/dist/build/`,
		filename: "[name].[hash].js",
		publicPath: "/"
	},
	plugins: [
		new VueLoaderPlugin(),
		new WebpackMd5Hash(),
		new HtmlWebpackPlugin({
			hash: true,
			template: "dist/index.tpl.html",
			inject: "body",
			filename: "index.html"
		})
	],
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ["vue-style-loader", "css-loader", "sass-loader"]
			}
		]
	},
	resolve: {
		alias: {
			vue: "vue/dist/vue.js",
			styles: "styles"
		}
	},
	devServer: {
		contentBase: "./dist/",
		historyApiFallback: true,
		hot: true,
		port: 80,
		public: "http://localhost",
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		host: "0.0.0.0",
		disableHostCheck: true
	}
};

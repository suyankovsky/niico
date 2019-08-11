var webpack = require('webpack');

module.exports = {
    entry: {
        content: './src/js/content/entry.ts',
        background: './src/js/background/entry.ts',
    },
    output: {
        filename: '[name].js',
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /createjs/,
                loader: 'imports-loader?this=>window!exports-loader?createjs',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: {
                    esModule: true,
                    loaders: {
                        js: 'babel-loader!eslint-loader',
                        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                    }
                }
            },
            {
                test: /\.ts/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts'],
        modules: [
            "node_modules",
            "src/"
        ],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'createjs': 'createjs/builds/1.0.0/createjs.min.js',
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.ProvidePlugin({
            'createjs': 'createjs',
        }),
    ],
}

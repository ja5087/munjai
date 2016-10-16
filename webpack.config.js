module.exports = {
    entry: './src/munjai.js',
    output: {
        path: './public',
        filename: 'bundle.js' //transpile munjai to bundle
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, //test for these extensions 2 compile
                exclude: /node_modules/, //no need to check node modules
                loader: 'babel-loader', //use babel-loader as the transpiler
                query:
                    {
                        presets: ['es2015', 'stage-0', 'react'] //babel actually making life hard to compile
                    }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json'] //pick apart these extensions
    }
}



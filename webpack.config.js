module.exports = {
    entry: "./frontend/src/index.js",
    output: {
      filename: "main.js",
      publicPath: "/frontend/static/frontend/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            
            {
              test: /\.css$/,
              use: [
                'style-loader',
                'css-loader'
              ]
            },

            {
              test: /\.(gif|png|jpe?g|svg)$/i,
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'frontend/static/frontend/',
                  publicPath: 'frontend/static/frontend/'
              }
            },
            
            {
              test: /\.html$/,
              exclude: /node_modules/,
              loader: 'html-loader'
            },

            {
              test: /\.mp4$/,
              exclude: /node_modules/,
              use: 'file-loader?name=videos/[name].[ext]',
            },
        ]
        
    }
}


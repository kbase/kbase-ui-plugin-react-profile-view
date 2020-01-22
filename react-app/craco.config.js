const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');
const esModules = ['kbase-ui-lib'].join('|');

module.exports = {
    jest: {
        babel: {
            addPresets: true,
            addPlugins: true,
            configure: (jestConfig, { env, paths, resolve, rootDir }) => {
                jestConfig.transformIgnorePatterns = ['[/\\\\]node_modules[/\\\\](?!kbase-ui-lib|kbase-ui-components|antd/).+\\.js$'];
                jestConfig.rootDir = './src';
                jestConfig.moduleFileExtensions = ['ts', 'tsx', 'json', 'js'];

                return jestConfig;
            }
        }
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath: path.join(__dirname, 'node_modules/@kbase/ui-components/lib/custom/antd/theme.less'),
                styleLoaderOptions: {
                    insert: 'body'
                }
            }
        }
    ],
    webpack: {
        alias: {
            react: path.resolve('./node_modules/react'),
            redux: path.resolve('./node_modules/redux'),
            'react-redux': path.resolve('./node_modules/react-redux')
        }
    },
    devServer: {
        watchOptions: {
            poll: 1000
        }
    }
};

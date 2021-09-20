module.exports = {
    env: {
        browser: true,
        commonjs: true,
    },
    extends: 'airbnb',
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        quotes: [
            'error',
            'single',
        ],
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always',
        ],
        'arrow-spacing': [
            'error', { before: true, after: true },
        ],
        'no-console': 0,
        'no-param-reassign': 0,
        'no-underscore-dangle': 0,
        'comma-dangle': 0
    },
};

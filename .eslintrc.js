module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],

        'import/prefer-default-export': 0,
        'react/jsx-filename-extension': 0,
        'no-use-before-define': 0,
        'react/prop-types': 0,
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0,
        'no-console': 0,
    },
};

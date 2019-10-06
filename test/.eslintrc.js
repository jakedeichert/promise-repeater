module.exports = {
    root: true,
    extends: [
        '@jakedeichert/eslint-config/test',
        'plugin:@typescript-eslint/recommended',
    ],

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],

    parserOptions: {
        project: './test/tsconfig.json',
    },

    env: {
        node: true,
    },

    rules: {
        // Disable things prettier handles
        '@typescript-eslint/indent': 'off',
    },
};

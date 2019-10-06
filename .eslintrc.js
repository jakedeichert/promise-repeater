module.exports = {
    root: true,
    extends: [
        '@jakedeichert/eslint-config',
        'plugin:@typescript-eslint/recommended',
    ],

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],

    parserOptions: {
        project: './tsconfig.json',
    },

    rules: {
        // Disable things prettier handles
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            { functions: false },
        ],
    },
};

module.exports = {
    extends: '@jakedeichert/eslint-config',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],

    parserOptions: {
        project: './tsconfig.json',
    },

    rules: {
        // Disable things prettier handles
        '@typescript-eslint/indent': 'off',
    },
};

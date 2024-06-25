module.exports = {
  singleQuote: true,
  printWidth: 100,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrder: ['^@angular/(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

import modify from 'rollup-plugin-modify'

var minify = function (str) {
  str = str.replace(/\/\*(.|\n)*?\*\//g, ""); // multiline comments
  str = str.replace(/\s*(\{|\}|\[|\]|\(|\)|\:|\;|\,)\s*/g, "$1"); // space before chars (){}[]:;,
  str = str.replace(/#([\da-fA-F])\1([\da-fA-F])\2([\da-fA-F])\3/g, "#$1$2$3"); // condense hex code #FFFFFF => #FFF
  str = str.replace(/\n/g, "");
  str = str.replace(/;\}/g, "}");
  str = str.replace(/^\s+|\s+$/g, "");
  return str;
};

function plugin() {
  return modify({
    find: /css\s?`[\n\s]+?\/\*minify\*\/((?:\n*.+?\n*)+?)`/gm,
    replace: (match, code) => {
      return `css \`${minify(code)}\``
    }
  })
}

export default plugin;

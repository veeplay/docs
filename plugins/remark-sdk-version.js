const TOKEN = /\{\{ANDROID_SDK_VERSION\}\}/g;

const replaceIn = (node, version) => {
  ['value', 'url'].forEach((key) => {
    if (typeof node[key] === 'string') {
      // eslint-disable-next-line no-param-reassign
      node[key] = node[key].replace(TOKEN, version);
    }
  });
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => replaceIn(child, version));
  }
};

module.exports = ({ version }) => (tree) => replaceIn(tree, version);

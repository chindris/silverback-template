function readPackage(pkg) {
  const versions = {
    react: '19.0.0-rc.0',
    'react-dom': '19.0.0-rc.0',
    '@types/react': '18.3.3',
    '@types/react-dom': '18.3.0',
    'react-server-dom-webpack': '19.0.0-rc.0',
    typescript: '5.4.5',
    graphql: '16.8.1',
    waku: '0.21.0-alpha.2',
  };
  for (const type of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [name, version] of Object.entries(versions)) {
      if (pkg[type] && Object.keys(pkg[type]).includes(name)) {
        pkg[type][name] = version;
      }
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};

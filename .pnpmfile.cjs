function readPackage(pkg, context) {
  if (pkg.dependencies.react) {
    pkg.dependencies.react = '18.3.0-canary-56e20051c-20240311';
    pkg.dependencies['react-dom'] = '18.3.0-canary-56e20051c-20240311';
  }
  if (pkg.devDependencies.react) {
    pkg.devDependencies.react = '18.3.0-canary-56e20051c-20240311';
    pkg.devDependencies['react-dom'] = '18.3.0-canary-56e20051c-20240311';
  }
  if (pkg.peerDependencies.react) {
    pkg.peerDependencies.react = '18.3.0-canary-56e20051c-20240311';
    pkg.peerDependencies['react-dom'] = '18.3.0-canary-56e20051c-20240311';
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};

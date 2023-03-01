function readPackage(pkg, context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  if (pkg.name === '@netlify/build') {
    // Replace bar@x.x.x with bar@2.0.0
    pkg.dependencies = {
      ...pkg.dependencies,
      '@netlify/framework-info': '^9.0.0'
    }
    context.log('Adding @netlify/framework-info dependency to @netlify/build.');
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
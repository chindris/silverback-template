const micromatch = require('micromatch');

module.exports = (allStagedFiles) => {
  const files = micromatch(allStagedFiles, ['!packages/**', '!apps/**']);
  return [`prettier -w ${files.join(' ')}`];
};

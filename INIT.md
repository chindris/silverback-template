Run this file with `pnpx @amazeelabs/mzx run INIT.md` from the project root.

```ts
await prompt('PROJECT_NAME_HUMAN', {
  type: 'text',
  message: 'Project name for humans:',
  validate: (name) => (!/^.+$/.test(name) ? 'Must be not empty.' : true),
  initial: 'My Project',
});
if (!process.env.PROJECT_NAME_HUMAN) {
  // Because ctrl+c on prompt does not stop the script.
  throw new Error('Cancelled');
}
replace(
  'README.md',
  '# Silverback Template',
  '# ' + process.env.PROJECT_NAME_HUMAN,
);
replace(
  'apps/cms/config/sync/system.site.yml',
  'Silverback Drupal Template',
  process.env.PROJECT_NAME_HUMAN,
);

await prompt('PROJECT_NAME_MACHINE', {
  type: 'text',
  message: 'Project name for machines:',
  validate: (name) =>
    !/^[a-z][a-z\d_]*$/.test(name)
      ? 'Must start with a lowercase letter and contain lowercase letters, numbers and underscores only.'
      : true,
  initial: 'my_project',
});
replace(
  [
    '.lagoon.yml',
    'README.md',
    'apps/cms/config/sync/system.site.yml',
    'apps/cms/scaffold/settings.php.append.txt',
  ],
  'silverback-template',
  process.env.PROJECT_NAME_MACHINE,
);
replace(
  'package.json',
  '@amazeelabs/silverback-template',
  process.env.PROJECT_NAME_MACHINE,
);

replace(
  'README.md',
  /## Create a new project from this template.+?## /gs,
  '## ',
);

console.log(`
⚠️  ⬇️  ️Please read the following to finish the project setup ⬇️  ⚠️

When the lagoon project is ready, execute this to setup environments according to README.md:
  lagoon update project -p ${process.env.PROJECT_NAME_MACHINE} -b "^lagoon\\/|^(dev/stage/prod)$" 
`);

fs.unlinkSync('INIT.md');

function replace(path, from, to) {
  const paths = Array.isArray(path) ? path : [path];
  for (const path of paths) {
    if (!fs.existsSync(path)) {
      throw new Error(`File ${path} does not exist.`);
    }
    const contents = fs.readFileSync(path, 'utf8');
    if (!contents.match(from)) {
      throw new Error(`File ${path} does not contain ${from}.`);
    }
    fs.writeFileSync(path, contents.replaceAll(from, to), 'utf8');
  }
}
```

const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let anyMismatch = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const imports = content.match(/import.*?from\s+['"](.*?)['"]/g);
  if (imports) {
    imports.forEach(imp => {
      const match = imp.match(/from\s+['"](.*?)['"]/);
      if (match && match[1].startsWith('.')) {
        const importPath = path.resolve(path.dirname(file), match[1]);
        const dir = path.dirname(importPath);
        if (fs.existsSync(dir)) {
          const actualFiles = fs.readdirSync(dir);
          const baseName = path.basename(importPath);
          const fileWithoutExt = actualFiles.find(f => f.replace(/\.(ts|tsx|js|jsx)$/, '').toLowerCase() === baseName.toLowerCase() && f.replace(/\.(ts|tsx|js|jsx)$/, '') !== baseName);
          if (fileWithoutExt) {
            console.log('Mismatch in file ' + file + ':\nimported "' + baseName + '" but actual file is "' + fileWithoutExt + '"');
            anyMismatch = true;
          }
        }
      }
    });
  }
});

if (!anyMismatch) console.log('Check complete: no case conflicts.');

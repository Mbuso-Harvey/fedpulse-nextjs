const fs = require('fs');
const path = require('path');

const SRC_DIR = 'c:/ProcurementIntelligence/platform/apps/web/src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(SRC_DIR, function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has styles. references
    if (content.includes('styles.')) {
      console.log(`Patching leftover styles in: ${filePath}`);
      
      // Replace styles.foo with '' (empty string)
      content = content.replace(/styles\.[a-zA-Z0-9_]+/g, "''");
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log("Done patching leftover styles.");

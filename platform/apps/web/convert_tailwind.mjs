import fs from 'fs';
import path from 'path';

const SRC_DIR = 'c:/ProcurementIntelligence/platform/apps/web/src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const tailwindMap = {
  'container': 'w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500',
  'header': 'flex flex-col gap-3 mb-8',
  'titleGroup': 'flex items-center gap-3',
  'icon': 'w-6 h-6 text-indigo-500',
  'title': 'text-3xl font-bold tracking-tight text-slate-900',
  'subtitle': 'text-slate-500 text-lg',
  'contentArea': 'mt-8',
  'sectionTitle': 'text-xl font-semibold text-slate-900 mb-4',
  'emptyState': 'bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center',
  'emptyIcon': 'text-slate-400 mb-4',
  'primaryButton': 'mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md',
  'secondaryButton': 'mt-6 px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-all',
  'card': 'bg-white border border-slate-200 rounded-2xl p-6 shadow-sm',
  'grid': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  'wrapper': 'w-full min-h-screen bg-slate-50 text-slate-900',
  'navLinks': 'flex gap-4 items-center',
  'navActions': 'flex gap-4 items-center',
  'hero': 'py-20 text-center',
  'heroTitle': 'text-5xl font-bold tracking-tight text-slate-900 mb-6',
  'heroSubtitle': 'text-xl text-slate-600 max-w-3xl mx-auto',
  'methodology': 'py-16',
  'quality': 'py-16 bg-white',
  'security': 'py-16',
  'ctaSection': 'py-24 bg-indigo-950 text-white text-center',
  'footer': 'py-8 border-t border-slate-200 text-center text-slate-500',
  'tierGrid': 'grid grid-cols-1 md:grid-cols-3 gap-8 mt-12',
  'tierCard': 'bg-white border border-slate-200 rounded-2xl p-8',
  'tierBadge': 'inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4',
  'featureList': 'space-y-3',
  'featureItem': 'flex items-center gap-2 text-slate-600',
  'overlay': 'absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50',
  'blurred': 'blur-md pointer-events-none',
  'actions': 'flex gap-4 mt-8',
};

walkDir(SRC_DIR, function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it imports a module.css
    if (content.includes('.module.css')) {
      console.log(`Processing: ${filePath}`);
      
      // Remove import styles from './X.module.css'
      content = content.replace(/import\s+styles\s+from\s+['"][^'"]+\.module\.css['"];?\n?/g, '');
      
      // Replace dynamic classes: className={`${styles.foo} ${styles.bar}`} or className={styles.foo}
      // Since it's hard to parse full AST, we can do string replacements for className={styles.X}
      
      // Replace className={styles.xxx} with className="mapped-value"
      content = content.replace(/className=\{styles\.([a-zA-Z0-9_]+)\}/g, (match, className) => {
        let tw = tailwindMap[className] || 'p-4';
        return `className="${tw}"`;
      });
      
      // Replace ${styles.xxx} inside template literals with mapped value
      content = content.replace(/\$\{styles\.([a-zA-Z0-9_]+)\}/g, (match, className) => {
        return tailwindMap[className] || '';
      });
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log("Done patching CSS modules.");

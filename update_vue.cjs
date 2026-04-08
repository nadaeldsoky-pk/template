const fs = require('fs');
const path = require('path');

function updateVueFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) updateVueFiles(fp);
    else if (f.endsWith('.vue')) {
      let content = fs.readFileSync(fp, 'utf8');
      if (content.includes('<script setup>') && !content.includes('lang="ts"')) {
        content = content.replace(/<script setup>/g, '<script setup lang="ts">');
        fs.writeFileSync(fp, content, 'utf8');
        console.log('Updated ' + fp);
      }
    }
  });
}

function renameJsToTs(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) renameJsToTs(fp);
    else if (f.endsWith('.js')) {
      fs.renameSync(fp, fp.replace(/\.js$/, '.ts'));
      console.log('Renamed ', fp);
    }
  });
}

updateVueFiles('./src');
renameJsToTs('./src/API');
renameJsToTs('./src/i18n');

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'src'), (filePath) => {
    // Update .vue files
    if (filePath.endsWith('.vue')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('<script setup>') && !content.includes('<script setup lang="ts">')) {
            content = content.replace(/<script setup>/g, '<script setup lang="ts">');
            fs.writeFileSync(filePath, content);
            console.log(`Updated Vue file: ${filePath}`);
        }
    }
    
    // Rename API .js files to .ts
    if (filePath.includes(path.sep + 'API' + path.sep) && filePath.endsWith('.js')) {
        const newPath = filePath.replace(/\.js$/, '.ts');
        fs.renameSync(filePath, newPath);
        console.log(`Renamed API file to TS: ${newPath}`);
    }

    // Rename i18n/index.js to .ts
    if (filePath.includes(path.sep + 'i18n' + path.sep) && filePath.endsWith('.js')) {
        const newPath = filePath.replace(/\.js$/, '.ts');
        fs.renameSync(filePath, newPath);
        console.log(`Renamed i18n file to TS: ${newPath}`);
    }
});

console.log('Conversion script completed.');

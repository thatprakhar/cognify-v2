const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'src'), function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Regex to match "dark:" followed by any tailwind class characters (letters, numbers, dashes, slashes, brackets) until a space, quote, or backtick
        let newContent = content.replace(/dark:[^\s"'\`]+/g, '');
        // Clean up double spaces left by removal
        newContent = newContent.replace(/  +/g, ' ');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
console.log("Dark mode cleanup complete.");

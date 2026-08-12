const fs = require('fs');
const path = require('path');

function revertGrid(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            revertGrid(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const pattern = /<Grid\s+item\s+((?:(?:xs|sm|md|lg)=\{[^}]+\}\s*)+)/g;
            
            let count = 0;
            const newContent = content.replace(pattern, (match, propsStr) => {
                count++;
                const bps = [...propsStr.matchAll(/(xs|sm|md|lg)=\{([^}]+)\}/g)];
                const sizeStr = bps.map(bp => `${bp[1]}: ${bp[2]}`).join(', ');
                return `<Grid size={{ ${sizeStr} }} `;
            });
            
            if (count > 0) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath} (${count} replacements)`);
            }
            
            // Also need to handle <Grid item xs={12}> with no space at the end? 
            // The regex above has \s* so it consumes trailing spaces. 
            // Wait, my regex output might lose the trailing `>` if it wasn't matched. 
            // Actually `propsStr` matches up to the last `}`. So `match` doesn't consume `>`.
            // e.g. `<Grid item xs={12}>` -> matched `<Grid item xs={12}` 
            // Returns `<Grid size={{ xs: 12 }} >`
        }
    }
}

revertGrid('src');

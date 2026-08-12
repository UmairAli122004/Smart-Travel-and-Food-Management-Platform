const fs = require('fs');
const path = require('path');

function fixGrid(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixGrid(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Regex to find <Grid size={{ xs: 12, sm: 6 }} >
            const pattern = /<Grid\s+size=\{\{\s*([^}]+)\s*\}\}/g;
            
            let count = 0;
            const newContent = content.replace(pattern, (match, propsStr) => {
                count++;
                // propsStr is like "xs: 12, sm: 6"
                // split by comma, then map to "xs={12} sm={6}"
                const pairs = propsStr.split(',').map(p => p.trim()).filter(Boolean);
                const itemProps = pairs.map(p => {
                    const [key, val] = p.split(':').map(s => s.trim());
                    return `${key}={${val}}`;
                }).join(' ');
                
                return `<Grid item ${itemProps}`;
            });
            
            if (count > 0) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath} (${count} replacements)`);
            }
        }
    }
}

fixGrid('src');

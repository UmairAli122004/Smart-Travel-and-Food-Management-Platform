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
            
            // Regex to find `<Grid item xs={12} sm={6} md={3} >` etc.
            // Actually it's better to just find `<Grid ` and replace all `item` and `xs={...}` etc with `size={{ ... }}`.
            
            // Let's match any `<Grid ...>` tag
            const gridPattern = /<Grid\s+([^>]+)>/g;
            
            let count = 0;
            const newContent = content.replace(gridPattern, (match, propsStr) => {
                // Ignore if it's <Grid container>
                if (propsStr.includes('container')) return match;
                
                // If it has `item`, it's the one we want to fix
                if (propsStr.includes('item')) {
                    // Extract xs={12} sm={6} etc
                    const bpRegex = /(xs|sm|md|lg|xl)=\{(.*?)\}/g;
                    const breakpoints = [];
                    let bpMatch;
                    while ((bpMatch = bpRegex.exec(propsStr)) !== null) {
                        breakpoints.push(`${bpMatch[1]}: ${bpMatch[2]}`);
                    }
                    
                    if (breakpoints.length > 0) {
                        count++;
                        // Remove `item` and the breakpoints from propsStr
                        let newPropsStr = propsStr
                            .replace(/\bitem\b/, '')
                            .replace(bpRegex, '')
                            .replace(/\s+/g, ' ')
                            .trim();
                        
                        const sizeStr = `size={{ ${breakpoints.join(', ')} }}`;
                        return `<Grid ${sizeStr}${newPropsStr ? ' ' + newPropsStr : ''}>`;
                    }
                }
                
                // Also check if someone just put xs={12} without item
                const bpRegex = /(xs|sm|md|lg|xl)=\{(.*?)\}/g;
                let hasBp = false;
                let bpMatch2;
                const breakpoints2 = [];
                while ((bpMatch2 = bpRegex.exec(propsStr)) !== null) {
                    breakpoints2.push(`${bpMatch2[1]}: ${bpMatch2[2]}`);
                    hasBp = true;
                }
                
                if (hasBp) {
                    count++;
                    let newPropsStr = propsStr
                            .replace(bpRegex, '')
                            .replace(/\s+/g, ' ')
                            .trim();
                    const sizeStr = `size={{ ${breakpoints2.join(', ')} }}`;
                    return `<Grid ${sizeStr}${newPropsStr ? ' ' + newPropsStr : ''}>`;
                }

                return match;
            });
            
            if (count > 0) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath} (${count} replacements)`);
            }
        }
    }
}

fixGrid('src');

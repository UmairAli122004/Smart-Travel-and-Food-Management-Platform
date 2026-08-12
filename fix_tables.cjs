const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

function fixTablesInDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixTablesInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Match <Table> and <Table prop="..."> but NOT if it already has sx={...}
      // Also exclude <TableBody>, <TableHead> etc by enforcing a word boundary or space/end
      const tableRegex = /<Table(?!\w)(?![^>]*sx=)[^>]*>/g;
      
      if (tableRegex.test(content)) {
        content = content.replace(tableRegex, (match) => {
          if (match === '<Table>') {
             return '<Table sx={{ minWidth: { xs: 500, sm: 650 } }}>';
          } else {
             // It has other props, insert before the closing >
             return match.slice(0, -1) + ' sx={{ minWidth: { xs: 500, sm: 650 } }}>';
          }
        });
        modified = true;
      }
      
      // Attempt to fix Action columns wrapping.
      // Search for TableCell that contains an IconButton with EditIcon/DeleteIcon
      const actionCellRegex = /<TableCell([^>]*)>\s*<IconButton/g;
      if (actionCellRegex.test(content)) {
        content = content.replace(actionCellRegex, (match, props) => {
          if (!props.includes('sx=')) {
             return `<TableCell${props} sx={{ whiteSpace: 'nowrap' }}>\n                    <IconButton`;
          }
          return match;
        });
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

fixTablesInDir(srcPath);
console.log("Done fixing tables.");

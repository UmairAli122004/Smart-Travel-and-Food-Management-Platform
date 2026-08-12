import os
import re

def revert_grid(dir_path):
    # Regex to match <Grid item xs={...} sm={...} md={...} lg={...} ... >
    # Example: <Grid item xs={12} sm={6} md={3} key={foo}>
    # We want to replace "item xs={X} sm={Y} md={Z}" with "size={{ xs: X, sm: Y, md: Z }}"
    
    # We will find `<Grid item` and then capture the props.
    pattern = re.compile(r'<Grid\s+item\s+((?:xs|sm|md|lg)=\{[^\}]+\}\s*)+')
    
    def replacer(match):
        full_match = match.group(0)
        # Extract all breakpoints
        bps = re.findall(r'(xs|sm|md|lg)=\{([^\}]+)\}', full_match)
        if not bps:
            return full_match
        
        size_str = ", ".join([f"{bp}: {val}" for bp, val in bps])
        # Replace the matched item and breakpoint props with size={{ ... }}
        # Wait, the match includes the trailing space or other things?
        # Let's just reconstruct the <Grid tag
        # The full match might be: "<Grid item xs={12} sm={6} "
        return f'<Grid size={{{{ {size_str} }}}} '

    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content, count = pattern.subn(replacer, content)
                
                if count > 0:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath} ({count} replacements)")

revert_grid('src')

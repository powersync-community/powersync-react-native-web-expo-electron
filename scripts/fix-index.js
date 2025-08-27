const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');
const jsDir = path.join(__dirname, '../dist/_expo/static/js/web');
let bundleFile;

try {
    bundleFile = fs.readdirSync(jsDir).find(file => file.startsWith('entry-') && file.endsWith('.js'));
} catch (err) {
    console.error('Error reading js directory:', err);
    process.exit(1);
}

if (bundleFile && fs.existsSync(indexPath)) {
    const bundlePath = path.join(jsDir, bundleFile);
    let html = fs.readFileSync(indexPath, 'utf8');
    // Replace both absolute and relative paths
    html = html.replace(/\/*_expo\/static\/js\/web\/entry-[^"]+\.js/, `file://${bundlePath}`);
    // Add debug script to confirm bundle loading
    html = html.replace(
        '</body>',
        '<script>console.log("Bundle script tag reached");</script></body>'
    );
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('Updated index.html with file:// bundle path:', bundlePath);
} else {
    console.error('index.html or bundle file not found');
    process.exit(1);
}
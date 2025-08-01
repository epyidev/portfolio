const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📦 Copying frontend files...');

const frontendDistPath = path.join(__dirname, '../frontend/dist');
const destPath = path.join(__dirname, '../dist');

if (fs.existsSync(frontendDistPath)) {
  console.log('✅ Frontend dist found, copying files...');
  
  // List files in frontend/dist
  const files = fs.readdirSync(frontendDistPath);
  console.log('📁 Files to copy:', files);
  
  // Copy all frontend files directly to dist root
  copyDir(frontendDistPath, destPath);
  
  // Verify index.html exists
  const indexPath = path.join(destPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html copied successfully to dist/');
  } else {
    console.error('❌ index.html not found after copy!');
    process.exit(1);
  }
  
  // List final dist contents
  const finalFiles = fs.readdirSync(destPath);
  console.log('📁 Final dist contents:', finalFiles);
  
  console.log('✅ Frontend files copied successfully!');
} else {
  console.error('❌ Frontend dist folder not found at:', frontendDistPath);
  console.error('Make sure to run "npm run build:frontend" first');
  process.exit(1);
}

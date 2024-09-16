#!/bin/bash
# This script will rename all .js files to .jsx in the current directory and subdirectories.

# Find all .js files and rename them to .jsx
find . -name "*.js" -type f | while read file; do
  mv "$file" "${file%.js}.jsx"
done

echo "Renaming complete!"

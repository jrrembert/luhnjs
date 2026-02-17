#!/bin/bash

# Check if at least one file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file1> [file2] ..."
    exit 1
fi

current_year=$(date +"%Y")

for file in "$@"; do
  # Check if file exists
  if [ ! -f "$file" ]; then
      echo "Error: File $file not found"
      exit 1
  fi

  # Update "© YYYY" or "© YYYY-YYYY" patterns (README.md)
  sed -i.bak -E "s/(© )([0-9]{4})([-][0-9]{4})?/\1\2-$current_year/" "$file"

  # Update "(c) YYYY" or "(c) YYYY-YYYY" patterns (LICENSE)
  sed -i.bak -E "s/(\(c\) )([0-9]{4})([-][0-9]{4})?/\1\2-$current_year/" "$file"

  # Remove backup file
  rm "${file}.bak"

  echo "Copyright years updated in $file"
done

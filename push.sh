#!/bin/bash
# Check for changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit."
    exit 0
fi

# Get commit message from command line argument or prompt
if [ $# -eq 0 ]; then
    # No argument provided, prompt for message
    read -p "Enter your commit message: " COMMIT_MESSAGE
else
    # Use the first argument as commit message
    COMMIT_MESSAGE="$1"
fi

git add .

git commit -m "$COMMIT_MESSAGE"

git push
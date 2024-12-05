#!/bin/bash

read -p "Enter your commit message: " COMMIT_MESSAGE

if [ -z "$COMMIT_MESSAGE"]; then
    echo "Commit Message cannot be empty"
    exit 1
fi

git add .

git commit -m "$COMMIT_MESSAGE"

git push
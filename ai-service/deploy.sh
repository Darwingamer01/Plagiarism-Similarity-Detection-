#!/bin/bash
set -e

echo "🚀 Starting deployment to Hugging Face..."

# Ensure we are in the ai-service directory
cd "$(dirname "$0")"

# Cleanup previous attempts if any
rm -rf .git
git checkout Dockerfile

# Initialize temporary git repo
echo "📦 Initializing separate git repository..."
git init -b main

# Swap Dockerfile
echo "🔄 Swapping Dockerfile for HF version..."
cp Dockerfile.hf Dockerfile

# Add all files
# Add all files (including the new README.md)
git add .
git commit -m "Deploy to Hugging Face with Config"

# Prompt for Token
echo "🔑 Please enter your Hugging Face Access Token (starting with hf_):"
read -s HF_TOKEN
echo "Token received."

# Add remote with token (transiently used for this script execution to avoid storing it)
echo "🔗 Connecting to Hugging Face..."
git remote add space "https://Darwingamer01:${HF_TOKEN}@huggingface.co/spaces/Darwingamer01/plagiarism-ai-service"

# Push
echo "⬆️  Pushing to Hugging Face..."
git push --force space main

# Cleanup
echo "🧹 Cleaning up..."
rm -rf .git
git checkout Dockerfile

echo "✅ Deployment complete!"

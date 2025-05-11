#!/bin/bash

# Bash script to fix dependencies for WWIF project
echo -e "\033[0;36mStarting dependency fix script...\033[0m"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "\033[0;31mERROR: npm is not installed or not in PATH. Please install Node.js and npm first.\033[0m"
    exit 1
fi

# Function to prompt user to continue
prompt_continue() {
    read -p "$1 (y/n): " response
    case "$response" in
        [yY][eE][sS]|[yY]) return 0 ;;
        *) return 1 ;;
    esac
}

# Step 1: Clean up node_modules and package-lock
echo -e "\033[0;33mCleaning node_modules and package-lock.json...\033[0m"
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo -e "\033[0;32m✅ Removed node_modules directory\033[0m"
fi

if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo -e "\033[0;32m✅ Removed package-lock.json\033[0m"
fi

# Step 2: Install dependencies
echo -e "\033[0;33mInstalling dependencies...\033[0m"
if npm install; then
    echo -e "\033[0;32m✅ Dependencies installed successfully\033[0m"
else
    echo -e "\033[0;31m⚠ Error installing dependencies\033[0m"
    if ! prompt_continue "Would you like to continue with the script?"; then
        exit 1
    fi
fi

# Step 3: Ensure specific packages are installed
echo -e "\033[0;33mInstalling rehype-raw and remark-gfm...\033[0m"
if npm install rehype-raw remark-gfm --save; then
    echo -e "\033[0;32m✅ Installed rehype-raw and remark-gfm\033[0m"
else
    echo -e "\033[0;31m⚠ Error installing rehype-raw and remark-gfm\033[0m"
    echo -e "\033[0;33mThe codebase has been modified to work without these packages, but formatting may be affected.\033[0m"
fi

# Clear Next.js cache
echo -e "\033[0;33mClearing Next.js cache...\033[0m"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "\033[0;32m✅ Cleared Next.js cache\033[0m"
else
    echo -e "\033[0;32mNo .next directory found, nothing to clear\033[0m"
fi

# Create empty .next directory to avoid startup errors
if [ ! -d ".next" ]; then
    mkdir -p .next/cache
    mkdir -p .next/server
    mkdir -p .next/static
    echo -e "\033[0;32m✅ Created empty .next directory structure\033[0m"
fi

echo -e "\033[0;36mDependency fix completed!\033[0m"
echo -e "\033[0;36mYou can now run 'npm run dev' to start the development server.\033[0m"
echo -e "\033[0;33mNOTE: HTML in markdown may not render correctly due to the fallback markdown processor.\033[0m" 
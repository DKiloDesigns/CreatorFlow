#!/bin/bash
# Install Cash Dependencies

echo "Installing Cash dependencies..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Install required packages
echo "Installing required Python packages..."
pip3 install requests || {
    echo "Failed to install packages with pip3. Trying with python3 -m pip..."
    python3 -m pip install requests || {
        echo "Failed to install packages. Please install them manually:"
        echo "pip install requests"
        exit 1
    }
}

# Create directories
echo "Creating directories..."
mkdir -p results logs

# Make scripts executable
echo "Making scripts executable..."
chmod +x run_cash.sh
chmod +x test_setup.py
chmod +x update_knowledge_base.py

# Run test setup
echo "Running test setup..."
python3 test_setup.py

# Success message
if [ $? -eq 0 ]; then
    echo ""
    echo "Installation complete! Cash is ready to use."
    echo ""
    echo "To run the daily workflow, use:"
    echo "  ./run_cash.sh"
    echo ""
    echo "To update the knowledge base, use:"
    echo "  python3 update_knowledge_base.py"
    echo ""
    echo "To configure API keys, edit config.json"
else
    echo ""
    echo "Installation failed. Please fix the issues and try again."
fi
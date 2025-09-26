@echo off
REM EternalZORD Standalone - Windows Installation
REM Just drop this package in your main directory and run this script!

echo 🚀 EternalZORD Standalone Installation
echo ======================================
echo.

REM Check if Python 3 is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    echo    Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Python %PYTHON_VERSION% detected

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv eternalzord_env

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call eternalzord_env\Scripts\activate.bat

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create data and log directories
echo 📁 Creating data directories...
mkdir data\artifacts 2>nul
mkdir data\protocols 2>nul
mkdir data\knowledge 2>nul
mkdir data\docs 2>nul
mkdir logs 2>nul

REM Create startup script
echo ⚡ Creating startup script...
(
echo @echo off
echo REM EternalZORD Standalone Startup Script
echo echo 🚀 Starting EternalZORD Standalone...
echo.
echo REM Activate virtual environment
echo call eternalzord_env\Scripts\activate.bat
echo.
echo REM Start EternalZORD
echo python -m eternalzord.eternal_zord --port 7010
echo.
echo echo ✅ EternalZORD started on http://localhost:7010
echo echo 📊 Health check: http://localhost:7010/health
echo echo 🧠 Memory reanchor: http://localhost:7010/memory/reanchor
echo pause
) > start_eternalzord.bat

REM Create stop script
echo 🛑 Creating stop script...
(
echo @echo off
echo REM EternalZORD Standalone Stop Script
echo echo 🛑 Stopping EternalZORD...
echo.
echo REM Find and kill EternalZORD process
echo taskkill /f /im python.exe /fi "WINDOWTITLE eq eternal_zord" 2^>nul
echo.
echo echo ✅ EternalZORD stopped
echo pause
) > stop_eternalzord.bat

REM Create test script
echo 🧪 Creating test script...
(
echo @echo off
echo REM EternalZORD Standalone Test Script
echo echo 🧪 Testing EternalZORD...
echo.
echo REM Activate virtual environment
echo call eternalzord_env\Scripts\activate.bat
echo.
echo REM Test the installation
echo python -c "from eternalzord.eternal_zord import EternalZord; ez = EternalZord(); print('✅ EternalZORD import successful'); print(f'📁 Data directory: {ez.data_dir}'); print(f'📝 Log directory: {ez.log_dir}')"
echo.
echo echo ✅ Test completed successfully!
echo pause
) > test_eternalzord.bat

echo.
echo 🎉 Installation Complete!
echo ========================
echo.
echo ✅ EternalZORD Standalone is ready to use!
echo.
echo 🚀 To start: start_eternalzord.bat
echo 🛑 To stop:  stop_eternalzord.bat
echo 🧪 To test:  test_eternalzord.bat
echo.
echo 📖 Read README.md for full documentation
echo 🌐 Service will run on: http://localhost:7010
echo.
echo 🎯 Lloyd can now run: start_eternalzord.bat
echo.
pause

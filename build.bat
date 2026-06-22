@echo off
echo ========================================================
echo Compiling Backend using Portable Java 17...
echo ========================================================

REM Find the extracted JDK folder dynamically
for /d %%D in ("%~dp0jdk-17*") do set JAVA_HOME=%%~fD
if not defined JAVA_HOME (
    echo [ERROR] Portable JDK 17 not found. Please wait for the setup to complete.
    pause
    exit /b 1
)

set PATH=%JAVA_HOME%\bin;%PATH%
echo Using JAVA_HOME: %JAVA_HOME%
echo.

cd backend
call mvn clean install
pause

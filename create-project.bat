@echo off
title Project Folder Generator

echo ==============================
echo     PROJECT FOLDER GENERATOR
echo ==============================
echo.

set /p projectName="Enter your project name: "

if "%projectName%"=="" (
    echo.
    echo Project name cannot be empty.
    pause
    exit
)

echo.
echo Creating project: %projectName%
echo.

mkdir "%projectName%"

mkdir "%projectName%\config"
mkdir "%projectName%\models"
mkdir "%projectName%\middleware"
mkdir "%projectName%\controllers"
mkdir "%projectName%\routes"

echo.
echo Project folder created successfully!
echo.

tree "%projectName%" /F

echo.
pause

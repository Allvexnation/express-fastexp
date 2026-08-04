@echo off
setlocal EnableExtensions

title Express Instant Project Generator

:mainMenu
cls
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
powershell -Command "Write-Host '  EXPRESS INSTANT PROJECT GENERATOR' -ForegroundColor Yellow"
powershell -Command "Write-Host '  Created by Jhon Ladines' -ForegroundColor Green"
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.
powershell -Command "Write-Host '[1] ' -NoNewline -ForegroundColor Cyan; Write-Host 'Create new project' -ForegroundColor White"
powershell -Command "Write-Host '[2] ' -NoNewline -ForegroundColor Cyan; Write-Host 'Start a project' -ForegroundColor White"
powershell -Command "Write-Host '[3] ' -NoNewline -ForegroundColor Cyan; Write-Host 'Credits' -ForegroundColor White"
powershell -Command "Write-Host '[4] ' -NoNewline -ForegroundColor Cyan; Write-Host 'Exit' -ForegroundColor White"
echo.
set /p menuChoice="Enter your choice (1-4): "

if "%menuChoice%"=="1" goto createNewProject
if "%menuChoice%"=="2" goto startProject
if "%menuChoice%"=="3" goto showCredits
if "%menuChoice%"=="4" goto exitConfirmation

echo.
echo Invalid choice. Please select 1-4.
pause
goto mainMenu

:createNewProject
cls
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
powershell -Command "Write-Host '  CREATE NEW PROJECT' -ForegroundColor Yellow"
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.

set /p projectName="Enter your project name: "

if "%projectName%"=="" (
echo.
echo Project name cannot be empty.
pause
exit /b 1
)

echo.
set /p installExpress="Do you want to install Express? (Y/N): "

if /I "%installExpress%"=="Y" goto selectLanguage
if /I "%installExpress%"=="YES" goto selectLanguage

if /I "%installExpress%"=="N" goto basicProject
if /I "%installExpress%"=="NO" goto basicProject

echo.
echo Invalid choice. Please enter Y or N.
goto askExpress

:askExpress

set /p installExpress="Do you want to install Express? (Y/N): "

if /I "%installExpress%"=="Y" goto selectLanguage
if /I "%installExpress%"=="YES" goto selectLanguage

if /I "%installExpress%"=="N" goto basicProject
if /I "%installExpress%"=="NO" goto basicProject

echo.
echo Invalid choice. Please enter Y or N.
goto askExpress

:basicProject

echo.
echo Creating basic project folder...

mkdir "%projectName%" 2>nul

echo.
echo Project folder created successfully!
echo.

powershell -Command "Get-ChildItem -Path '%projectName%' -Recurse -Exclude node_modules | Select-Object -First 50 | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\', '') }"

echo.
pause
exit /b 0

:selectLanguage

echo.
echo Select your language:
powershell -Command "Write-Host '[1] ' -NoNewline; Write-Host 'JavaScript' -ForegroundColor Yellow"
powershell -Command "Write-Host '[2] ' -NoNewline; Write-Host 'TypeScript' -ForegroundColor Blue"
set /p languageChoice="Enter your choice (1 or 2): "

if "%languageChoice%"=="1" (
set "language=javascript"
set "extension=js"
set "mainFile=index.js"
goto selectAlias
)

if "%languageChoice%"=="2" (
set "language=typescript"
set "extension=ts"
set "mainFile=index.ts"
goto selectAlias
)

echo.
echo Invalid choice. Please select 1 or 2.
goto selectLanguage

:selectAlias

echo.
echo Select your path alias style:
echo [1] @ (e.g., @/controllers, @/models)
echo [2] / (e.g., /controllers, /models)
echo [3] None
set /p aliasChoice="Enter your choice (1-3): "

if "%aliasChoice%"=="1" (
set "aliasStyle=@"
goto selectDatabase
)

if "%aliasChoice%"=="2" (
set "aliasStyle=/"
goto selectDatabase
)

if "%aliasChoice%"=="3" (
set "aliasStyle=none"
goto selectDatabase
)

echo.
echo Invalid choice. Please select a number from 1 to 3.
goto selectAlias

:selectDatabase

echo.
echo Select your database:
powershell -Command "Write-Host '[1] ' -NoNewline; Write-Host 'SQL (MySQL)' -ForegroundColor DarkYellow"
powershell -Command "Write-Host '[2] ' -NoNewline; Write-Host 'SQLite' -ForegroundColor Cyan"
powershell -Command "Write-Host '[3] ' -NoNewline; Write-Host 'MongoDB' -ForegroundColor Green"
powershell -Command "Write-Host '[4] ' -NoNewline; Write-Host 'Supabase' -ForegroundColor DarkGreen"
powershell -Command "Write-Host '[5] ' -NoNewline; Write-Host 'None' -ForegroundColor Gray"
set /p databaseChoice="Enter your choice (1-5): "

if "%databaseChoice%"=="1" (
set "database=sql"
goto selectStorage
)

if "%databaseChoice%"=="2" (
set "database=sqlite"
goto selectStorage
)

if "%databaseChoice%"=="3" (
set "database=mongodb"
goto selectStorage
)

if "%databaseChoice%"=="4" (
set "database=supabase"
goto selectStorage
)

if "%databaseChoice%"=="5" (
set "database=none"
goto selectStorage
)

echo.
echo Invalid choice. Please select a number from 1 to 5.
goto selectDatabase

:selectStorage

echo.
echo Select your storage:
powershell -Command "Write-Host '[1] ' -NoNewline; Write-Host 'Cloudinary' -ForegroundColor Blue"
powershell -Command "Write-Host '[2] ' -NoNewline; Write-Host 'None' -ForegroundColor Gray"
set /p storageChoice="Enter your choice (1 or 2): "

if "%storageChoice%"=="1" (
set "storage=cloudinary"
goto selectPackageManager
)

if "%storageChoice%"=="2" (
set "storage=none"
goto selectPackageManager
)

echo.
echo Invalid choice. Please select 1 or 2.
goto selectStorage

:selectPackageManager

echo.
echo Select your package manager:
powershell -Command "Write-Host '[1] ' -NoNewline; Write-Host 'Bun' -ForegroundColor Yellow"
powershell -Command "Write-Host '[2] ' -NoNewline; Write-Host 'npm' -ForegroundColor Red"
set /p packageChoice="Enter your choice (1 or 2): "

if "%packageChoice%"=="1" (
set "packageManager=bun"
goto createProject
)

if "%packageChoice%"=="2" (
set "packageManager=npm"
goto createProject
)

echo.
echo Invalid choice. Please select 1 or 2.
goto selectPackageManager

:createProject

echo.
echo =========================================
echo Creating your Express project...
echo =========================================
echo.

if exist "%projectName%" (
echo A folder named "%projectName%" already exists.
echo.
pause
exit /b 1
)

mkdir "%projectName%"

mkdir "%projectName%\config"
mkdir "%projectName%\models"
mkdir "%projectName%\middleware"
mkdir "%projectName%\controllers"
mkdir "%projectName%\routes"

cd /d "%projectName%"

echo.
echo Initializing project...

if /I "%packageManager%"=="bun" (
call bun init -y
)

if /I "%packageManager%"=="npm" (
call npm init -y
)

echo.
echo Installing Express, dotenv, and nodemon...

if /I "%packageManager%"=="bun" (
call bun add express dotenv
call bun add -d nodemon
)

if /I "%packageManager%"=="npm" (
call npm install express dotenv
call npm install -D nodemon
)

if /I "%language%"=="javascript" (
if /I "%aliasStyle%"=="@" (
echo.
echo Installing module-alias for path aliases...
if /I "%packageManager%"=="bun" (
    call bun add module-alias
)
if /I "%packageManager%"=="npm" (
    call npm install module-alias
)
)

if /I "%aliasStyle%"=="/" (
echo.
echo Installing module-alias for path aliases...
if /I "%packageManager%"=="bun" (
    call bun add module-alias
)
if /I "%packageManager%"=="npm" (
    call npm install module-alias
)
)
)

if /I "%language%"=="typescript" (
echo.
echo Installing TypeScript packages...


if /I "%packageManager%"=="bun" (
    call bun add -d typescript tsx @types/node @types/express
)

if /I "%packageManager%"=="npm" (
    call npm install -D typescript tsx @types/node @types/express
)


)

echo.
echo Updating package.json with scripts...

if /I "%language%"=="javascript" (
if /I "%packageManager%"=="bun" (
    powershell -Command "(Get-Content package.json -Raw | ConvertFrom-Json | Add-Member -NotePropertyName scripts -NotePropertyValue @{dev='nodemon';start='bun index.js'} -PassThru | ConvertTo-Json -Depth 10) | Set-Content package.json"
)

if /I "%packageManager%"=="npm" (
    powershell -Command "(Get-Content package.json -Raw | ConvertFrom-Json | Add-Member -NotePropertyName scripts -NotePropertyValue @{dev='nodemon';start='node index.js'} -PassThru | ConvertTo-Json -Depth 10) | Set-Content package.json"
)
)

if /I "%language%"=="typescript" (
if /I "%packageManager%"=="bun" (
    powershell -Command "(Get-Content package.json -Raw | ConvertFrom-Json | Add-Member -NotePropertyName scripts -NotePropertyValue @{dev='nodemon';start='tsx index.ts';build='tsc'} -PassThru | ConvertTo-Json -Depth 10) | Set-Content package.json"
)

if /I "%packageManager%"=="npm" (
    powershell -Command "(Get-Content package.json -Raw | ConvertFrom-Json | Add-Member -NotePropertyName scripts -NotePropertyValue @{dev='nodemon';start='tsx index.ts';build='tsc'} -PassThru | ConvertTo-Json -Depth 10) | Set-Content package.json"
)
)

if /I "%language%"=="javascript" (
if /I "%aliasStyle%"=="@" (
echo.
echo Adding module-alias configuration to package.json...
powershell -Command "$json = Get-Content package.json -Raw | ConvertFrom-Json; $json | Add-Member -NotePropertyName _moduleAliases -NotePropertyValue @{'@'='.'} -PassThru | ConvertTo-Json -Depth 10 | Set-Content package.json"
)

if /I "%aliasStyle%"=="/" (
echo.
echo Adding module-alias configuration to package.json...
powershell -Command "$json = Get-Content package.json -Raw | ConvertFrom-Json; $json | Add-Member -NotePropertyName _moduleAliases -NotePropertyValue @{'/'='.'} -PassThru | ConvertTo-Json -Depth 10 | Set-Content package.json"
)

if /I "%aliasStyle%"=="@" (
echo.
echo Removing type: module from package.json for CommonJS compatibility...
powershell -Command "$json = Get-Content package.json -Raw | ConvertFrom-Json; $json.PSObject.Properties.Remove('type'); $json | ConvertTo-Json -Depth 10 | Set-Content package.json"
)

if /I "%aliasStyle%"=="/" (
echo.
echo Removing type: module from package.json for CommonJS compatibility...
powershell -Command "$json = Get-Content package.json -Raw | ConvertFrom-Json; $json.PSObject.Properties.Remove('type'); $json | ConvertTo-Json -Depth 10 | Set-Content package.json"
)
)

if /I "%database%"=="sql" (
echo.
echo Installing MySQL package...


if /I "%packageManager%"=="bun" (
    call bun add mysql2
)

if /I "%packageManager%"=="npm" (
    call npm install mysql2
)


)

if /I "%database%"=="sqlite" (
echo.
echo Installing SQLite package...


if /I "%packageManager%"=="bun" (
    call bun add better-sqlite3
)

if /I "%packageManager%"=="npm" (
    call npm install better-sqlite3
)


)

if /I "%database%"=="mongodb" (
echo.
echo Installing MongoDB package...


if /I "%packageManager%"=="bun" (
    call bun add mongoose
)

if /I "%packageManager%"=="npm" (
    call npm install mongoose
)


)

if /I "%database%"=="supabase" (
echo.
echo Installing Supabase package...


if /I "%packageManager%"=="bun" (
    call bun add @supabase/supabase-js
)

if /I "%packageManager%"=="npm" (
    call npm install @supabase/supabase-js
)


)

if /I "%storage%"=="cloudinary" (
echo.
echo Installing Cloudinary packages...


if /I "%packageManager%"=="bun" (
    call bun add cloudinary multer
)

if /I "%packageManager%"=="npm" (
    call npm install cloudinary multer
)


)

echo.
echo Installing cors, bcrypt, and jsonwebtoken packages...

if /I "%packageManager%"=="bun" (
    call bun add cors bcrypt jsonwebtoken
)

if /I "%packageManager%"=="npm" (
    call npm install cors bcrypt jsonwebtoken
)

echo.
echo Creating environment files...

(
echo PORT=3000
echo NODE_ENV=development
) > ".env"

(
echo PORT=3000
echo NODE_ENV=development
) > ".env.example"

if /I "%database%"=="sql" (
(
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=your_database
echo DB_USER=root
echo DB_PASSWORD=
) >> ".env"


(
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo DB_NAME=your_database
    echo DB_USER=root
    echo DB_PASSWORD=
) >> ".env.example"


)

if /I "%database%"=="sqlite" (
echo SQLITE_PATH=./database.sqlite>> ".env"
echo SQLITE_PATH=./database.sqlite>> ".env.example"
)

if /I "%database%"=="mongodb" (
echo MONGODB_URI=mongodb://127.0.0.1:27017/your_database>> ".env"
echo MONGODB_URI=mongodb://127.0.0.1:27017/your_database>> ".env.example"
)

if /I "%database%"=="supabase" (
(
echo SUPABASE_URL=your_supabase_url
echo SUPABASE_ANON_KEY=your_supabase_anon_key
) >> ".env"


(
    echo SUPABASE_URL=your_supabase_url
    echo SUPABASE_ANON_KEY=your_supabase_anon_key
) >> ".env.example"


)

if /I "%storage%"=="cloudinary" (
(
echo CLOUDINARY_CLOUD_NAME=your_cloud_name
echo CLOUDINARY_API_KEY=your_api_key
echo CLOUDINARY_API_SECRET=your_api_secret
) >> ".env"


(
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
) >> ".env.example"


)

echo.
echo Creating .gitignore...

(
echo node_modules/
echo .env
echo dist/
echo *.log
) > ".gitignore"

echo.
echo Creating nodemon.json...

if /I "%language%"=="typescript" (
(
echo {
echo   "watch": ["."],
echo   "ext": "ts,json",
echo   "ignore": ["node_modules", "dist"],
echo   "exec": "tsx index.ts",
echo   "delay": "500"
echo }
) > "nodemon.json"
)

if /I "%language%"=="javascript" (
(
echo {
echo   "watch": ["."],
echo   "ext": "js,json",
echo   "ignore": ["node_modules", "dist"],
echo   "exec": "node index.js",
echo   "delay": "500"
echo }
) > "nodemon.json"
)

echo.
echo Creating project files...

type nul > "controllers\controller.%extension%"
type nul > "config\jwt.%extension%"
type nul > "middleware\middleware.%extension%"
type nul > "routes\route.%extension%"

if /I "%database%"=="mongodb" (
type nul > "models\model.%extension%"
)

if /I "%database%"=="sql" (
type nul > "config\sql.%extension%"
)

if /I "%database%"=="sqlite" (
type nul > "config\sqlite.%extension%"
)

if /I "%database%"=="mongodb" (
type nul > "config\mongodb.%extension%"
)

if /I "%database%"=="supabase" (
type nul > "config\supabase.%extension%"
)

if /I "%storage%"=="cloudinary" (
type nul > "config\cloudinary.%extension%"
)

echo.
echo Creating Express server...

if /I "%language%"=="javascript" (
if /I "%aliasStyle%"=="@" (
(
echo require("module-alias/register"^);
echo require("dotenv"^).config(^);
echo.
echo const express = require("express"^);
echo.
echo const app = express(^);
echo const PORT = process.env.PORT ^|^| 3000;
echo.
echo app.use(express.json(^)^);
echo app.use(express.urlencoded({ extended: true }^)^);
echo.
echo app.get("/", (req, res^) =^> {
echo     res.status(200^).json({
echo         message: "Express JavaScript server is running!",
echo         environment: process.env.NODE_ENV
echo     }^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo     console.log(`Server is running at http://localhost:${PORT}`^);
echo }^);
) > "index.js"
)

if /I "%aliasStyle%"=="/" (
(
echo require("module-alias/register"^);
echo require("dotenv"^).config(^);
echo.
echo const express = require("express"^);
echo.
echo const app = express(^);
echo const PORT = process.env.PORT ^|^| 3000;
echo.
echo app.use(express.json(^)^);
echo app.use(express.urlencoded({ extended: true }^)^);
echo.
echo app.get("/", (req, res^) =^> {
echo     res.status(200^).json({
echo         message: "Express JavaScript server is running!",
echo         environment: process.env.NODE_ENV
echo     }^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo     console.log(`Server is running at http://localhost:${PORT}`^);
echo }^);
) > "index.js"
)

if /I "%aliasStyle%"=="none" (
(
echo require("dotenv"^).config(^);
echo.
echo const express = require("express"^);
echo.
echo const app = express(^);
echo const PORT = process.env.PORT ^|^| 3000;
echo.
echo app.use(express.json(^)^);
echo app.use(express.urlencoded({ extended: true }^)^);
echo.
echo app.get("/", (req, res^) =^> {
echo     res.status(200^).json({
echo         message: "Express JavaScript server is running!",
echo         environment: process.env.NODE_ENV
echo     }^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo     console.log(`Server is running at http://localhost:${PORT}`^);
echo }^);
) > "index.js"
)
)

if /I "%language%"=="typescript" (
(
echo import "dotenv/config";
echo import express from "express";
echo.
echo const app = express(^);
echo const PORT = Number(process.env.PORT^) ^|^| 3000;
echo.
echo app.use(express.json(^)^);
echo app.use(express.urlencoded({ extended: true }^)^);
echo.
echo app.get("/", (req, res^) =^> {
echo     res.status(200^).json({
echo         message: "Express TypeScript server is running!",
echo         environment: process.env.NODE_ENV
echo     }^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo     console.log(`Server is running at http://localhost:${PORT}`^);
echo }^);
) > "index.ts"
)

if /I "%language%"=="typescript" (
echo.
echo Creating TypeScript configuration...

if /I "%aliasStyle%"=="@" (
(
    echo {
    echo   "compilerOptions": {
    echo     "target": "ES2020",
    echo     "module": "CommonJS",
    echo     "moduleResolution": "Node",
    echo     "esModuleInterop": true,
    echo     "strict": true,
    echo     "skipLibCheck": true,
    echo     "outDir": "./dist",
    echo     "baseUrl": ".",
    echo     "paths": {
    echo       "@/*": ["./*"]
    echo     }
    echo   },
    echo   "include": ["**/*.ts"],
    echo   "exclude": ["node_modules", "dist"]
    echo }
) > "tsconfig.json"
)

if /I "%aliasStyle%"=="/" (
(
    echo {
    echo   "compilerOptions": {
    echo     "target": "ES2020",
    echo     "module": "CommonJS",
    echo     "moduleResolution": "Node",
    echo     "esModuleInterop": true,
    echo     "strict": true,
    echo     "skipLibCheck": true,
    echo     "outDir": "./dist",
    echo     "baseUrl": ".",
    echo     "paths": {
    echo       "/*": ["./*"]
    echo     }
    echo   },
    echo   "include": ["**/*.ts"],
    echo   "exclude": ["node_modules", "dist"]
    echo }
) > "tsconfig.json"
)

if /I "%aliasStyle%"=="none" (
(
    echo {
    echo   "compilerOptions": {
    echo     "target": "ES2020",
    echo     "module": "CommonJS",
    echo     "moduleResolution": "Node",
    echo     "esModuleInterop": true,
    echo     "strict": true,
    echo     "skipLibCheck": true,
    echo     "outDir": "./dist"
    echo   },
    echo   "include": ["**/*.ts"],
    echo   "exclude": ["node_modules", "dist"]
    echo }
) > "tsconfig.json"
)

)

echo.
echo =========================================
echo       PROJECT CREATED SUCCESSFULLY!
echo =========================================
echo.
echo Project Name: %projectName%
echo Language: %language%
echo Database: %database%
echo Storage: %storage%
echo Package Manager: %packageManager%
echo.
echo Included packages: cors, bcrypt, jsonwebtoken
echo.
echo Open the project:
echo cd %projectName%
echo.
echo Start development mode:
echo %packageManager% run dev
echo.
echo Open in your browser:
echo http://localhost:3000
echo.

echo.
echo =========================================
echo       STARTING DEVELOPMENT SERVER...
echo =========================================
echo.

if /I "%packageManager%"=="bun" (
    bun nodemon
)

if /I "%packageManager%"=="npm" (
    npm run dev
)

echo.
echo Server stopped. You are now in the project directory: %CD%
echo.
cmd /k

:startProject
cls
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
powershell -Command "Write-Host '  START A PROJECT' -ForegroundColor Yellow"
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.

set /p projectPath="Enter the project path: "

if "%projectPath%"=="" (
    echo.
    echo Project path cannot be empty.
    pause
    goto mainMenu
)

if not exist "%projectPath%" (
    echo.
    echo The path "%projectPath%" does not exist.
    pause
    goto mainMenu
)

cd /d "%projectPath%"
echo.
echo Successfully changed directory to: %projectPath%
echo.

echo Select your package manager:
powershell -Command "Write-Host '[1] ' -NoNewline -ForegroundColor Cyan; Write-Host 'Bun' -ForegroundColor Yellow"
powershell -Command "Write-Host '[2] ' -NoNewline -ForegroundColor Cyan; Write-Host 'npm' -ForegroundColor Red"
set /p packageManagerChoice="Enter your choice (1 or 2): "

if "%packageManagerChoice%"=="1" (
    set "packageManager=bun"
)

if "%packageManagerChoice%"=="2" (
    set "packageManager=npm"
)

if not "%packageManagerChoice%"=="1" if not "%packageManagerChoice%"=="2" (
    echo.
    echo Invalid choice. Please select 1 or 2.
    pause
    goto startProject
)

echo.
set /p runCommand="Enter the command to run (e.g., bun nodemon or npm run dev): "

if "%runCommand%"=="" (
    echo.
    echo Command cannot be empty.
    pause
    goto mainMenu
)

echo.
echo =========================================
echo       EXECUTING COMMAND
echo =========================================
echo.
echo Path: %projectPath%
echo Command: %runCommand%
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.

%runCommand%

echo.
echo Server stopped. You are now in the project directory: %CD%
echo.
cmd /k

:showCredits
cls
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
powershell -Command "Write-Host '              CREDITS' -ForegroundColor Yellow"
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.
powershell -Command "Write-Host '  Created by: ' -NoNewline; Write-Host 'Jhon Ladines' -ForegroundColor Green"
echo.
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
powershell -Command "Write-Host '  EXPRESS INSTANT' -ForegroundColor Magenta"
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
echo.
powershell -Command "Write-Host '  A powerful tool designed to make backend' -ForegroundColor White"
powershell -Command "Write-Host '  development easier by automating the' -ForegroundColor White"
powershell -Command "Write-Host '  creation of Express.js projects.' -ForegroundColor White"
echo.
powershell -Command "Write-Host '  Features:' -ForegroundColor Cyan"
powershell -Command "Write-Host '    - Auto-generate project structure' -ForegroundColor Gray"
powershell -Command "Write-Host '    - Support for JavaScript & TypeScript' -ForegroundColor Gray"
powershell -Command "Write-Host '    - Multiple database options' -ForegroundColor Gray"
powershell -Command "Write-Host '    - Cloud storage integration' -ForegroundColor Gray"
powershell -Command "Write-Host '    - Path alias configuration' -ForegroundColor Gray"
powershell -Command "Write-Host '    - Pre-configured middleware & auth' -ForegroundColor Gray"
echo.
powershell -Command "Write-Host '  No more manually creating folders,' -ForegroundColor Yellow"
powershell -Command "Write-Host '  files, and packages!' -ForegroundColor Yellow"
echo.
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
powershell -Command "Write-Host '  CONTACT & LINKS' -ForegroundColor Magenta"
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
echo.
powershell -Command "Write-Host '  Website: ' -NoNewline; Write-Host 'https://www.jhonladines.top/' -ForegroundColor Blue"
echo.
powershell -Command "Write-Host '  Repository: ' -NoNewline; Write-Host 'https://github.com/Allvexnation/express-instant' -ForegroundColor Blue"
echo.
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
powershell -Command "Write-Host '  Thank you for using Express Instant!' -ForegroundColor Green"
powershell -Command "Write-Host '  ========================================' -ForegroundColor DarkCyan"
echo.
pause
goto mainMenu

:exitConfirmation
cls
echo.
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
powershell -Command "Write-Host '  EXIT CONFIRMATION' -ForegroundColor Yellow"
powershell -Command "Write-Host '=========================================' -ForegroundColor Cyan"
echo.
powershell -Command "Write-Host 'Are you sure you want to exit? (Y/N)' -ForegroundColor White"
set /p exitChoice="Enter your choice: "

if /I "%exitChoice%"=="Y" (
    echo.
    powershell -Command "Write-Host 'Thank you for using Express Instant!' -ForegroundColor Green"
    echo.
    exit /b 0
)

if /I "%exitChoice%"=="N" (
    goto mainMenu
)

echo.
echo Invalid choice. Please enter Y or N.
pause
goto exitConfirmation

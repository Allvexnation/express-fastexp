@echo off
setlocal EnableExtensions

title Express Instant Project Generator

echo.
echo =========================================
echo       EXPRESS INSTANT PROJECT GENERATOR
echo =========================================
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

if /I "%installExpress%"=="Y" goto setupProject
if /I "%installExpress%"=="YES" goto setupProject

echo.
echo Creating basic project folder...

mkdir "%projectName%" 2>nul

echo.
echo Project folder created successfully!

tree "%projectName%" /F

pause
exit /b

:setupProject

echo.
echo Select your language:
echo [1] JavaScript
echo [2] TypeScript
set /p languageChoice="Enter your choice (1 or 2): "

if "%languageChoice%"=="1" (
set "language=javascript"
set "extension=js"
set "mainFile=index.js"
goto selectDatabase
)

if "%languageChoice%"=="2" (
set "language=typescript"
set "extension=ts"
set "mainFile=index.ts"
goto selectDatabase
)

echo.
echo Invalid choice.
goto setupProject

:selectDatabase

echo.
echo Select your database:
echo [1] SQL
echo [2] SQLite
echo [3] MongoDB
echo [4] Supabase
echo [5] None
set /p databaseChoice="Enter your choice (1-5): "

if "%databaseChoice%"=="1" (
set "database=sql"
set "databasePackage=mysql2"
set "databaseConfig=sql"
goto selectStorage
)

if "%databaseChoice%"=="2" (
set "database=sqlite"
set "databasePackage=better-sqlite3"
set "databaseConfig=sqlite"
goto selectStorage
)

if "%databaseChoice%"=="3" (
set "database=mongodb"
set "databasePackage=mongoose"
set "databaseConfig=mongodb"
goto selectStorage
)

if "%databaseChoice%"=="4" (
set "database=supabase"
set "databasePackage=@supabase/supabase-js"
set "databaseConfig=supabase"
goto selectStorage
)

if "%databaseChoice%"=="5" (
set "database=none"
set "databasePackage="
set "databaseConfig="
goto selectStorage
)

echo.
echo Invalid choice.
goto selectDatabase

:selectStorage

echo.
echo Select your storage:
echo [1] Cloudinary
echo [2] None
set /p storageChoice="Enter your choice (1 or 2): "

if "%storageChoice%"=="1" (
set "storage=cloudinary"
set "storagePackage=cloudinary multer"
goto selectPackageManager
)

if "%storageChoice%"=="2" (
set "storage=none"
set "storagePackage="
goto selectPackageManager
)

echo.
echo Invalid choice.
goto selectStorage

:selectPackageManager

echo.
echo Select your package manager:
echo [1] Bun
echo [2] npm
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
echo Invalid choice.
goto selectPackageManager

:createProject

echo.
echo =========================================
echo Creating project...
echo =========================================
echo.

mkdir "%projectName%" 2>nul

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
echo Installing Express and dotenv...

if /I "%packageManager%"=="bun" (
call bun add express dotenv
call bun add -d nodemon
)

if /I "%packageManager%"=="npm" (
call npm install express dotenv
call npm install -D nodemon
)

echo.
echo Installing selected database...

if not "%databasePackage%"=="" (
if /I "%packageManager%"=="bun" (
call bun add %databasePackage%
)

```
if /I "%packageManager%"=="npm" (
    call npm install %databasePackage%
)
```

)

echo.
echo Installing selected storage...

if not "%storagePackage%"=="" (
if /I "%packageManager%"=="bun" (
call bun add %storagePackage%
)

```
if /I "%packageManager%"=="npm" (
    call npm install %storagePackage%
)
```

)

if /I "%language%"=="typescript" (
echo.
echo Installing TypeScript packages...

```
if /I "%packageManager%"=="bun" (
    call bun add -d typescript tsx @types/node @types/express
)

if /I "%packageManager%"=="npm" (
    call npm install -D typescript tsx @types/node @types/express
)
```

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

```
(
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo DB_NAME=your_database
    echo DB_USER=root
    echo DB_PASSWORD=
) >> ".env.example"
```

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

```
(
    echo SUPABASE_URL=your_supabase_url
    echo SUPABASE_ANON_KEY=your_supabase_anon_key
) >> ".env.example"
```

)

if /I "%storage%"=="cloudinary" (
(
echo CLOUDINARY_CLOUD_NAME=your_cloud_name
echo CLOUDINARY_API_KEY=your_api_key
echo CLOUDINARY_API_SECRET=your_api_secret
) >> ".env"

```
(
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
) >> ".env.example"
```

)

echo.
echo Creating .gitignore...

(
echo node_modules/
echo .env
echo dist/
) > ".gitignore"

echo.
echo Creating nodemon.json...

(
echo {
echo   "watch": ["."],
echo   "ext": "%extension%,json",
echo   "ignore": ["node_modules", "dist"],
echo   "delay": "500"
echo }
) > "nodemon.json"

echo.
echo Creating folders and files...

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
echo Creating Express main server...

if /I "%language%"=="javascript" (
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
echo         message: "Express server is running!",
echo         environment: process.env.NODE_ENV
echo     }^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo     console.log(`Server is running at http://localhost:${PORT}`^);
echo }^);
) > "index.js"
)

if /I "%language%"=="typescript" (
(
echo import "dotenv/config";
echo import express, { Request, Response } from "express";
echo.
echo const app = express(^);
echo const PORT = Number(process.env.PORT^) ^|^| 3000;
echo.
echo app.use(express.json(^)^);
echo app.use(express.urlencoded({ extended: true }^)^);
echo.
echo app.get("/", (req: Request, res: Response^) =^> {
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

echo.
echo =========================================
echo PROJECT CREATED SUCCESSFULLY!
echo =========================================
echo.
echo Project: %projectName%
echo Language: %language%
echo Database: %database%
echo Storage: %storage%
echo Package Manager: %packageManager%
echo.
echo Open the project:
echo cd %projectName%
echo.
echo Start development mode:
echo %packageManager% run dev
echo.

cd ..

tree "%projectName%" /F

echo.
pause
endlocal

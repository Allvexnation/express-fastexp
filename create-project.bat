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
echo Project folder will be created without Express.
echo.

mkdir "%projectName%" 2>nul

echo.
echo Project folder created successfully!
tree "%projectName%" /F

echo.
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
goto selectDatabase
)

if "%languageChoice%"=="2" (
set "language=typescript"
set "extension=ts"
goto selectDatabase
)

echo.
echo Invalid choice. Please select 1 or 2.
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
echo [1] Cloudinary
echo [2] None
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
echo Invalid choice. Please select 1 or 2.
goto selectPackageManager

:createProject

echo.
echo =========================================
echo Creating your project...
echo =========================================
echo.

mkdir "%projectName%" 2>nul

mkdir "%projectName%\config"
mkdir "%projectName%\models"
mkdir "%projectName%\middleware"
mkdir "%projectName%\controllers"
mkdir "%projectName%\routes"

cd /d "%projectName%"

echo Initializing the project...

if /I "%packageManager%"=="bun" (
bun init -y
)

if /I "%packageManager%"=="npm" (
call npm init -y
)

echo.
echo Installing Express...

if /I "%packageManager%"=="bun" (
bun add express
)

if /I "%packageManager%"=="npm" (
call npm install express
)

if /I "%language%"=="typescript" (
echo.
echo Installing TypeScript packages...

```
if /I "%packageManager%"=="bun" (
    bun add -d typescript @types/node @types/express tsx
)

if /I "%packageManager%"=="npm" (
    call npm install -D typescript @types/node @types/express tsx
)
```

)

echo.
echo Installing selected database packages...

if /I "%database%"=="sql" (
if /I "%packageManager%"=="bun" (
bun add mysql2
)

```
if /I "%packageManager%"=="npm" (
    call npm install mysql2
)
```

)

if /I "%database%"=="sqlite" (
if /I "%packageManager%"=="bun" (
bun add better-sqlite3
)

```
if /I "%packageManager%"=="npm" (
    call npm install better-sqlite3
)
```

)

if /I "%database%"=="mongodb" (
if /I "%packageManager%"=="bun" (
bun add mongoose
)

```
if /I "%packageManager%"=="npm" (
    call npm install mongoose
)
```

)

if /I "%database%"=="supabase" (
if /I "%packageManager%"=="bun" (
bun add @supabase/supabase-js
)

```
if /I "%packageManager%"=="npm" (
    call npm install @supabase/supabase-js
)
```

)

if /I "%storage%"=="cloudinary" (
echo.
echo Installing Cloudinary...

```
if /I "%packageManager%"=="bun" (
    bun add cloudinary multer
)

if /I "%packageManager%"=="npm" (
    call npm install cloudinary multer
)
```

)

echo.
echo Creating starter files...

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

if /I "%language%"=="javascript" (
type nul > "server.js"
)

if /I "%language%"=="typescript" (
type nul > "server.ts"

```
(
    echo {
    echo   "compilerOptions": {
    echo     "target": "ES2020",
    echo     "module": "NodeNext",
    echo     "moduleResolution": "NodeNext",
    echo     "esModuleInterop": true,
    echo     "strict": true,
    echo     "skipLibCheck": true
    echo   }
    echo }
) > "tsconfig.json"
```

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

cd ..

tree "%projectName%" /F

echo.
pause
endlocal

@echo off
echo StreamHub - Setup MongoDB + Cloudinary
echo.
echo Este script prepara o backend para rodar com:
echo - MongoDB local (localhost:27017)
echo - Redis local (localhost:6379)
echo - Cloudinary (upload de imagens)
echo.
echo IMPORTANTE: Instale antes:
echo - MongoDB Community: https://www.mongodb.com/try/download/community
echo - Redis: https://redis.io/docs/install/
echo - Conta Cloudinary: https://cloudinary.com/console
echo.
pause

echo.
echo 1. Configurando variaveis de ambiente...

cd backend
if not exist .env copy .env.example .env

echo.
echo 2. Verificando Node.js...
node --version

echo.
echo 3. Instalando dependencias...
npm install

echo.
echo 4. Compilando TypeScript...
npm run build

echo.
echo 5. Verificando compilacao...
if exist dist\main.js (
  echo [OK] Build concluido com sucesso!
) else (
  echo [ERRO] Build falhou
  pause
  exit /b 1
)

echo.
echo Setup concluido!
echo.
echo Para rodar o backend:
echo   cd backend ^& npm run start:dev
echo.
echo Para rodar o web:
echo   cd web ^& npm install ^& npm run dev
echo.
echo Nao esqueca de configurar:
echo   - MongoDB rodando em localhost:27017
echo   - Redis rodando em localhost:6379
echo   - Cloudinary credentials no .env
echo.
pause

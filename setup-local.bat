@echo off
echo StreamHub - Setup Alternativo (sem Docker)
echo.
echo Este script prepara o backend para rodar com:
echo - PostgreSQL local (localhost:5432)
echo - Redis local (localhost:6379)
echo.
echo IMPORTANTE: Instale antes:
echo - PostgreSQL 16: https://www.postgresql.org/download/
echo - Redis: https://redis.io/docs/install/
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
pause

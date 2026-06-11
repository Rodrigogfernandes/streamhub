@echo off
echo ▶ StreamHub - Setup Inicial
echo.
echo 1. Copiando .env.example para .env...
copy backend\.env.example backend\.env >nul
echo.
echo 2. Subindo containers (PostgreSQL + Redis)...
docker compose up -d postgres redis
echo.
echo 3. Aguardando 10s para inicializacao...
timeout /t 10 /nobreak >nul
echo.
echo 4. Instalando dependencias do backend...
cd backend && npm install
echo.
echo 5. Gerando migrations...
cd backend && npm run typeorm -- migration:generate -n Init
echo.
echo 6. Rodando migrations...
cd backend && npm run typeorm -- migration:run
echo.
echo Setup concluido! Acesse http://localhost:3000
pause

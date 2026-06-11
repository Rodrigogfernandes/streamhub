# StreamHub — Documentação Técnica

## Arquitetura

### Backend (NestJS + TypeScript)
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # JWT + Passport + RBAC
│   │   ├── channels/      # CRUD canais, bulk upsert, busca
│   │   ├── import/        # Importação M3U/JSON/API/XTREAM + BullMQ
│   │   ├── ai/            # Classificação ML + integração OpenAI
│   │   ├── users/         # Perfis, preferências, roles
│   │   └── epg/           # Guia de programação eletrônica
│   ├── common/
│   │   ├── decorators/    # @Roles(), @CurrentUser()
│   │   ├── filters/       # Exceções Globais
│   │   ├── guards/        # JwtAuthGuard, RolesGuard
│   │   └── interceptors/  # Logging, Transform
│   └── config/            # Env + Database config
```

### Frontend Web (Next.js + TypeScript + TailwindCSS)
- App Router (Next 14+)
- Cliente HTTP baseado em React Query
- Design System próprio com Tailwind
- Player de vídeo com HLS.js

### Mobile (React Native + Expo)
- Stack: TypeScript + Redux Toolkit + React Query
- Player nativo (react-native-video / hls-player)
- Navegação por Stack + Bottom Tabs

### Smart TV (React Native TV)
- Android TV + Fire TV SDK
- Navegação por foco (D-pad)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend API | NestJS + TypeScript |
| Banco | PostgreSQL 16 + TypeORM |
| Cache/Fila | Redis + BullMQ |
| Autenticação | JWT + Passport + RBAC |
| Frontend | Next.js + TS + Tailwind |
| Mobile | React Native + Expo |
| TV | React Native TV |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| CDN | Cloudflare + AWS S3 |
| Streaming | HLS + nginx-rtmp + FFmpeg |

---

## Variáveis de Ambiente

### Backend
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=streamhub
DB_PASSWORD=streamhub
DB_DATABASE=streamhub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<secret>
OPENAI_API_KEY=<key>
TMDB_API_KEY=<key>
TVMAZE_API_URL=https://api.tvmaze.com
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker + Docker Compose
- PostgreSQL 16 (ou usar docker-compose)
- Redis (ou usar docker-compose)

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### 2. Web
```bash
cd web
npm install
npm run dev
```

### 3. Mobile
```bash
cd mobile
npm install
npx expo start
```

### 4. Docker (tudo junto)
```bash
docker compose up -d
```

---

## Pipeline IA (BullMQ)

1. Importação → cria `ImportJob`
2. BullMQ agenda workers:
   - `import.processor.ts` — parse M3U/JSON/XTREAM
   - `ai.processor.ts` — classifica canais
   - `enrichment.processor.ts` — TMDB/TVMaze
3. Status salvo em `channels` + `ai_classifications`

---

## Endpoints principais (Backend)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Registrar usuário |
| POST | /auth/login | Login |
| GET | /channels | Listar canais |
| GET | /channels/:id | Detalhes |
| POST | /import/m3u | Importar M3U |
| POST | /import/xtream | Importar Xtream |
| POST | /ai/classify-batch | Classificar lote via IA |

---

## Observações

- **Segurança**: Nunca commite `.env` ou segredos
- **Escalabilidade**: Workers IA rodam independentes via BullMQ
- **Performance**: Cache Redis em categorias e listas
- **Qualidade de streaming**: HLS/DASH suportados no player web e native

Bom desenvolvimento!

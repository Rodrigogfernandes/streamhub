# StreamHub — Documentação Técnica

## Arquitetura

### Backend (NestJS + TypeScript + MongoDB + Cloudinary)
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # JWT + Passport + RBAC
│   │   ├── channels/      # CRUD canais com Mongoose
│   │   ├── import/        # Importação M3U/JSON/API/XTREAM + BullMQ
│   │   ├── ai/            # Classificação ML + integração OpenAI
│   │   ├── users/         # Perfis, preferências, roles
│   │   ├── epg/           # Guia de programação eletrônica
│   │   └── upload/        # Upload de imagens via Cloudinary
│   ├── config/            # Env + Database config
```

### Frontend Web (Next.js + TypeScript + TailwindCSS)
- App Router (Next 14+)
- Cliente HTTP baseado em React Query
- Design System próprio com Tailwind
- Player de vídeo com HLS.js

### Mobile (React Native + Expo)
- Stack: TypeScript + Expo Router
- Player nativo (expo-av)

### Smart TV (React Native TV)
- Android TV + Fire TV SDK
- Navegação por foco (D-pad)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend API | NestJS + TypeScript |
| Banco | MongoDB 7 + Mongoose |
| Cache/Fila | Redis + BullMQ |
| Upload Imagens | Cloudinary |
| Autenticação | JWT + Passport + RBAC |
| Frontend | Next.js + TS + Tailwind |
| Mobile | React Native + Expo |
| TV | React Native TV |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| CDN | Cloudflare + AWS S3 |

---

## Variáveis de Ambiente

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/streamhub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
OPENAI_API_KEY=<key>
TMDB_API_KEY=<key>
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- MongoDB 7+
- Redis 7+
- Conta Cloudinary (gratuita)

### 1. Clone e instale
```bash
git clone <repo>
cd streamhub-full

# Setup automático (Windows)
setup-local.bat

# Ou manual:
cd backend
npm install
cp .env.example .env
```

### 2. Inicie serviços
```bash
# MongoDB
mongod

# Redis
redis-server
```

### 3. Backend
```bash
cd backend
npm run start:dev
# → http://localhost:3000/api
```

### 4. Web
```bash
cd web
npm install
npm run dev
# → http://localhost:3001
```

### 5. Mobile
```bash
cd mobile
npm install
npx expo start
```

### 6. Docker (tudo junto)
```bash
docker compose up -d
```

---

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Registrar usuário |
| POST | /api/auth/login | Login |
| GET | /api/channels | Listar canais |
| GET | /api/channels/:id | Detalhes |
| POST | /api/import/m3u | Importar M3U |
| POST | /api/upload/image | Upload de logo (Cloudinary) |
| POST | /api/ai/classify-batch | Classificar lote via IA |

---

## Upload de Imagens (Cloudinary)

O módulo de upload permite:
- Upload de logos de canais
- Geração automática de thumbs (800x450)
- Conversão para WebP (otimização)
- Deletar imagens por public_id

### Exemplo de uso
```typescript
POST /api/upload/image
Content-Type: multipart/form-data

file: <binary>

// Resposta
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "streamhub/channels/...",
  "width": 800,
  "height": 450
}
```

---

## Observações

- **Segurança**: Nunca commite `.env` ou segredos
- **Escalabilidade**: Workers IA rodam independentes via BullMQ + Redis
- **Performance**: Cache Redis + CDN Cloudinary para imagens
- **Qualidade de streaming**: HLS/DASH suportados no player web e native

Bom desenvolvimento!

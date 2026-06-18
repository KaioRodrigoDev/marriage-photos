# Davi e Mirna | Album dos Noivos

Aplicacao Next.js para convidados enviarem fotos do casamento, informarem o
nome, marcarem outras pessoas nas fotos e deixarem uma mensagem opcional. Os
noivos acessam `/admin` com senha para ver e baixar as fotos recebidas.

## Stack

- Next.js App Router
- Tailwind CSS
- Prisma
- Postgres/Neon
- VPS Oracle/Contabo via SFTP para persistir imagens

## Ambiente

Copie `.env.example` para `.env` e preencha:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
ADMIN_PASSWORD="uma-senha-para-os-noivos"
STORAGE_SWITCH_PASSWORD="uma-senha-para-trocar-a-vps"
VPS_SFTP_HOST="IP_OU_DOMINIO_DA_VPS"
VPS_SFTP_PORT="22"
VPS_SFTP_USER="ubuntu"
VPS_SFTP_PRIVATE_KEY="-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"
VPS_UPLOAD_PATH="/srv/apps/wedding-photo-gift/uploads"
PUBLIC_UPLOAD_BASE_URL="https://seudominio.com/uploads"

CONTABO_SFTP_HOST="IP_OU_DOMINIO_DA_CONTABO"
CONTABO_SFTP_PORT="22"
CONTABO_SFTP_USER="wedding-upload"
CONTABO_SFTP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
CONTABO_UPLOAD_PATH="/srv/apps/wedding-photo-gift/uploads"
CONTABO_PUBLIC_UPLOAD_BASE_URL="https://uploads.seudominio.com/uploads"
```

As variaveis `VPS_*` configuram a Oracle e as variaveis `CONTABO_*` configuram
a Contabo. Sem uma VPS remota configurada, o app salva uploads em
`public/uploads`, o que serve apenas para desenvolvimento local.

O destino ativo dos novos uploads fica salvo no banco em `AppSetting`, chave
`activeStorageTarget`. Cada foto tambem salva `storageTarget` em `PhotoGift`.
O painel `/admin` permite ver o espaco das duas VPS e alternar o destino ativo.

## Desenvolvimento

```bash
npm install
npm run db:migrate
npm run dev
```

Abra `http://localhost:3000`.

## Deploy

Na Vercel, configure as variaveis:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `STORAGE_SWITCH_PASSWORD`
- `VPS_SFTP_HOST`
- `VPS_SFTP_PORT`
- `VPS_SFTP_USER`
- `VPS_SFTP_PRIVATE_KEY`
- `VPS_UPLOAD_PATH`
- `PUBLIC_UPLOAD_BASE_URL`
- `CONTABO_SFTP_HOST`
- `CONTABO_SFTP_PORT`
- `CONTABO_SFTP_USER`
- `CONTABO_SFTP_PRIVATE_KEY`
- `CONTABO_UPLOAD_PATH`
- `CONTABO_PUBLIC_UPLOAD_BASE_URL`

Depois rode a migration no banco Neon:

```bash
npx prisma migrate deploy
```

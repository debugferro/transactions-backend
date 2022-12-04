FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm i

COPY . .

RUN npx prisma generate

ENV DATABASE_URL "postgresql://postgres:postgres@postgres:5432/Transactions_Backend?schema=public&connect_timeout=300"

EXPOSE 4000
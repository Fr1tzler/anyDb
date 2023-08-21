FROM node:18.12-alpine as build
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:18.12-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:18.12-alpine as runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules/
COPY --from=build /app/.dist ./dist/
CMD ["node", "dist/index.js"]

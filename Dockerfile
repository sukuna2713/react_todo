#ビルドフェイズ

FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

RUN npm run build

#実行フェイズ
FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
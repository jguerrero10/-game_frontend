FROM node:20 AS build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build --configuration=production

FROM nginx:1.25
COPY --from=build /app/dist/rock-paper-scissors /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM node:lts as build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable
COPY --from=build /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g daemon off;"]

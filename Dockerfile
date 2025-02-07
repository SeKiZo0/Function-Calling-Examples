#Node.js image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy Package.json
COPY package*.json ./

RUN npm install

#Copy everything else
COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
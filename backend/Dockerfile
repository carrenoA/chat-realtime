FROM node:18-alpine

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Puerto donde corre la app
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "run", "start:prod"]

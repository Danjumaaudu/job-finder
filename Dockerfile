# Use the official Playwright image (auto-updated to the latest)
FROM mcr.microsoft.com/playwright:focal

#setting working directory in the container
WORKDIR /app

#copyingpackage files first for better caching
COPY package*.json ./

#installing dependcies
RUN npm install


#copy the rest project file
COPY . .

#build the typescript file
RUN npm run build

#start the app
CMD [ "node","dist/index.js" ]
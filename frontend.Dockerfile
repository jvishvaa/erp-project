FROM node:alpine
RUN mkdir -p /home/app/frontend
WORKDIR /home/app/frontend/
COPY build /home/app/frontend/build
RUN npm install -g serve forever
EXPOSE 5000
CMD [ "serve", "-s", "/home/app/frontend/build" ]


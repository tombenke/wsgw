FROM node:6.11.2
#FROM node:8.2.0

# You can build it with the following command:
# docker build --no-cache --rm --build-arg HTTP_PROXY=$HTTP_PROXY --network=host -t tombenke/wsgw:latest .

#LABEL Description=" server image" Vendor="Tamás Benke" Version="1.0"

# Set the environment to the application server
ENV PDMS_NATS_URI="nats://demo.nats.io:4222"

COPY . /
RUN npm install && npm run build

# Start the worker
ENTRYPOINT node dist/app.js

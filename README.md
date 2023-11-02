# PX Project (PS2318) : RGB-LED Information Display System

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/965f803a-3e57-4734-9846-c69062efd913" width="200" height="150" alt="home_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/1d818068-cdb4-4477-bb43-4fc7276e410c" width="200" height="150" alt="request_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/ebb1c0bf-43c1-46be-a5fd-f8bad88c22d0" width="200" height="150" alt="Demo_Screenshot2"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/75a7578d-97b3-417a-a753-385310ee8ee6" width="200" height="150" alt="Demo_Screenshot2"/>

## Notes:
- it is suggested to use Google chrome when accessing this application to prevent any issues with display from other browsers
- Dependency version: NodeJS (v18.17.1.)



## How to locally run application

### React application (client)
- cd client
- npm install
- npm start
- change all instances of 54.252.255.57:3001 to localhost:3001 so the client calls the server side endpoints on the correct port

### Node application (server)
- cd server
- npm install
- npm index.js


## How to deploy application
- putty into EC2 instance
- cd display_board_interface
- git pull
- cd client
- npm run build
- sudo cp -r build/* /var/www/display_board_interface
- sudo systemctl reload nginx

- cd server
- sudo nano pingPi.js
    - change PI_URL to raspberry pi address (right now this is just the ngrok url)

- sudo nano sendPi.js
    -  change PI_URL to raspberry pi address (right now this is just the ngrok url)
- npm index.js
- once a static ip address and port forwarding rule has been estabished by IT, you can implement PM2 to have the server run as a background process


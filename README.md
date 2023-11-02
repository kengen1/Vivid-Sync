# PX Project (PS2318) : RGB-LED Information Display System

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/9951efe0-d438-46e3-b150-dad62ade17fe" width="200" height="150" alt="home_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/d45348aa-65ff-4102-8f13-d04103f2eb09" width="200" height="150" alt="request_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/12ea67e1-4294-44d8-9fe9-00779ce5d7ed" width="200" height="150" alt="Demo_Screenshot2"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/b1f29f9d-92d1-41ad-bc0c-a829a58c94d1" width="200" height="150" alt="Demo_Screenshot2"/>

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


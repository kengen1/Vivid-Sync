# Vivid Sync: RGB-LED Information Display System

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/965f803a-3e57-4734-9846-c69062efd913" width="200" height="150" alt="home_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/1d818068-cdb4-4477-bb43-4fc7276e410c" width="200" height="150" alt="request_actual"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/e8fae89a-dc21-4f34-b96a-edb180b1168d" width="200" height="150" alt="Demo_Screenshot2"/>

<img src="https://github.com/kengen1/Vivid-Sync/assets/99401421/75a7578d-97b3-417a-a753-385310ee8ee6" width="200" height="150" alt="Demo_Screenshot2"/>

## Notes:
- it is suggested to use Google chrome when accessing this application to prevent any issues with display from other browsers
- Dependency version: NodeJS (v18.17.1.)



## How to locally run application

### React application (client)
```sh
cd client
```
```sh
npm install
```
```sh
npm start
```
- change all instances of 54.252.255.57:3001 to localhost:3001 so the client calls the server side endpoints on the correct port

### Node application (server)
```sh
cd server
```
```sh
npm install
```
```sh
npm index.js
```


## How to deploy application
- putty into EC2 instance
  ```sh
  cd display_board_interface
  ```
  ```sh
   git pull
  ```
  ```sh
  cd client
  ```
  ```sh
  npm run build
  ```
  ```sh
  sudo cp -r build/* /var/www/display_board_interface
  ```
  ```sh
  sudo systemctl reload nginx
  ```
  ```sh
  cd server
  ```
  ```sh
  sudo nano pingPi.js
  ```
    - change PI_URL to raspberry pi address (right now this is just the ngrok url)

```sh
 sudo nano sendPi.js
```
  -  change PI_URL to raspberry pi address (right now this is just the ngrok url)
```sh
npm index.js
```
- once a static ip address and port forwarding rule has been estabished by IT, you can implement PM2 to have the server run as a background process


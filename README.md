Demo: https://conferencenow.info/ichat/

# IChat (Template for chat) 
Ionic + Firebase App

## After installing ionic environment
Replace firebaseConfig located in (src/app/app.module.ts) with your apiKey,authDomain,etc.

```
const firebaseConfig = {
  apiKey: "KEY",
  authDomain: "KEY",
  databaseURL: "KEY",
  projectId: "KEY",
  storageBucket: "KEY",
  messagingSenderId: "KEY"
};
```
Build the project

## To generate firebaseConfig key follow their official documentation

## Steps
1) Create Realtime database
2) Change rules to
```
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3) Go to Authentication -> Sign-in method -> Enable 'Email/Password'

(Note: You do not need to feed anything in database)

## Setup

Requirements to use this project:

##### Node.js (https://nodejs.org/download/)

##### npm (Node Package Manager, it comes with node.js installation)
In case you're not with the latest version of npm:
```sh
$ sudo npm install npm -g
```

##### Cordova & Ionic Cli
To install both of them on your system just launch this command:
```sh
$ sudo npm install cordova ionic -g
```

## Install NPM Dependencies
Once you clone this repository, run this command on your terminal to install all needed dependencies:
```sh
$ npm install
```

## Install cordova plugin Dependencies
Run this command on your terminal to add a platform and install all needed puglins:

iOS:
```sh
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Android:
```sh
$ ionic cordova platform add android
$ ionic cordova run android
```
## Launching the App
After installing the needed dependencies you are done, launch your app with a simple
```sh
$ ionic serve
```

## Installing dependencies
```
$npm install
```

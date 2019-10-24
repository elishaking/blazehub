# BlazeChat/BlazeHub Full Stack App

A platform for connecting people: A place to chat, follow interesting conversions and be a part of a growing community

https://blazehub.skyblazar.com

### _Under development_

## Setup

- Create a firebase project: https://console.firebase.google.com
- Create a .env file in the projects root
- Add the following variables:

```env
PORT=8000
NODE_ENV=development
FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
FIREBASE_DATABASE_URL=<YOUR_FIREBASE_DATABASE_URL>
FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
FIREBASE_MESSEGING_SENDER_ID=<YOUR_FIREBASE_MESSEGING_SENDER_ID>
FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID>
SECRET_OR_KEY=<YOUR_SECRET_OR_KEY>
```

- Run the following commands to install dependencies:

```
npm i
```

```
cd client && npm i
```

- Finally, run this command in the project root to launch the project:

```
npm run dev
```

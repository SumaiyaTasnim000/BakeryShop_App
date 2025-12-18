# Welcome to the Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

Emulator used: android studio
TypeScript + JSX -- .tsx file extension

https://expo.dev/artifacts/eas/6JrwvLV23waCHU3PMncs54.aab

1. To run server (http://localhost:8081/)
   C:\Users\X1 CARBON\bakery-app : npx expo start
2. """Cache remove and use-> npx expo start --tunnel --clear """

3. Alt --> npx expo start --tunnel
4. npm start

5. To see attached emulators (in another powershell while running the metro bundler)- adb devices

When ready to test a full APK → run eas build --platform android --profile preview

6. a. set up a new device- (keeping the homescreen of emu device on)
   b. npx expo install expo
   c. Download the Android Emulator apk from->https://expo.dev/go
   d. adb install (drag and drop the apk to terminal)ex: adb install 'c:\Users\X1 CARBON\Expo-Go-54.0.6.apk'  
   e. then run -> npx expo start --tunnel --clear

!!!! Connect to backend-- node server.js in directory C:\Users\X1 CARBON\bakery-app\bakery-backend
Tips->

1.  cltr+M for dev tools.

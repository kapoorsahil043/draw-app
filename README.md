# push notification
expo install expo-notifications
expo install expo-permissions
expo install expo-localization 
expo install expo-device
expo install @react-native-community/datetimepicker

# create a new repository on the command line
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kapoorsahil043/draw-app.git
git push -u origin main

#  push an existing repository from the command line
git remote add origin https://github.com/kapoorsahil043/draw-app.git
git branch -M main
git push -u origin main

# to change remote repo
git remote -v
git remote set-url origin https://github.com/kapoorsahil043/draw-app.git


# git cmd
git push --set-upstream origin master 


# expo cmd
expo build:android

# FCM
https://docs.expo.io/push-notifications/using-fcm/


# loader animation
https://www.npmjs.com/package/react-native-animated-loader
npm install react-native-animated-loader --save


# Status code
200 - success
404 - resource not found
400 - bad request
201 - created
401 - unauthorised
500 - server error

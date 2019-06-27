rm -rf cordova/www/
rm -rf cordova/platforms/

ng build --prod --aot --output-path cordova/www/ --base-href "./"
# ng build --output-path cordova/www/ --base-href "./"
CDVA="/Users/sumanjha/Downloads/windmill-inspection/windmill-inspection/cordova"
# echo $CDVA
cd cordova
# cd '$CDVA'
# cordova platform add android
cordova platform add ios
# rm -rf 'platforms/ios/Notus Project/Resources/GoogleService-Info.plist' && cp 'GoogleService-Info.plist' 'platforms/ios/Notus Project/Resources'

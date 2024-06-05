import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  "expo": {
    "name": "fleetWs",
    "slug": "fleetWs",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",

    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#202024"
    },
    "ios": {
      "supportsTablet": true,
      "config": {
        "googleMapsApiKey": ""
      },
      "infoPlist": {

        
        "UIBackgroundModes": ["location"]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#202024",
      },
      "package": "com.gustavobhweb.fleetWs",
      "config": {
        "googleMaps": {
          "apiKey": process.env.KEY_SDK_MAPS
        } 
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",// OBETER ACESSO LOCALIZAÇÃO + PRECISA
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
}

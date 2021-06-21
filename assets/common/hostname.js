import { Platform } from 'react-native'


let hostname = '';
{Platform.OS == 'android'
? hostname = 'http://10.0.2.2:3000'
: hostname = 'http://localhost:3000'
}

export default hostname;

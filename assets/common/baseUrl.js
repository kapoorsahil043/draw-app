import { Platform } from 'react-native'
import * as constants from "./constants";

let baseURL = `${constants.HOSTNAME}/api/v1/`;
//let baseURL = '';
//{Platform.OS == 'android'
//? baseURL = 'http://10.0.2.2:3000/api/v1/'
//: baseURL = 'http://localhost:3000/api/v1/'
//}

export default baseURL;

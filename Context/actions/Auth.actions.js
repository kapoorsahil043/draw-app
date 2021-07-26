import jwt_decode from "jwt-decode"
import AsyncStorage from "@react-native-community/async-storage"
import Toast from "react-native-toast-message"
import baseURL from "../../assets/common/baseUrl"
import axios from "axios";

export const SET_CURRENT_USER = "SET_CURRENT_USER";


export const verify = (user, dispatch,succussCallBack,errorCallBack) => {
    fetch(`${baseURL}users/verify`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data && data.success) {
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: data.message,
                text2: ""
            });
            succussCallBack(data);
        } else {
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: data.message,
                text2: ""
            });
            errorCallBack(data);
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: err.message,
            text2: ""
        });
        errorCallBack(data);
    });
};

export const verifyOtp = (user, dispatch,succussCallBack,errorCallBack) => {
    fetch(`${baseURL}users/verifyOtp`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data && data.success) {
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: data.message,
                text2: ""
            });
            succussCallBack(data);
        } else {
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: data.message,
                text2: ""
            });
            errorCallBack(data);
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: err.message,
            text2: ""
        });
        errorCallBack(data);
    });
};

export const changePassword = (user, dispatch,succussCallBack,errorCallBack) => {
    fetch(`${baseURL}users/changePassword`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data && data.success) {
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: data.message,
                text2: ""
            });
            succussCallBack(data);
        } else {
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: data.message,
                text2: ""
            });
            errorCallBack(data);
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: err.message,
            text2: ""
        });
        errorCallBack(data);
    });
};

export const loginUser = async (user, dispatch,succussCallBack,errorCallBack) => {
    await AsyncStorage.getItem("push_id")
    .then((data) => {
        user.pushId = data;
        console.log('push_id',data);
    })
    .catch((error) => [console.log(error)]);

    console.log('user',user);

    fetch(`${baseURL}users/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            const token = data.token;
            AsyncStorage.setItem("jwt", token)
            const decoded = jwt_decode(token)
            dispatch(setCurrentUser(decoded, {email:user.email}))
            getUserProfile(decoded.userId,token,succussCallBack);
            
        } else {
           logoutUser(dispatch)
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Please provide correct credentials",
            text2: ""
        });
        logoutUser(dispatch)
        errorCallBack();
    });
};

const saveProfile =(user) =>{
    AsyncStorage.setItem("usr", JSON.stringify({image:user.image}))
}

export const getUserProfile = async (id,token,succussCallBack) => {
    console.log('getUserProfile');

    fetch(`${baseURL}users/${id}`, {
        method: "GET",
        //body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then((res) => res.json())
    .then((data) => [saveProfile(data),succussCallBack(data)])
    .catch((error) => console.log('auth err',error));
}

export const logoutUser = (dispatch) => {
    AsyncStorage.removeItem("jwt");
    AsyncStorage.removeItem("usr");
    dispatch(setCurrentUser({}))
}

export const checkUserStatus = (dispatch) => {
    console.log('checkUserStatus');

    AsyncStorage.getItem("jwt")
    .then((jwt) => {
      const decoded = jwt_decode(jwt)
      console.log('decoded',decoded);
      //dispatch(setCurrentUser(decoded, {userId:decoded.userId}))
      //succussCallBack();
    })
    .catch((error) => [console.log(error)]);
};

export const setCurrentUser = (decoded, user) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        userProfile: user
    }
}

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn : false,
  userType : null,
  userData : null,
    // isLoggedIn : true,
    // userType : "eventCreator",
    // userData : {
    //   name : 'abh',
    //   email : "abh@gmail.com",
  // }
}

const authSlice = createSlice({
  name : 'auth',
  initialState,
  reducers : {
    login : (state,action) =>{
      // console.log(action)
      state.isLoggedIn = true;
      state.userType = action.payload.userType;
      state.userData = action.payload.userData;
    },
    logout : (state) =>{
      // console.log("Logout",state)
      state.isLoggedIn = false;
      state.userType = null;
      state.userData = null;
    },
    updateDetails: (state, action) => {
      state.userData.details = action.payload;
    },
  }
});

export const {login,logout,updateDetails} = authSlice.actions;
export default authSlice.reducer;
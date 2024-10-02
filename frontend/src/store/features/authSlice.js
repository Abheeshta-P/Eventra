import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn : true,
  userType : null,
  userData : null
}

const authSlice = createSlice({
  name : 'auth',
  initialState,
  reducers : {
    login : (state,action) =>{
      state.isLoggedIn = true;
      state.userType = action.payload.userType;
      state.userData = action.payload.userData;
    },
    logout : (state) =>{
      state.isLoggedIn = false;
      state.userType = null;
      state.userData = null;
    }
  }
});

export const {login,logout} = authSlice.actions;

export default authSlice.reducer;
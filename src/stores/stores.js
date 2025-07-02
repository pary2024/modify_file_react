// src/app/store.js or src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import treatReducer from "./treatSlice";
import doctorReducer from "./doctorSlice";
import appointmentPatientReducer from "./appointmentPatientSlice";
import invoicePatientReducer from "./invoicePatientSlice";
import patientReducer from "./patientSlice";
import payReducer from"./paySlice";
import provinceReducer from"./provinceSlice";
import companyReducer from "./companySlice";
import reportReducer from "./reportSlice";
import dutyDoctorReducer from "./dutyDoctorSlice";
import labReducer from "./labSlice";
import materialReducer from "./materialSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, 
    user: userReducer, 
    treat: treatReducer,
    doctor:doctorReducer,
    appointmentPatient:appointmentPatientReducer,
    invoicePatient:invoicePatientReducer,
    patient:patientReducer,
    pay:payReducer,
    province:provinceReducer,
    company:companyReducer,
    report:reportReducer,
    duty:dutyDoctorReducer,
    lab:labReducer,
    material:materialReducer
  },
});

export default store;

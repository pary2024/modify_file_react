// src/app/store.js or src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../stores/authSlice";
import userReducer from "../stores/userSlice";
import treatReducer from "../stores/treatSlice";
import doctorReducer from "../stores/doctorSlice";
import appointmentPatientReducer from "../stores/appointmentPatientSlice";
import invoicePatientReducer from "../stores/invoicePatientSlice";
import patientReducer from "../stores/patientSlice";
import payReducer from"../stores/paySlice";
import provinceReducer from"../stores/provinceSlice";
import companyReducer from "../stores/companySlice";
import reportReducer from "../stores/reportSlice";
import dutyDoctorReducer from "../stores/dutyDoctorSlice";
import labReducer from "../stores/labSlice";
import materialReducer from "../stores/materialSlice";

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

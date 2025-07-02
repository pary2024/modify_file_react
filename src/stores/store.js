// src/app/store.js or src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../Stores/authSlice";
import userReducer from "../Stores/userSlice";
import treatReducer from "../Stores/treatSlice";
import doctorReducer from "../Stores/doctorSlice";
import appointmentPatientReducer from "../Stores/appointmentPatientSlice";
import invoicePatientReducer from "../Stores/invoicePatientSlice";
import patientReducer from "../Stores/patientSlice";
import payReducer from"../Stores/paySlice";
import provinceReducer from"../Stores/provinceSlice";
import companyReducer from "../Stores/companySlice";
import reportReducer from "../Stores/reportSlice";
import dutyDoctorReducer from "../Stores/dutyDoctorSlice";
import labReducer from "../Stores/labSlice";
import materialReducer from "../Stores/materialSlice";

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

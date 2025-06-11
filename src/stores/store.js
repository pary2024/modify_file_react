// src/app/store.js or src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../../src/stores/authSlice";
import userReducer from "../../src/stores/userSlice";
import treatReducer from "../../src/stores/treatSlice";
import doctorReducer from "../../src/stores/doctorSlice";
import appointmentStudentReducer from "../../src/stores/appointmentStudentSlice";
import appointmentPatientReducer from "../../src/stores/appointmentPatientSlice";
import invoicePatientReducer from "../../src/stores/invoicePatientSlice";
import invoiceStudentReducer from "../../src/stores/invoiceStudentSlice";
import smsReducer from "../../src/stores/smsSlice";
import patientReducer from "../../src/stores/patientSlice";
import payReducer from"../stores/paySlice";
import provinceReducer from"../stores/provinceSlice";
import schoolReducer from "../stores/schoolSlice";
import studentReducer from "../stores/studentSlice";
const store = configureStore({
  reducer: {
    auth: authReducer, 
    user: userReducer, 
    treat: treatReducer,
    doctor:doctorReducer,
    appointmentStudent:appointmentStudentReducer,
    appointmentPatient:appointmentPatientReducer,
    invoicePatient:invoicePatientReducer,
    invoiceStudent:invoiceStudentReducer,
    sms:smsReducer,
    patient:patientReducer,
    pay:payReducer,
    province:provinceReducer,
    school:schoolReducer,
    student:studentReducer,
  },
});

export default store;

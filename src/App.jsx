// App.jsx (unchanged)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dash from "./pages/Dash";
import PatientList from "./pages/PatientList";
import Appointment from "./pages/Appointment";
import Report from "./pages/Report";
import Sms from "./pages/Sms";
import Finance from "./pages/Finance";
import HumanResources from "./pages/HumanResources";
import Doctor from "./pages/Doctor";
import Department from "./pages/Department";
import Login from "./Auth/Login";
import Student from "./pages/Student";
import Payment from "./pages/Payment";
import PaymentStudent from "./pages/PaymentStudent";
import AppointmentStudent from "./pages/AppointmentStudent";
import UserManagement from "./pages/UserManagement";
import PrivateRoute from "./Routes/privateRoute";
import SchoolManagement from "./pages/SchoolManagement";
import Provinces from "./pages/Provnces";
import Treat from "./pages/Treat";

import PaymentMethod from "./pages/Method";
import 'aos/dist/aos.css';
import Aos from "aos";
import { useEffect } from "react";

function App() {
   useEffect(() => {
    Aos.init({
      duration: 200,
      once: true,
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Sidebar />}>
            <Route index element={<Dash />} />
            <Route path="dash" element={<Dash />} />
            <Route path="list" element={<PatientList />} />
           <Route path="method" element={<PaymentMethod/>}/>
            <Route path="appoint/patient" element={<Appointment />} />
            <Route path="report" element={<Report />} />
            <Route path="sms" element={<Sms />} />
            <Route path="finance" element={<Finance />} />
            <Route path="human" element={<HumanResources />} />
            <Route path="department" element={<Department />} />
            <Route path="student" element={<Student />} />
            <Route path="payment/patient" element={<Payment />} />
            <Route path="payment/student" element={<PaymentStudent />} />
            <Route path="appoint/student" element={<AppointmentStudent />} />
            <Route path="doctor" element={
              <PrivateRoute requiredRole="admin">
                <Doctor/>
              </PrivateRoute>
            } />
            <Route path="school" element={
              <PrivateRoute requiredRole="admin">
                <SchoolManagement/>
              </PrivateRoute>
            }/>
            <Route path="province" element={
              <PrivateRoute  requiredRole="admin"><Provinces/></PrivateRoute>
            }/>
            <Route path="treat" element={
              <PrivateRoute  requiredRole="admin">
                <Treat/>
              </PrivateRoute>
            }/>
            <Route
              path="user"
              element={
                <PrivateRoute requiredRole="admin">
                  <UserManagement/>
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
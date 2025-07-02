import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import PatientList from "./Pages/PatientList";
import Appointment from "./Pages/Appointment";
import Report from "./Pages/Report";
import Finance from "./Pages/Finance";
import Doctor from "./Pages/Doctor";
import Department from "./Pages/Department";
import Login from "./Auth/Login";
import Payment from "./Pages/Payment";
import PaymentStudent from "./Pages/PaymentStudent";
import AppointmentStudent from "./Pages/AppointmentStudent";
import UserManagement from "./Pages/UserManagement";
import Company from "./Pages/Company";
import Provinces from "./Pages/Provnces";
import Treat from "./Pages/Treat";
import PaymentMethod from "./Pages/Method";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect } from "react";
import DutyDoctor from "./Pages/DutyDoctor";
import Lab from "./Pages/Lab";
import Material from "./Pages/Material";
import PrivateRoute from "./Routes/PrivateRouter";
import Dash from "./Pages/Dash";
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
            <Route path="list" element={<PatientList />} />
            <Route path="method" element={<PaymentMethod />} />
            <Route path="appoint/patient" element={<Appointment />} />
            <Route path="report" element={<Report />} />
            <Route path="finance" element={<Finance />} />

            <Route path="department" element={<Department />} />

            <Route path="payment/patient" element={<Payment />} />
            <Route path="payment/student" element={<PaymentStudent />} />
            <Route path="appoint/student" element={<AppointmentStudent />} />

            <Route path="company" element={<Company />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="province" element={<Provinces />} />
            <Route path="treat" element={<Treat />} />
            <Route path="user" element={<UserManagement />} />

            <Route path="dutyDoctor" element={<DutyDoctor />} />
            <Route path="lab" element={<Lab />} />
            <Route path="material" element={<Material />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

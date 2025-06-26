// App.jsx (unchanged)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dash from "./pages/Dash";
import PatientList from "./pages/PatientList";
import Appointment from "./pages/Appointment";
import Report from "./pages/Report";
// import Sms from "./pages/Sms";
import Finance from "./pages/Finance";

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
import Company from "./pages/company"
import PaymentMethod from "./pages/Method";
import 'aos/dist/aos.css';
import Aos from "aos";
import { useEffect } from "react";
import DutyDoctor from "./pages/DutyDoctor";
import Lab from "./pages/Lab";
import Material from "./pages/Material";



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
            {/* <Route path="sms" element={<Sms />} /> */}
            <Route path="finance" element={<Finance />} />
           
            <Route path="department" element={<Department />} />
            <Route path="student" element={<Student />} />
            <Route path="payment/patient" element={<Payment />} />
            <Route path="payment/student" element={<PaymentStudent />} />
            <Route path="appoint/student" element={<AppointmentStudent />} />
            
            <Route path="company" element={<Company />}/>
            <Route path="doctor" element={<Doctor />}/>
            <Route path="school" element={<SchoolManagement/>}/>
            <Route path="province" element={<Provinces />}/>
            <Route path="treat" element={<Treat />} />
            <Route path="user" element={<UserManagement />}/>

            <Route path='dutyDoctor' element={<DutyDoctor/>}/>
            <Route path='lab' element={<Lab/>}/>
            <Route path='material' element={<Material/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
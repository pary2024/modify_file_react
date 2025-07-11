import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Layouts/Sidebar";
import PatientList from "./Pages/PatientList";
import Appointment from "./Pages/Appointment";
import Report from "./Pages/Report";
import Doctor from "./Pages/Doctor";
import Login from "./Auth/Login";
import Payment from "./Pages/Payment";
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
import EditeDuty from "./Pages/Update/UpdateDuty";
import PaymentEdit from "./Pages/Update/UpdateInvoice";
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

            <Route path="payment/patient" element={<Payment />} />
           

            <Route path="company" element={<Company />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="province" element={<Provinces />} />
            <Route path="treat" element={<Treat />} />
            <Route path="user" element={<UserManagement />} />

            <Route path="dutyDoctor" element={<DutyDoctor />} />
            <Route path="lab" element={<Lab />} />
            <Route path="material" element={<Material />} />
            <Route path="edite/duty/:id" element={<EditeDuty/>}/>
            <Route path="edite/invoice/:id" element={<PaymentEdit/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

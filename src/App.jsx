import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Layouts/Sidebar";
import PatientList from "./pages/PatientList";
import Appointment from "./pages/Appointment";
import Report from "./pages/Report";
import Doctor from "./pages/Doctor";
import Login from "./Auth/Login";
import Payment from "./pages/Payment";
import UserManagement from "./pages/UserManagement";
import Company from "./pages/Company";
import Provinces from "./pages/Provnces";
import Treat from "./pages/Treat";
import PaymentMethod from "./pages/Method";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect } from "react";
import DutyDoctor from "./pages/DutyDoctor";
import Lab from "./pages/Lab";
import Material from "./pages/Material";
import PrivateRoute from "./Routes/PrivateRouter";
import Dash from "./pages/Dash";
import EditeDuty from "./pages/Update/UpdateDuty";
import PaymentEdit from "./pages/Update/UpdateInvoice";
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

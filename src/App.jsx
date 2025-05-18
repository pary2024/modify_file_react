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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Layout Route */}
        <Route  path="/admin" element={<Sidebar />}>
          <Route index element={<Dash />} />
          <Route path="dash" element={<Dash />} />
          <Route path="list" element={<PatientList />} />
          <Route path="appoint" element={<Appointment />} />
          <Route path="report" element={<Report />} />
          <Route path="sms" element={<Sms />} />
          <Route path="finance" element={<Finance />} />
          <Route path="human" element={<HumanResources />} />
          <Route path="doctor" element={<Doctor/>} />
          <Route path="department" element={<Department />} />
          <Route path="student" element={<Student/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

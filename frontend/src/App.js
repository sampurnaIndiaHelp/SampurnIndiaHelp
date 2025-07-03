// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // // Pages
// // import Home from "./pages/Home";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Dashboard from "./pages/Dashboard";
// // import AdminPanel from "./pages/AdminPanel";

// // // Optional: NotFound fallback (create NotFound.jsx)
// // import NotFound from "./pages/NotFound"; // Create a simple 404 component

// // function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/register" element={<Register />} />
// //         <Route path="/dashboard" element={<Dashboard />} />
// //         <Route path="/admin" element={<AdminPanel />} />
// //         <Route path="*" element={<NotFound />} /> {/* fallback for unknown routes */}
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;



// // new updated 


// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register        from "./pages/Register";
// import Login           from "./pages/Login";
// import Dashboard       from "./pages/Dashboard";
// // import PaymentUpload   from "./components/PaymentUpload";
// // import PaymentApproval from "./components/PaymentApproval";
// import NotFound        from "./pages/NotFound";
// import AdminPanel from "./pages/AdminPanel"
// import Home from "./pages/Home"

// import DirectJoining from "./pages/DirectJoining";

// import AdminCompanyJoins from "./pages/AdminCompanyJoins";

// import AdminCompanyJoiners from "./pages/AdminCompanyJoiners";

// import SponsorApproval from "./pages/SponsorApproval";

// import 

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/"          element={<Home />} />
//         <Route path="/login"     element={<Login />} />
//         <Route path="/register"  element={<Register />} />
//         {/* <Route path="/upload-payment" element={<PaymentUpload />} /> */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         {/* <Route path="/approvals" element={<PaymentApproval />} /> */}
//         <Route path="*"          element={<NotFound />} />
//  <Route path="/admin" element={<AdminPanel/>} />

 
// <Route path="/direct-joining" element={<DirectJoining />} />

// <Route path="/admin/company-directs" element={<AdminCompanyJoins />} />

// <Route path="/admin/company-joiners" element={<AdminCompanyJoiners />} />

// <Route path="/sponsor-approval" element={<SponsorApproval />} />



        
//       </Routes>
//     </BrowserRouter>
//   );
// }





import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

// Additional Functional Pages
import DirectJoining from "./pages/DirectJoining";
import AdminCompanyJoins from "./pages/AdminCompanyJoins";
import AdminCompanyJoiners from "./pages/AdminCompanyJoiners";
import SponsorApproval from "./pages/SponsorApproval";
import UploadPayment from "./pages/UploadPayment"; // Include payment upload page if needed

import CompanyAdminDashboard from "./pages/CompanyAdminDashboard";
import Contact from "./pages/Contact";

import GlobalDashboard from "./pages/GlobalDashboard";
import Footer from "./components/Footer";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
         <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Payment System */}
        <Route path="/upload-payment" element={<UploadPayment />} />
        <Route path="/sponsor-approval" element={<SponsorApproval />} />

        {/* Team and Admin Viewers */}
        <Route path="/direct-joining" element={<DirectJoining />} />
        <Route path="/admin/company-directs" element={<AdminCompanyJoins />} />
        <Route path="/admin/company-joiners" element={<AdminCompanyJoiners />} />

          <Route path="/company-admin" element={<CompanyAdminDashboard />} />
     {/* now globle  */}


     <Route path="/global-dashboard" element={<GlobalDashboard />} />
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

       
      </Routes>
           <Footer />
    </BrowserRouter>
  );
}

// render.js
// In your render.js or main JavaScript file
window.selectRole = function(role) {
    if (role === 'patient') {
        localStorage.setItem('userRole', 'patient');
        window.location.href = '/pages/patientDashboard.html';
    } else if (role === 'admin') {
        // Check if admin is already logged in
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        if (token && userRole === 'admin') {
            window.location.href = `/adminDashboard/${encodeURIComponent(token)}`;
        } else {
            window.openAppModal('adminLogin');
        }
    } else if (role === 'doctor') {
        // Check if doctor is already logged in
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        if (token && userRole === 'doctor') {
            window.location.href = `/doctorDashboard/${encodeURIComponent(token)}`;
        } else {
            window.openAppModal('doctorLogin');
        }
    } else if (role === 'loggedPatient') {
        window.location.href = '/pages/loggedPatientDashboard.html';
    }
};


function renderContent() {
  const role = getRole();
  if (!role || (role === 'loggedPatient' && !localStorage.getItem('token'))) {
    window.location.href = "/"; // if no role, send to role selection page
    return;
  }
}

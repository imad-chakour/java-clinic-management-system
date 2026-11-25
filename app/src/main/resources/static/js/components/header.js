/**
 * Header Component for Clinic Management System
 * Dynamically renders header based on user role and login state
 */

// Main function to render the header based on user role and current page
function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // Clear session data on homepage
    if (window.location.pathname.endsWith("/") || window.location.pathname.includes("index.html")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-section">
                    <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>`;
        return;
    }

    // Get user role and token
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // Handle invalid sessions
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    // Start building header content
    let headerContent = `
        <header class="header">
            <div class="logo-section">
                <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav class="nav-section">`;

    // Add role-specific content
    if (role === "admin") {
        headerContent += `
                <a href="#" class="nav-link" onclick="logout()">Logout</a>`;
    } else if (role === "doctor") {
        headerContent += `
                <button class="adminBtn" onclick="goToDashboard('doctor')">Home</button>
                <a href="#" class="nav-link" onclick="logout()">Logout</a>`;
    } else if (role === "patient") {
        headerContent += `
                <button id="patientLogin" class="adminBtn">Login</button>
                <button id="patientSignup" class="adminBtn">Sign Up</button>`;
    } else if (role === "loggedPatient") {
        headerContent += `
                <button id="home" class="adminBtn" onclick="goToDashboard('patient')">Home</button>
                <button id="patientAppointments" class="adminBtn" onclick="viewAppointments()">Appointments</button>
                <a href="#" class="nav-link" onclick="logoutPatient()">Logout</a>`;
    } else {
        // Default header for non-authenticated users on other pages
        headerContent += `
                <button class="adminBtn" onclick="goToHome()">Home</button>
                <button id="roleSelect" class="adminBtn" onclick="goToHome()">Select Role</button>`;
    }

    // Close header structure
    headerContent += `
            </nav>
        </header>`;

    // Inject header content
    headerDiv.innerHTML = headerContent;

    // Attach event listeners to dynamically created buttons
    attachHeaderButtonListeners();
}

// Attach event listeners to header buttons
function attachHeaderButtonListeners() {
    // Home button for patient
    const homeBtn = document.getElementById("home");
    if (homeBtn) {
        homeBtn.addEventListener("click", function() {
            window.location.href = '/pages/patientDashboard.html';
        });
    }

    // Appointments button for patient
    const appointmentsBtn = document.getElementById("patientAppointments");
    if (appointmentsBtn) {
        appointmentsBtn.addEventListener("click", function() {
            window.location.href = '/pages/patientAppointments.html';
        });
    }
}

// Logout function for admin and doctor
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
}

// Logout function for patient (keeps patient role)
function logoutPatient() {
    localStorage.removeItem("token");
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
}

// Navigate to dashboard based on role
function goToDashboard(role) {
    if (role === 'doctor') {
        window.location.href = '/doctor/doctorDashboard.html';
    } else if (role === 'patient') {
        window.location.href = '/pages/patientDashboard.html';
    } else if (role === 'admin') {
        window.location.href = '/admin/adminDashboard.html';
    }
}

// Go to home page
function goToHome() {
    window.location.href = "/";
}

// View appointments for patient
function viewAppointments() {
    if (localStorage.getItem("userRole") === "loggedPatient") {
        window.location.href = '/pages/patientAppointments.html';
    } else {
        alert("Please log in to view appointments.");
        openModal('patientLogin');
    }
}

function openModal(modalType) {
    if (typeof window.openAppModal === 'function') {
        window.openAppModal(modalType);
    } else {
        console.error('Modal service is not available.');
    }
}

// Close modal when clicking on X
document.addEventListener('DOMContentLoaded', function() {
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const modal = document.getElementById('modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderHeader();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderHeader, logout, logoutPatient };
}
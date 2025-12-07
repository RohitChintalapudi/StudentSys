function showPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.textContent = message;

  document.body.appendChild(popup);
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
    popup.remove();
  }, 3000);
}

function redirect(role) {
  // Determine correct path based on current location
  const currentPath = window.location.pathname;
  let basePath = "";
  
  if (currentPath.includes("/student/") || currentPath.includes("/staff/")) {
    basePath = "../";
  } else {
    basePath = "./";
  }
  
  if (role === "student") {
    window.location.href = `${basePath}student/dashboard.html`;
  } else {
    window.location.href = `${basePath}staff/dashboard.html`;
  }
}
// existing showPopup, redirect etc.

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  showPopup("Logged out", "success");
  
  // Determine correct path based on current location
  const currentPath = window.location.pathname;
  let loginPath = "";
  
  if (currentPath.includes("/student/") || currentPath.includes("/staff/")) {
    loginPath = "../login.html";
  } else {
    loginPath = "./login.html";
  }
  
  setTimeout(() => {
    window.location.href = loginPath;
  }, 700);
}

// called on pages to enforce login
function requireAuth(allowedRoles = []) {
  const token = getToken();
  const role = getRole();
  
  // Determine correct path based on current location
  const currentPath = window.location.pathname;
  let loginPath = "";
  
  if (currentPath.includes("/student/") || currentPath.includes("/staff/")) {
    loginPath = "../login.html";
  } else {
    loginPath = "./login.html";
  }
  
  if (!token) {
    window.location.href = loginPath;
    return false;
  }
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    showPopup("Access denied", "error");
    setTimeout(() => {
      window.location.href = loginPath;
    }, 800);
    return false;
  }
  return true;
}

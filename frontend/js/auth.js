// LOGIN
async function loginUser(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!username || !password) {
    showPopup("All fields required", "error");
    return;
  }

  try {
    const result = await apiCall("/auth/login", "POST", { username, password });

    if (result && result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      showPopup("Login Successful!", "success");
      setTimeout(() => redirect(result.role), 1000);
    } else {
      showPopup(result?.message || "Login Failed! Please check your credentials.", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.isNetworkError || error.message.includes("Cannot connect to server")) {
      showPopup("Cannot connect to server. Please make sure the backend server is running on http://localhost:5000", "error");
    } else {
      showPopup(error.message || "Login failed. Please check your credentials and try again.", "error");
    }
  }
}

// REGISTER
async function registerUser(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const role = document.querySelector("#role").value;

  if (!username || !password) {
    showPopup("All fields required", "error");
    return;
  }

  if (!role) {
    showPopup("Please select a role", "error");
    return;
  }

  try {
    const result = await apiCall("/auth/register", "POST", {
      username,
      password,
      role,
    });

    if (result && result.message === "Registered") {
      showPopup("Registered Successfully!", "success");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      showPopup(result?.message || "Registration failed. Please try again.", "error");
    }
  } catch (error) {
    console.error("Register error:", error);
    if (error.isNetworkError || error.message.includes("Cannot connect to server")) {
      showPopup("Cannot connect to server. Please make sure the backend server is running on http://localhost:5000", "error");
    } else {
      showPopup(error.message || "Registration failed. Please try again.", "error");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});

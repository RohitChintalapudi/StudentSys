const BASE_URL = "http://localhost:5000";

async function apiCall(url, method, data = null, auth = false) {
  try {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup("Please login first", "error");
        
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
        }, 1000);
        throw new Error("No token found");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(BASE_URL + url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Server error (${response.status})` };
      }
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Call Error:", error);
    
    // Handle "Failed to fetch" / Network errors
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
      const errorMsg = new Error("Cannot connect to server. Please make sure the backend server is running on http://localhost:5000");
      errorMsg.isNetworkError = true;
      throw errorMsg;
    }
    
    // Only handle auth errors for authenticated routes
    if (auth && (error.message.includes("401") || error.message.includes("Invalid Token") || error.message.includes("Access Denied"))) {
      showPopup("Session expired. Please login again", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      
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
      }, 1500);
    }
    
    // Re-throw error so calling functions can handle it
    throw error;
  }
}

async function loadNavbar() {
  // Wait for body to exist
  if (!document.body) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadNavbar);
    } else {
      setTimeout(loadNavbar, 10);
    }
    return;
  }

  // Check if navbar already exists
  if (document.getElementById("mainNav")) {
    return; // Navbar already loaded
  }

  try {
    // Determine base path based on current location
    const currentPath = window.location.pathname;
    let basePath = "";
    
    if (currentPath.includes("/student/") || currentPath.includes("/staff/")) {
      basePath = "../";
    } else {
      basePath = "./";
    }

    // Create navbar inline (more reliable than fetching)
    const navbarHTML = `
      <nav id="mainNav" class="nav">
        <div class="nav-left">
          <a href="${basePath}index.html" class="brand">StudentSys</a>
        </div>
        <div class="nav-center" id="navCenter">
          <!-- role-specific links filled by JS -->
        </div>
        <div class="nav-right">
          <span id="navUser"></span>
          <button id="logoutBtn" class="btn-small">Logout</button>
        </div>
      </nav>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = navbarHTML;
    document.body.prepend(wrapper);

    // populate center links by role
    const role = getRole();
    const navCenter = document.getElementById("navCenter");
    if (navCenter) {
      // Get current page to mark active link
      const currentPath = window.location.pathname;
      
      if (role === "student") {
        const links = [
          { href: `${basePath}student/dashboard.html`, text: "Dashboard", path: "dashboard.html" },
          { href: `${basePath}student/enroll.html`, text: "Enroll", path: "enroll.html" },
          { href: `${basePath}student/marks.html`, text: "Marks", path: "marks.html" },
          { href: `${basePath}student/attendance.html`, text: "Attendance", path: "attendance.html" },
          { href: `${basePath}student/gpaCalculator.html`, text: "GPA Calculator", path: "gpaCalculator.html" },
          { href: `${basePath}student/notices.html`, text: "Notices", path: "notices.html" }
        ];
        
        navCenter.innerHTML = links.map(link => {
          const isActive = currentPath.includes(link.path) ? 'active' : '';
          return `<a href="${link.href}" class="${isActive}">${link.text}</a>`;
        }).join('');
      } else if (role === "staff") {
        const links = [
          { href: `${basePath}staff/dashboard.html`, text: "Dashboard", path: "dashboard.html" },
          { href: `${basePath}staff/addCourse.html`, text: "Courses", path: "addCourse.html" },
          { href: `${basePath}staff/students.html`, text: "Students", path: "students.html" },
          { href: `${basePath}staff/attendance.html`, text: "Attendance", path: "attendance.html" },
          { href: `${basePath}staff/notices.html`, text: "Notices", path: "notices.html" }
        ];
        
        navCenter.innerHTML = links.map(link => {
          const isActive = currentPath.includes(link.path) ? 'active' : '';
          return `<a href="${link.href}" class="${isActive}">${link.text}</a>`;
        }).join('');
      } else {
        navCenter.innerHTML = `<a href="${basePath}login.html">Login</a>`;
      }
    }

    // show username spot
    const navUser = document.getElementById("navUser");
    if (navUser) {
      navUser.textContent = role ? role.toUpperCase() : "";
      navUser.style.marginRight = "12px";
      navUser.style.fontSize = "13px";
      navUser.style.color = "var(--text-light)";
      navUser.style.fontWeight = "500";
    }

    // bind logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
      // Hide logout button if not logged in
      if (!role) {
        logoutBtn.style.display = "none";
      }
    }
  } catch (err) {
    console.error("Navbar load failed", err);
    // Fallback: create a basic navbar even if everything fails
    if (document.body && !document.getElementById("mainNav")) {
      const fallbackNav = document.createElement("nav");
      fallbackNav.id = "mainNav";
      fallbackNav.className = "nav";
      fallbackNav.innerHTML = `
        <div class="nav-left">
          <a href="./index.html" class="brand">StudentSys</a>
        </div>
        <div class="nav-center">
          <a href="./login.html">Login</a>
        </div>
        <div class="nav-right"></div>
      `;
      document.body.prepend(fallbackNav);
    }
  }
}

// Auto-load navbar when script loads (if DOM is ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  // DOM already ready, but wait a tick to ensure body exists
  setTimeout(loadNavbar, 0);
}

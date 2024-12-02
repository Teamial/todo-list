// app.js

// Include js-sha256 in index.html
// <script src="https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/build/sha256.min.js"></script>

// ... existing code ...

// Handle registration with hashing
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const password = document.getElementById("register-password").value;

    if (username === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("User with this email already exists.");
        return;
    }

    // Hash the password
    const hashedPassword = sha256(password);

    // Save new user
    users.push({ username, email, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    registerForm.reset();
    registerModal.style.display = "none";
});

// Handle login with hashing
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    if (email === "" || password === "") {
        alert("Please enter both email and password.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const hashedPassword = sha256(password);
    const user = users.find(user => user.email === email && user.password === hashedPassword);

    if (user) {
        // Set session
        if (rememberMe) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
        } else {
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        }
        // Redirect to todo app
        window.location.href = "/todo_app/todo.html";
    } else {
        alert("Invalid email or password.");
    }
});

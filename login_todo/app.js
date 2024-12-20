// app.js

// Determine the current page
const currentPage = window.location.pathname;

// Handle Registration
if (currentPage.includes("register.html")) {
    handleRegistration();
} else if (currentPage.includes("index.html") || currentPage === "/") {
    handleLogin();
}

// Function to handle user registration
function handleRegistration() {
    const registerForm = document.getElementById("register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value.trim();
        const email = document.getElementById("register-email").value.trim().toLowerCase();
        const password = document.getElementById("register-password").value;

        if (!validateRegistrationInput(username, email, password)) return;

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(user => user.email === email)) {
            swal("Error", "User with this email already exists.", "error");
            return;
        }

        try {
            // Hash the password
            const hashedPassword = sha256(password);
            
            // Save new user
            const newUser = { username, email, password: hashedPassword };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            
            // Show success message and redirect
            await swal("Success", "Registration successful! You can now log in.", "success");
            window.location.href = "/index.html";
        } catch (error) {
            swal("Error", "An error occurred during registration.", "error");
            console.error("Registration error:", error);
        }
    });
}

// Function to handle user login
function handleLogin() {
    const loginForm = document.getElementById("login-form");
    const forgotPassword = document.getElementById("forgot-password");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("remember-me").checked;

        if (!validateLoginInput(email, password)) return;

        try {
            // Load users and check credentials
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const hashedPassword = sha256(password);
            const user = users.find(user => user.email === email && user.password === hashedPassword);

            if (user) {
                // Store user session
                const sessionData = JSON.stringify({
                    email: user.email,
                    username: user.username,
                    loginTime: new Date().toISOString()
                });

                if (rememberMe) {
                    localStorage.setItem("loggedInUser", sessionData);
                } else {
                    sessionStorage.setItem("loggedInUser", sessionData);
                }

                // Show success message and redirect
                await swal("Success", "Login successful!", "success");
                window.location.href = "/todo_app/todo.html";
            } else {
                swal("Error", "Invalid email or password.", "error");
            }
        } catch (error) {
            swal("Error", "An error occurred during login.", "error");
            console.error("Login error:", error);
        }
    });

    // Handle Forgot Password
    if (forgotPassword) {
        forgotPassword.addEventListener("click", async (e) => {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}

// Validation functions
function validateRegistrationInput(username, email, password) {
    if (!username || !email || !password) {
        swal("Error", "Please fill in all fields.", "error");
        return false;
    }
    if (!isValidEmail(email)) {
        swal("Error", "Please enter a valid email address.", "error");
        return false;
    }
    if (password.length < 6) {
        swal("Error", "Password must be at least 6 characters long.", "error");
        return false;
    }
    return true;
}

function validateLoginInput(email, password) {
    if (!email || !password) {
        swal("Error", "Please enter both email and password.", "error");
        return false;
    }
    if (!isValidEmail(email)) {
        swal("Error", "Please enter a valid email address.", "error");
        return false;
    }
    return true;
}

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Handle forgot password functionality
async function handleForgotPassword() {
    const { value: email } = await swal({
        title: "Forgot Password",
        text: "Please enter your registered email:",
        content: {
            element: "input",
            attributes: {
                placeholder: "Enter your email",
                type: "email"
            }
        },
        buttons: true
    });

    if (email) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email.trim().toLowerCase());

        if (user) {
            const { value: newPassword } = await swal({
                title: "Reset Password",
                text: "Enter your new password:",
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Enter new password",
                        type: "password"
                    }
                },
                buttons: true
            });

            if (newPassword) {
                if (newPassword.length < 6) {
                    swal("Error", "Password must be at least 6 characters long.", "error");
                    return;
                }

                user.password = sha256(newPassword);
                localStorage.setItem("users", JSON.stringify(users));
                await swal("Success", "Password reset successful! You can now log in with your new password.", "success");
            }
        } else {
            swal("Error", "No user found with this email.", "error");
        }
    }
}

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Check if user is already logged in on page load
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser");
    if (loggedInUser && (currentPage.includes("index.html") || currentPage === "/")) {
        window.location.href = "/todo_app/todo.html";
    }
});

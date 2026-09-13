const getById = (id) => {
    return document.getElementById(id)
};
const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("button");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
loader.style.display = "block";
container.style.display = "none";

const showerror = (text) => {
    error.style.display = "block";
    error.innerText = text;
    success.style.display = "none";
}
const showsuccess = (text) => {
    error.style.display = "none";
    success.innerText = text;
    success.style.display = "block";
}

let token, userId;

window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, props) => {
            return searchParams.get(props)
        }
    });
    token = params.token;
    userId = params.userId;

    try {
        const res = await fetch("/auth/verify-pass-reset-token", {
            method: 'post',
            headers: {
                "Content-Type": "application/json" // Fixed: removed semicolon
            },
            body: JSON.stringify({ token, userId })
        });
        
        if (!res.ok) {
            const data = await res.json();
            loader.innerText = data.error || "Invalid or expired token";
            return;
        }
        loader.style.display = "none";
        container.style.display = "block";
    } catch (err) {
        loader.innerText = "Failed to connect to the server.";
    }
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const handler = async (evnt) => {
    evnt.preventDefault(); // Fixed: Typo corrected

    // Fixed: Added ! to check for falsy values and added 'return' to stop execution
    if (!password.value.trim()) {
        return showerror("Password is empty :)");
    }
    if (!confirmPassword.value.trim()) {
        return showerror("Confirm Password is empty :)");
    }
    // Fixed: Added ! so it errors if it DOES NOT match the regex
    if (!passwordRegex.test(password.value)) {
        return showerror("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).");
    }
    if (password.value !== confirmPassword.value) {
        return showerror("Passwords do not match.");
    }

    // Fixed: Log the value, not the DOM element
    console.log(token, userId, password.value); 

    try {
        // Fixed: Added leading slash for consistent absolute routing
        const res = await fetch("/auth/update-password", { 
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            // Fixed: Sent password.value instead of the DOM element
            body: JSON.stringify({ token, userId, password: password.value }) 
        });

        if (!res.ok) {
            const data = await res.json();
            return showerror(data.error || "Failed to update password");
        }

        showsuccess("Your password has been updated!");
        password.value = "";
        confirmPassword.value = "";
    } catch (err) {
        showerror("A network error occurred. Please try again.");
    }
}

form.addEventListener("submit", handler);
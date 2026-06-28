async function signUp() {
    const fullName = document.getElementById("signup-name").value.trim();
    const city = document.getElementById("signup-city").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    
    // Default fallback to citizen if the role selection element is missing in standard UI
    const roleSelect = document.getElementById("signup-role");
    const role = roleSelect ? roleSelect.value : "Citizen";

    if (!fullName || !city || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    // Create Auth User
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    console.log("Signup Success:", data);

    if (!data.user) {
        alert("Please verify your email first.");
        return;
    }

    // Save Profile with custom roles
    const { error: profileError } = await supabaseClient
        .from("profiles")
        .upsert({
            id: data.user.id,
            full_name: fullName,
            city: city,
            role: role
        });

    if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        return;
    }

    alert("Account Created Successfully!");
    window.location.href = "login.html";
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
}

async function logout() {
    await supabaseClient.auth.signOut();
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
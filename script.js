async function loadProfile() {
    try {
        // 1. Read string following "?user=" parameter query
        const urlParams = new URLSearchParams(window.location.search);
        let username = urlParams.get('user');

        // Fallback default profile if empty parameter
        if (!username) {
            username = 'andrew';
        }

        // 2. Fetch data storage file
        const response = await fetch('profiles.json');
        if (!response.ok) {
            throw new Error(`Could not access 'profiles.json'. Server Status: ${response.status}`);
        }
        const data = await response.json();

        // 3. Extract requested object model 
        const profile = data[username.toLowerCase()];

        if (profile) {
            // 4. Safely inject contents into matching tags
            document.getElementById('user-name').innerText = profile.name || "Healthy Home Representative";
            document.getElementById('user-title').innerText = profile.title || "Specialist";
            
            // Communication hooks assignment
            document.getElementById('link-email').href = `mailto:${profile.email}`;
            document.getElementById('txt-email').innerText = profile.email || "";

            document.getElementById('link-phone-mobile').href = `tel:${profile.phone}`;
            document.getElementById('txt-phone-mobile').innerText = profile.phone || "";

            // Bind the custom vCard text configuration down link block
            if (profile.vcard) {
                document.getElementById('btn-vcard').href = profile.vcard;
                document.getElementById('btn-vcard').style.display = 'flex';
            } else {
                document.getElementById('btn-vcard').style.display = 'none';
            }

            // Sync User Portrait Headshot File or pull fallback on-error
            const pfpElement = document.getElementById('user-pfp');
            if (pfpElement) {
                pfpElement.src = `assets/profiles/${username.toLowerCase()}.png`;
                pfpElement.onerror = function() {
                    this.src = "https://via.placeholder.com/300?text=Healthy+Home+Team"; 
                };
            }

        } else {
            // Error handling if targeted path is invalid
            document.getElementById('user-name').innerText = "Profile Registration Missing";
            document.getElementById('user-title').innerText = `No user data available matching key: "${username}"`;
            document.getElementById('btn-vcard').style.display = 'none';
        }

    } catch (error) {
        console.error("Critical Exception Encountered:", error);
        document.body.innerHTML = `
            <div style="color:#ba1a1a; padding:40px; text-align:center; font-family:sans-serif;">
                <h2>Configuration Alert</h2>
                <p>${error.message}</p>
                <p>Verify that your <b>profiles.json</b> dataset file is committed to your primary root repository directory folder.</p>
            </div>`;
    }
}

window.onload = loadProfile;

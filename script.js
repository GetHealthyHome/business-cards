async function loadProfile() {
    try {
        // 1. Look at the URL and find the value after "?user="
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('user');

        // If no user is specified in the URL, default to 'andrew' for testing
        if (!username) {
            window.location.search = '?user=andrew';
            return;
        }

        // 2. Grab the profiles.json database file
        const response = await fetch('profiles.json');
        const data = await response.json();

        // 3. Find the specific individual's data packet
        const profile = data[username.toLowerCase()];

        if (profile) {
            // 4. Update the HTML elements with our data strings
            
            // a. Update Profile Picture
            document.getElementById('user-pfp').src = `assets/profiles/${username}.jpg`;
            document.getElementById('user-pfp').alt = `${profile.name}'s Profile Picture`;

            // b. Update Name and Title
            document.getElementById('user-name').innerText = profile.name;
            document.getElementById('user-title').innerText = profile.title;
            
            // c. Update Contact details and links
            document.getElementById('link-email').href = `mailto:${profile.email}`;
            document.getElementById('txt-email').innerText = profile.email;

            // Update Phone Local (if available) - assuming this info is provided for real data
            if (profile.phoneLocal) {
                document.getElementById('link-phone-local').href = `tel:${profile.phoneLocal}`;
                document.getElementById('txt-phone-local').innerText = profile.phoneLocal;
            } else {
                // Hide if not provided
                document.getElementById('link-phone-local').style.display = 'none';
            }

            // Update Phone Mobile
            document.getElementById('link-phone-mobile').href = `tel:${profile.phone}`;
            document.getElementById('txt-phone-mobile').innerText = profile.phone;

            // Update Website
            document.getElementById('link-website').href = `https://${profile.website || 'gethealthyhome.com'}`;
            document.getElementById('txt-website').innerText = profile.website || 'www.gethealthyhome.com';

            // d. Update the .vcf download button link
            if (profile.vcard) {
                document.getElementById('btn-vcard').href = profile.vcard;
            } else {
                // Disable button if vcard is missing
                document.getElementById('btn-vcard').style.display = 'none';
            }

        } else {
            // Error handling if a link is typed incorrectly
            document.getElementById('user-name').innerText = "Profile Not Found";
            document.getElementById('user-title').innerText = "Please check the link configuration.";
            // Hide normal content on error
            document.querySelector('.contact-details').style.display = 'none';
            document.getElementById('btn-vcard').style.display = 'none';
        }
    } catch (error) {
        console.error("Error pulling database profile elements:", error);
    }
}

// Fire off the function immediately when the page loads
window.onload = loadProfile;

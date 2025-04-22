// Function to fetch data for a given phone number
async function fetchPhoneData(phone) {
    const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
    const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

    try {
        // Fetch TCPA Data (e.g., blacklist, DNC)
        const tcpaResponse = await fetch(tcpaApi);
        const tcpaData = await tcpaResponse.json();

        // Fetch Person Data (e.g., name, address, age, DOB)
        const personResponse = await fetch(personApi);
        const personData = await personResponse.json();

        // Display the data
        displayPhoneInfo(phone, tcpaData, personData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to display the fetched phone information
function displayPhoneInfo(phone, tcpaData, personData) {
    const phoneInfo = document.getElementById('phone-info');
    
    // Safely extract data
    const name = personData.person ? personData.person.name || 'Not Available' : 'Not Available';
    const address = personData.person ? personData.person.address || 'Not Available' : 'Not Available';
    const dob = personData.person ? personData.person.dob || 'Not Available' : 'Not Available';
    const age = calculateAge(dob);
    
    const blacklisted = tcpaData.tcpa ? tcpaData.tcpa.blacklisted || 'Not Available' : 'Not Available';
    const dncNational = tcpaData.tcpa ? tcpaData.tcpa.dnc_national ? 'Yes' : 'No' : 'Not Available';
    const dncState = tcpaData.tcpa ? tcpaData.tcpa.dnc_state ? 'Yes' : 'No' : 'Not Available';
    const litigator = tcpaData.tcpa ? tcpaData.tcpa.litigator || 'Not Available' : 'Not Available';

    // Output the data
    phoneInfo.innerHTML = `
        <p><strong>📞 Phone:</strong> ${phone}</p>
        <p><strong>🧍 Name:</strong> ${name}</p>
        <p><strong>📍 Address:</strong> ${address}</p>
        <p><strong>🎂 Age:</strong> ${age} | <strong>DOB:</strong> ${dob}</p>
        <p><strong>📵 Blacklisted:</strong> ${blacklisted}</p>
        <p><strong>🚫 DNC National:</strong> ${dncNational}</p>
        <p><strong>🚫 DNC State:</strong> ${dncState}</p>
        <p><strong>⚖️ Litigator:</strong> ${litigator}</p>
    `;
}

// Function to calculate age from the date of birth
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Example of how to call fetchPhoneData for a given phone number
const phoneNumber = '8012403572';  // Replace with the phone number you want to check
fetchPhoneData(phoneNumber);

const API_1 = "https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=";
const API_2 = "https://person.api.uspeoplesearch.net/person/v3?x=";

function lookupNumber() {
    const phone = document.getElementById("phoneInput").value;
    if (!phone) return alert("Enter a valid number.");

    const resultBox = document.getElementById("result");
    resultBox.innerText = "Loading...";

    fetch(API_1 + phone)
        .then(res => res.json())
        .then(tcpaData => {
            fetch(API_2 + phone)
                .then(res => res.json())
                .then(personData => {
                    const p = (personData && personData.person && personData.person.length > 0) ? personData.person[0] : {};

                    const data = `
📞 Phone: ${phone}
🧍 Name: ${p.first_name || 'Not Available'} ${p.last_name || ''}
📍 Address: ${p.address || 'Not Available'}, ${p.city || ''}, ${p.state || ''} ${p.zip || ''}
🎂 Age: ${p.age || 'Not Available'} | DOB: ${p.dob || 'Not Available'}
📵 Blacklisted: ${tcpaData?.blacklisted ?? 'Not Available'}
🚫 DNC National: ${tcpaData?.dnc_national ?? 'Not Available'}
🚫 DNC State: ${tcpaData?.dnc_state ?? 'Not Available'}
⚖️ Litigator: ${tcpaData?.litigator ?? 'Not Available'}
`;

                    resultBox.innerHTML = data;
                })
                .catch(error => resultBox.innerText = "Error fetching personal details.");
        })
        .catch(error => resultBox.innerText = "Error fetching TCPA data.");
}

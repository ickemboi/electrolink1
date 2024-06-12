// Mock data for featured electricians
const electricians = [
    { id: 1, name: 'John Doe', qualifications: 'Certified Electrician', rating: 4.5, image: 'images/john_doe.jpg' },
    { id: 2, name: 'Jane Smith', qualifications: 'Licensed Electrician', rating: 4.7, image: 'images/jane_smith.jpg' },
    { id: 3, name: 'Mike Johnson', qualifications: 'Master Electrician', rating: 4.9, image: 'images/mike_johnson.jpg' }
];

// Function to fetch electricians from the backend
function fetchElectricians() {
    fetch('http://localhost:3000/electricians') // Assuming the backend is running on localhost:3000
    .then(response => response.json())
    .then(data => displayElectricians(data))
    .catch(error => console.error('Error fetching electricians:', error));
}

// Function to display electricians
function displayElectricians(electricians) {
    const electricianList = document.getElementById('electrician-list');
    electricians.forEach(electrician => {
        const card = document.createElement('div');
        card.className = 'electrician-card';
        card.innerHTML = `
            <h3>${electrician.name}</h3>
            <p>${electrician.qualifications}</p>
            <p>Rating: ${electrician.rating}</p>
        `;
        electricianList.appendChild(card);
    });
}

// Function to search for electricians
function searchElectricians() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredElectricians = electricians.filter(electrician =>
        electrician.name.toLowerCase().includes(query) ||
        electrician.qualifications.toLowerCase().includes(query)
    );
    const electricianList = document.getElementById('electrician-list');
    electricianList.innerHTML = '';
    filteredElectricians.forEach(electrician => {
        const card = document.createElement('div');
        card.className = 'electrician-card';
        card.innerHTML = `
            <h3>${electrician.name}</h3>
            <p>${electrician.qualifications}</p>
            <p>Rating: ${electrician.rating}</p>
        `;
        electricianList.appendChild(card);
    });
}

// Load featured electricians on page load
window.onload = fetchElectricians;


// Function to register an electrician
function registerElectrician(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const name = document.getElementById('electrician-name').value;
    const email = document.getElementById('electrician-email').value;
    const qualifications = document.getElementById('electrician-qualifications').value;
    const password = document.getElementById('electrician-password').value;
    
    fetch('http://localhost:3000/register/electrician', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, qualifications, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        // Reset form fields and show success message
        document.getElementById('electrician-registration-form').reset();
        alert('Electrician registered successfully!');
    })
    .catch(error => {
        console.error('There was an error!', error);
        // Display error message to the user
        alert('Error registering electrician. Please try again later.');
    });
}

// Function to register a customer
function registerCustomer(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const password = document.getElementById('customer-password').value;
    
    fetch('http://localhost:3000/register/customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        // Reset form fields and show success message
        document.getElementById('customer-registration-form').reset();
        alert('Customer registered successfully!');
    })
    .catch(error => {
        console.error('There was an error!', error);
        // Display error message to the user
        alert('Error registering customer. Please try again later.');
    });
}

// Add event listeners to the registration forms
document.getElementById('electrician-registration-form').addEventListener('submit', registerElectrician);
document.getElementById('customer-registration-form').addEventListener('submit', registerCustomer);



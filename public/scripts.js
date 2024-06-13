// Function to register an electrician
function registerElectrician(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const name = document.getElementById('electrician-name').value;
    const email = document.getElementById('electrician-email').value;
    const qualifications = document.getElementById('electrician-qualifications').value;
    const password = document.getElementById('electrician-password').value;
    const location=document.getElementById('electrician_location').value;
    const photo= document.getElementById('electrician_photo').value;
    const services_offered=document.getElementById('electrician_services_offered').value;

    fetch('http://localhost:3000/register/electrician', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, qualifications, password, location, services_offered,photo }),
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

// Function to search for electricians
function searchElectricians() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    fetch(`http://localhost:3000/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const electricianList = document.getElementById('electrician-list');
            electricianList.innerHTML = ''; // Clear previous results
            data.forEach(electrician => {
                const card = document.createElement('div');
                card.className = 'electrician-card';
                card.innerHTML = `
                    <h3>${electrician.name}</h3>
                    <p>${electrician.qualifications}</p>
                    <p>Rating: ${electrician.rating}</p>
                `;
                electricianList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('There was an error fetching the search results:', error);
        });
}

// Add event listener to search button
document.getElementById('search-button').addEventListener('click', searchElectricians);

// Mock data for featured electricians
const electricians = [
    { id: 1, name: 'John Doe', qualifications: 'Certified Electrician', rating: 4.5 },
    { id: 2, name: 'Jane Smith', qualifications: 'Licensed Electrician', rating: 4.7 },
    { id: 3, name: 'Mike Johnson', qualifications: 'Master Electrician', rating: 4.9 }
];

// Function to display featured electricians
function displayElectricians() {
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



// Load featured electricians on page load
window.onload = displayElectricians;

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            // Redirect to customer dashboard or perform necessary actions
            window.location.href = 'customer.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
});


 // Fetch customer profile on page load
 window.onload = function () {
    fetchCustomerProfile();
};

function fetchCustomerProfile() {
    fetch('http://localhost:3000/customer/profile', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('customer-name').textContent = data.profile.name;
            document.getElementById('customer-email').textContent = data.profile.email;
        } else {
            console.log(data.message);
            alert('Failed to fetch customer profile. Please login again.');
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching customer profile.');
    });
}
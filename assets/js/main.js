// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Fade-in elements on scroll
const fadeInElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

fadeInElements.forEach(el => observer.observe(el));

// Show Modal and Populate Form
const orderButtons = document.querySelectorAll('.order-now-btn');
const modal = document.getElementById('orderModal');
const closeBtn = document.querySelector('.modal .close');

orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const packs = this.getAttribute('data-packs');
        const price = this.getAttribute('data-price');
        
        document.getElementById('selectedPacks').value = packs;
        document.getElementById('selectedPrice').value = price;
        
        modal.style.display = 'block';
    });
});

// Close Modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Handle Form Submission
document.getElementById('orderForm').addEventListener('/submit-order', function(e) {
    e.preventDefault(); // Prevent page reload

    const formData = new FormData(this);

    fetch('/submit-order', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessConfirmation(data.message, data.price); // Pass the price for display
        } else {
            alert('There was an issue placing your order. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Success Confirmation Popup with Animated Green Check
function showSuccessConfirmation(message, price) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';

    // Create the check mark icon
    const checkIcon = document.createElement('div');
    checkIcon.className = 'check-icon';
    checkIcon.innerHTML = `
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
    `;

    // Create the message
    const successMessage = document.createElement('p');
    successMessage.textContent = `${message} Total amount: ₦${price}`;

    // Append elements to the success modal
    successModal.appendChild(checkIcon);
    successModal.appendChild(successMessage);

    // Add the modal to the body
    document.body.appendChild(successModal);

    // Set timeout to remove the modal after 5 seconds
    setTimeout(() => {
        successModal.remove();
    }, 5000);
}

// Close modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Populate form and show confirmation message on button click
document.querySelectorAll('.order-now-btn').forEach(button => {
    button.addEventListener('click', function() {
        const packs = this.dataset.packs;
        const price = this.dataset.price;
        const confirmationInput = document.getElementById('confirmation');
        confirmationInput.value = `You are ordering ${packs} pack(s) for ₦${price}`;

        // Show the form
        document.getElementById('orderForm').style.display = 'block';
    });
});

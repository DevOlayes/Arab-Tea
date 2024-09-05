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
            showSuccessConfirmation(data.message);
        } else {
            alert('There was an issue placing your order. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
});

function showSuccessConfirmation(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-confirmation';

    // Create the check mark icon
    const checkIcon = document.createElement('span');
    checkIcon.innerHTML = '&#10004;'; // HTML code for a check mark
    checkIcon.className = 'check-icon';

    // Append the check mark and message to the success div
    successDiv.appendChild(checkIcon);
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    successDiv.appendChild(messageSpan);

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Close modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

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

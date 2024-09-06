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
        
        // Also update the confirmation field for user feedback
        const confirmationInput = document.getElementById('confirmation');
        confirmationInput.value = `You are ordering ${packs} pack(s) for ₦${price}`;
        
        modal.style.display = 'block';
    });
});


// Close Modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Handle Form Submission
document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const packs = document.getElementById("selectedPacks").value;
    const price = document.getElementById("selectedPrice").value;
    const name = document.getElementById("name").value;
    const state = document.getElementById("state").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const whatsapp = document.getElementById("whatsapp").value;

    // Data to be sent to the backend
    const formData = {
        packs,
        price,
        name,
        state,
        address,
        email,
        phone,
        whatsapp
    };

    // Send the form data using Fetch API to backend
    fetch('/submit-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            document.getElementById("order-success-message").textContent = "Your order is successful! Total Price: " + price;
            document.getElementById("success-modal").style.display = "block"; // Show success modal

            // Close the order form modal
            document.getElementById("orderModal").style.display = "none";

            // Set timeout to close the success modal after 3 seconds (3000 ms)
            setTimeout(function() {
                document.getElementById("success-modal").style.display = "none";
            }, 3000); // Adjust the delay time as needed (3000 = 3 seconds)
        } else {
            alert("Error submitting your order.");
        }
    })
    .catch(error => console.error("Error:", error));
});

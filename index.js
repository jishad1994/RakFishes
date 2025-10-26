document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle
    const hamburger = document.getElementById("hamburger");
    const navOverlay = document.getElementById("navOverlay");
    const navLinks = document.querySelectorAll(".nav-menu a");

    hamburger.addEventListener("click", () => {
       
        console.log("hamburger clickerd");
        hamburger.classList.toggle("active");
        navOverlay.classList.toggle("active");
        document.body.style.overflow = hamburger.classList.contains("active") ? "hidden" : "";

      
    });

    // Close menu when clicking on a link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    window.addEventListener("scroll", () => {
        const hero = document.querySelector(".hero");
        const text = document.querySelector(".hero-overlay-content");

        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Faster fade-in range (reduced from 250px to 150px)
        const fadeInStart = 100;
        const fadeInEnd = 250;

        // Text fade-in with smoother easing
        if (scrollY > fadeInStart && scrollY < fadeInEnd) {
            const progress = (scrollY - fadeInStart) / (fadeInEnd - fadeInStart);
            // Apply easeOutCubic for smoother animation
            const eased = 1 - Math.pow(1 - progress, 3);
            text.style.opacity = eased;
            text.style.transform = `translateY(${30 - eased * 30}px)`;
        } else if (scrollY >= fadeInEnd) {
            text.style.opacity = 1;
            text.style.transform = "translateY(0)";
            text.classList.add("visible");
        } else {
            text.style.opacity = 0;
            text.style.transform = "translateY(30px)";
            text.classList.remove("visible");
        }

        // Faster fade out for hero background
        const fadeOutStart = heroHeight - window.innerHeight;
        if (scrollY > fadeOutStart) {
            const fadeOutProgress = Math.min((scrollY - fadeOutStart) / 200, 1); // Reduced from 300 to 200
            const eased = 1 - Math.pow(1 - fadeOutProgress, 2); // easeOutQuad
            hero.style.setProperty("--bg-opacity", 1 - eased);
        } else {
            hero.style.setProperty("--bg-opacity", 1);
        }
    });

    document.getElementById("contactForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const company = document.getElementById("company").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();
        const responseDiv = document.getElementById("responseMessage");

        // Basic front-end validation
        if (!name || !email || !phone || !message) {
            responseDiv.textContent = "⚠️ Please fill all required fields.";
            responseDiv.style.color = "red";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            responseDiv.textContent = "⚠️ Please enter a valid email.";
            responseDiv.style.color = "red";
            return;
        }

        if (phone.length < 10) {
            responseDiv.textContent = "⚠️ Please enter a valid 10-digit phone number.";
            responseDiv.style.color = "red";
            return;
        }

        try {
            responseDiv.textContent = "⏳ Sending...";
            responseDiv.style.color = "#333";

            const res = await fetch("https://formspree.io/f/xovpqgyg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    company,
                    message,
                }),
            });

            if (res.ok) {
                responseDiv.textContent = "✅ Message sent successfully!";
                responseDiv.style.color = "green";
                document.getElementById("contactForm").reset();
            } else {
                responseDiv.textContent = "❌ Something went wrong. Please try again.";
                responseDiv.style.color = "red";
            }
        } catch (error) {
            responseDiv.textContent = "⚠️ Network error. Please check your connection.";
            responseDiv.style.color = "red";
        }
    });
});

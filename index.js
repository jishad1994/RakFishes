window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    const heroBg = document.querySelector(".hero::before");
    const text = document.querySelector(".hero-overlay-content");

    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const fadeInStart = 150;
    const fadeInEnd = 400;

    // Text fade-in
    if (scrollY > fadeInStart && scrollY < fadeInEnd) {
        const progress = (scrollY - fadeInStart) / (fadeInEnd - fadeInStart);
        text.style.opacity = progress;
        text.style.transform = `translateY(${50 - progress * 50}px)`;
    } else if (scrollY >= fadeInEnd) {
        text.classList.add("visible");
    } else {
        text.classList.remove("visible");
    }

    // Fade out hero background when leaving section
    const fadeOutStart = heroHeight - window.innerHeight;
    if (scrollY > fadeOutStart) {
        const fadeOutProgress = Math.min((scrollY - fadeOutStart) / 300, 1);
        document.querySelector(".hero").style.setProperty("--bg-opacity", 1 - fadeOutProgress);
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

        const res = await fetch("https://formspree.io/f/xwprrjvk", {
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

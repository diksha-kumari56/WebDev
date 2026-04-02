
function openProject(page) {
    if (page) {
        setTimeout(() => {
            window.location.href = page;
        }, 100);
    }
}

const revealSections = () => {
    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.content-card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";
        card.style.transition = "all 0.8s ease-out";
        observer.observe(card);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    revealSections();
    
    console.log("Diksha's Portfolio: JavaScript Loaded Successfully! 🚀");
});
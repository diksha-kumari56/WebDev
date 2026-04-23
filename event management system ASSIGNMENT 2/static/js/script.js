document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            if (!name || !email) {
                e.preventDefault();
                alert("Please fill in all fields.");
            } else if (!email.includes('@')) {
                e.preventDefault();
                alert("Please enter a valid email.");
            }
        });
    }
});
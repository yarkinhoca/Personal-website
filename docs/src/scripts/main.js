document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    greetingElement.textContent = 'Welcome to My Personal Website!';

    const toggleButton = document.getElementById('toggle-theme');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
});
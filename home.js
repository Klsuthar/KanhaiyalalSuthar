/* Home Section Script */

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.querySelector('.designation-text');
    const texts = ["Mathematics Teacher", "Web Developer", "AI Enthusiast"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];
        letter = currentText.slice(0, ++index);

        textElement.textContent = letter;
        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000); // Wait before deleting
        } else {
            setTimeout(type, 100);
        }
    })();
});

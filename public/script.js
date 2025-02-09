// back button

const backButton = document.querySelectorAll('.back-button');

for (let i = 0; i < backButton.length; i++) {
  backButton[i].addEventListener('click', () => {
    window.history.back();
  });
}


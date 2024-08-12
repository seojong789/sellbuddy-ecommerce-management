document.addEventListener('DOMContentLoaded', function () {
  var played = [0, 0, 0];

  // Helper function to animate text typing effect
  function typeText(container, textArray, fontSize, delay, color) {
    let containerElement = document.querySelector(container);

    // Check if container exists
    if (!containerElement) {
      console.error(`Container ${container} not found.`);
      return;
    }

    let textIndex = 0;

    // Centering the text container
    containerElement.style.display = 'flex';
    containerElement.style.flexDirection = 'column';
    containerElement.style.justifyContent = 'center';
    containerElement.style.alignItems = 'center';
    containerElement.style.height = '100%'; // Ensure it takes the full height of the parent

    function type() {
      if (textIndex < textArray.length) {
        let div = document.createElement('div'); // Block-level element for each text line
        div.style.fontSize = fontSize + 'px';
        div.style.color = color || '#000';
        div.style.textAlign = 'center'; // Center text within the line
        containerElement.appendChild(div);

        let charIndex = 0;
        let interval = setInterval(() => {
          if (charIndex < textArray[textIndex].length) {
            div.textContent += textArray[textIndex][charIndex];
            charIndex++;
          } else {
            clearInterval(interval);
            textIndex++;
            setTimeout(type, delay);
          }
        }, 100); // Typing speed (ms per character)
      }
    }

    type();
  }

  // Define text content for each page
  var textContent = [
    [
      { text: '2024년 08월 02일', fontSize: 12, color: '#000', delay: 500 },
      {
        text: '프로젝트를 시작했습니다.',
        fontSize: 14,
        delay: 1000,
      },
      { text: '비록 2명은 탈주했지만...', fontSize: 14, delay: 4500 },
      {
        text: '저희 4명은 끝까지 포기하지 않았습니다.',
        fontSize: 14,
        color: '#3f51b5',
        delay: 500,
      },
    ],
    [
      { text: '16 Jan 2019', fontSize: 12, color: '#000', delay: 500 },
      { text: 'Try to create something else.', fontSize: 14, delay: 4000 },
      { text: 'Like a diary or a todo list.', fontSize: 14, delay: 3500 },
    ],
    [
      { text: '17 Jan 2019', fontSize: 12, color: '#000', delay: 500 },
      { text: 'Creating a Diary.', fontSize: 14, delay: 4000 },
      { text: 'View the library on,', fontSize: 14, delay: 3500 },
      { text: '시작해보세요.', fontSize: 14, color: '#3f51b5', delay: 1500 },
    ],
  ];

  // Add click event listeners to the pages
  document.querySelectorAll('.front:not(.last)').forEach((element, index) => {
    element.addEventListener('click', function () {
      document.querySelector('.book').classList.add('open');
      element.parentElement.classList.add('open');

      if (!played[index]) {
        let pageText = textContent[index];
        let delay = 0;

        pageText.forEach((item) => {
          setTimeout(() => {
            typeText(
              `#vara-container${index + 1}`,
              [item.text],
              item.fontSize,
              item.delay || 1000,
              item.color
            );
          }, delay);
          delay += item.delay;
        });

        played[index] = 1;
      }
    });
  });

  document.querySelectorAll('.back').forEach((element, index) => {
    element.addEventListener('click', function () {
      if (index == 0) document.querySelector('.book').classList.remove('open');
      element.parentElement.classList.remove('open');
    });
  });
});

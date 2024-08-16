document.addEventListener('DOMContentLoaded', function () {
  var played = [0, 0, 0];

  function typeText(container, textArray, fontSize, delay, color, onComplete) {
    let containerElement = document.querySelector(container);

    if (!containerElement) {
      console.error(`Container ${container} not found.`);
      return;
    }

    let textIndex = 0;

    containerElement.style.position = 'absolute';
    containerElement.style.top = '180px';
    containerElement.style.left = '100px';
    containerElement.style.textAlign = 'left';

    function type() {
      if (textIndex < textArray.length) {
        let div = document.createElement('div');
        div.style.fontSize = fontSize + 'px';
        div.style.color = color || '#000';
        div.style.textAlign = 'left';
        containerElement.appendChild(div);

        let charIndex = 0;
        let interval = setInterval(() => {
          if (charIndex < textArray[textIndex].length) {
            if (
              textArray[textIndex].substring(charIndex, charIndex + 5) ===
              '<br/>'
            ) {
              div.appendChild(document.createElement('br'));
              charIndex += 5;
            } else {
              let span = document.createElement('span');
              let char = textArray[textIndex][charIndex];
              span.textContent = char === ' ' ? '\u00A0' : char;
              span.style.display = 'none';
              div.appendChild(span);

              setTimeout(() => {
                span.style.display = 'inline-block';
              }, charIndex * 100);
              charIndex++;
            }
          } else {
            clearInterval(interval);
            textIndex++;
            setTimeout(type, delay);
          }
        }, 100);
      } else if (onComplete) {
        setTimeout(onComplete, delay);
      }
    }

    type();
  }

  function ClickRedirect() {
    window.location.href = '/login.html';
  }

  var textContent = [
    [
      { text: 'SellBuddy는 ', fontSize: 17, color: '#b36060', delay: 300 },
      { text: '<br/>', fontSize: 17, color: '#000', delay: 300 },
      { text: '여러 쇼핑몰의 ', fontSize: 17, color: '#000', delay: 300 },
      {
        text: '매출, 해시태그, 리뷰 등을 ',
        fontSize: 17,
        color: '#000',
        delay: 300,
      },
      { text: '통합적으로 분석하여 ', fontSize: 17, delay: 300 },
      { text: '<br/>', fontSize: 17, color: '#000', delay: 300 },
      { text: '온라인 쇼핑몰 초보자도 ', fontSize: 17, delay: 300 },
      { text: '쉽게 이해하고 사용할 수 있는 ', fontSize: 17, delay: 300 },
      { text: '<br/>', fontSize: 17, color: '#000', delay: 300 },
      { text: '분석 정보를 제공하는 ', fontSize: 17, delay: 300 },
      { text: '웹 서비스입니다.', fontSize: 17, delay: 300 },
    ],
    [
      {
        text: '한눈에 파악할 수 있는 ',
        fontSize: 17,
        color: '#000',
        delay: 300,
      },
      { text: '그래프를 통해 ', fontSize: 17, color: '#000', delay: 300 },
      { text: '<br/>', fontSize: 17, delay: 300 },
      { text: '매출 정보를 직관적으로 분석하고, ', fontSize: 17, delay: 300 },
      { text: '취약 부분을 진단하여 ', fontSize: 17, delay: 300 },
      { text: '<br/>', fontSize: 17, delay: 300 },
      { text: '간단한 개선 방안을 제시함으로써 ', fontSize: 17, delay: 300 },
      { text: '사용자의 매출 증대를 지원합니다.', fontSize: 17, delay: 300 },
    ],
    [
      {
        text: '시작부터 다사다난했던 ',
        fontSize: 17,
        color: '#000',
        delay: 700,
      },
      { text: '<br/>', fontSize: 17, delay: 700 },
      { text: '저희 4조의 SellBuddy, ', fontSize: 17, delay: 700 },
      { text: '<br/>', fontSize: 17, delay: 700 },
      { text: '<br/>', fontSize: 17, delay: 700 },
      {
        text: '지금 소개합니다.',
        fontSize: 17,
        color: '#b36060',
        delay: 700,
        onComplete: () => {
          const lastText = document.querySelector('#vara-container3');
          lastText.style.cursor = 'pointer';
          lastText.addEventListener('click', ClickRedirect);
        },
      },
    ],
  ];

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
              item.delay || 300,
              item.color,
              item.onComplete,
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

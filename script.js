const totalValue = document.querySelector('.result span');
const bondItemTotalValue = document.querySelectorAll('.bonds-list td');
const tradeDate = document.querySelector('.calendar span');
tradeDate.textContent = dateToRus(tradeDate.textContent);

const nav = document.querySelector('.nav');

nav.addEventListener('click', (evt) => {
  let target = evt.target;
  const acvtiveLink = document.querySelector('.active');

  if (target.classList.contains('nav__link')) {
    acvtiveLink.classList.remove('active');
    target.classList.add('active');
  }
});


const startdate = new Date();
const lastUpdate = document.querySelector('.last-update');
lastUpdate.textContent = `Посл.обновление в ${startdate.getHours()}:${String(startdate.getMinutes()).padStart(2, '0')}`;



function plusOrMinus (el) {
  if (parseInt(el.textContent) < 0) {
    el.style.color = 'red';
  } else if (parseInt(el.textContent) > 0) {
    el.style.color = 'green';
  }
}

function dateToRus(date) {
  return new Date(Date.parse(date)).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

plusOrMinus(totalValue);





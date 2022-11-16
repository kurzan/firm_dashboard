const calendarWindget = document.querySelector('.coupone-calendar-widget');
const tableBody = document.querySelector('.coupone-table__body');
const bondTitle = document.querySelector('.bond_title');
const bondTextCoupons = document.querySelector('.bond_text__coupons');
const showFeautersCouponsButton = document.querySelector('.show-feauters-coupons');
const showPrevsCouponsButton = document.querySelector('.show-prev-coupons');

const bondButtinsList = document.querySelector('.bonds-buttons-list');
const preWidget = document.querySelector('.pre-widget');
const widget = document.querySelector('.coupone-calendar-widget');
const cancelCalendarWidget = document.querySelector('.cancel');


preWidget.addEventListener('click', () => {
  widget.classList.remove('hidden');
})

cancelCalendarWidget.addEventListener('click', () => {
  widget.classList.add('hidden');
  console.log('hey')
})


const BONDS = {
  pion1: 'RU000A0ZZAT8',
  pion2: 'RU000A1006C3',
  pion3: 'RU000A1013N6',
  pion4: 'RU000A102LF6',
  pion5: 'RU000A104V00',
}

const today = new Date();
let visible_old_coupons = 3;
let visible_feauters_coupons = 8;


function dateToRus(date) {
  return new Date(Date.parse(date)).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function newCouponCalendar(item) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.innerHTML = `
      <th>${dateToRus(item.coupondate)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function oldCouponCalendar(item) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('old-coupones');
  calendar.innerHTML = `
      <th>${dateToRus(item.coupondate)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function currentCouponCalendar({coupondate, value_rub, valueprc}) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('current-coupone');
  calendar.innerHTML = `
      <th>${dateToRus(coupondate)}</br><span class="current_coupon_span">Ближайшая выплата<span></th>
      <th>${value_rub}₽</th>
      <th>${valueprc}%</th>
	`;

  return calendar;
}


function renderCalendar(oldCoupons, newCoupons) {
  oldCoupons.forEach((el) => {
    tableBody.append(oldCouponCalendar(el));
  });

  const currentCoupon = newCoupons[0];
  tableBody.append(currentCouponCalendar(currentCoupon));

  for (let i = 1; i < newCoupons.length; i++) {
    tableBody.append(newCouponCalendar(newCoupons[i]));
  }
}

function removeWidget() {
  calendarWindget.remove();
}



function renderWidget (bond_code) {
  fetch(`https://iss.moex.com/iss/securities/${bond_code}/bondization.json?iss.json=extended&iss.meta=off&iss.only=coug=ru&limit=unlimited`)
  .then(r => r.json())
  .then((data) => {
    const coupons = data[1].coupons;
    const bondName = coupons[0].name;

    bondTitle.textContent = bondName;
    //Кол-во купонов у облигации
    const allCoupones = coupons.length;

    const oldCoupons = [];
    const featureCoupons = [];

    coupons.forEach((el) => {
      const date = new Date(el.coupondate);
      if (date < today) {
        oldCoupons.push(el);
      } else {
        featureCoupons.push(el);
      }
    })

    // Кол-во выплаченных купонов
    const paysCoupons = oldCoupons.length;
    
    const filteredOLdCoupons = oldCoupons.slice(-visible_old_coupons);
    const filteredFeautersCoupons = featureCoupons.slice(0, visible_feauters_coupons);

    let prevCoupones = '';
    let nexCoupones = '';

    prevCoupones = oldCoupons.length - filteredOLdCoupons.length ;
    nexCoupones = featureCoupons.length  - filteredFeautersCoupons.length ;

    if (nexCoupones) {
      showFeautersCouponsButton.innerHTML = `Еще ${nexCoupones} будущих выплат`;
    }

    if (prevCoupones) {
      showPrevsCouponsButton.innerHTML = `Предыдущие ${prevCoupones} выплаты`;
    }

    renderCalendar(filteredOLdCoupons, filteredFeautersCoupons);
    
    bondTextCoupons.innerHTML = `Выплачено купонов: <span>${paysCoupons}</span> из <span>${allCoupones}</span>`;

    function onShowBtn (prevBtn, nextBtn, couponArr1, couponArr2) {
      tableBody.innerHTML = '';
      renderCalendar(couponArr1, couponArr2);
    
      prevBtn.textContent = 'Свернуть';
      nextBtn.textContent = '';
    }

    function onHideBtn () {
      tableBody.innerHTML = '';
      renderCalendar(filteredOLdCoupons, filteredFeautersCoupons);
      if (nexCoupones) {
        showFeautersCouponsButton.innerHTML = `Еще ${nexCoupones} будущих выплат`;
      }
  
      if (prevCoupones) {
        showPrevsCouponsButton.innerHTML = `Предыдущие ${prevCoupones} выплаты`;
      }
    }

    function showPrevCoupones() {
      let right = false;

      showPrevsCouponsButton.addEventListener('click', () => {
        right = !right;

        if (right) {
          onShowBtn(showPrevsCouponsButton, showFeautersCouponsButton, oldCoupons, filteredFeautersCoupons)
        } else {
          onHideBtn();
        }
      })
    }

    function showNextCoupones() {
      let right = false;

      showFeautersCouponsButton.addEventListener('click', () => {
        right = !right;
        if (right) {
          onShowBtn(showFeautersCouponsButton, showPrevsCouponsButton, filteredOLdCoupons, featureCoupons)
        } else {
          onHideBtn();
        }
      })
    }

    showPrevCoupones();
    showNextCoupones();
    
  })
  // .catch(() => {
  //   removeWidget();
  // })
  ;

}



renderWidget('RU000A0ZZAT8');

function bondsFilter (evt) {
  tableBody.innerHTML ='';
  showFeautersCouponsButton.innerHTML ='';
  showPrevsCouponsButton.innerHTML ='';
  renderWidget(BONDS[evt.target.classList[1]]);
}


bondButtinsList.addEventListener('click', (evt) => {
  let target = evt.target;
  const activeLink = document.querySelector('.active_btn');

  if (target.classList.contains('bond-button')) {
    activeLink.classList.remove('active_btn');
    target.classList.add('active_btn');
    bondsFilter(evt);
  }

})

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

startBtn.disabled = true;

class Timer {
  constructor() {
    this.intervalId = null;
    this.initFlatpickr();
  }
  initFlatpickr() {
    const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: selectedDates => {
        this.clear();
        const now = Date.now();
        this.userSelectedDate = selectedDates[0].getTime();

        if (this.userSelectedDate <= now) {
          iziToast.error({
            message: 'Please choose a date in the future',
            position: 'topRight',
          });
          startBtn.disabled = true;
        } else {
          startBtn.disabled = false;
        }
      },
    };

    flatpickr('#datetime-picker', options);
  }
  start() {
    startBtn.disabled = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeLeft = this.userSelectedDate - currentTime;

      if (timeLeft < 1000) {
        startBtn.disabled = false;
        this.clear();
        iziToast.success({
          message: 'Time`s up',
          position: 'topRight',
        });

        return;
      }

      const time = this.convertMs(timeLeft);
      updateTimer(time);
    }, 1000);
  }
  clear() {
    clearInterval(this.intervalId);
    updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}
const time = new Timer();
startBtn.addEventListener('click', time.start.bind(time));

function updateTimer({ days, hours, minutes, seconds }) {
  timerDays.textContent = String(days).padStart(2, '0');
  timerHours.textContent = String(hours).padStart(2, '0');
  timerMinutes.textContent = String(minutes).padStart(2, '0');
  timerSeconds.textContent = String(seconds).padStart(2, '0');
}

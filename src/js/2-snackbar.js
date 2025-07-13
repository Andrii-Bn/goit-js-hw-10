import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btn = document.querySelector('button');
const delayInput = document.getElementsByName('delay');
const stateInput = document.getElementsByName('state');

function createPromise(event) {
  event.preventDefault();
  let checkedState = null;
  for (const radio of stateInput) {
    if (radio.checked) {
      checkedState = radio.value;
      break;
    }
  }
  console.log(checkedState);

  const delay = Number(delayInput[0].value);
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (checkedState === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
  promise
    .then(message =>
      iziToast.success({
        message,
        position: 'topRight',
      })
    )
    .catch(message =>
      iziToast.error({
        message,
        position: 'topRight',
      })
    );
}

btn.addEventListener('click', createPromise);

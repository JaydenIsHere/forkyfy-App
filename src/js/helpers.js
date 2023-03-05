import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //tell server that the data is going to be JSON format
          },
          body: JSON.stringify(uploadData), //convert normal data to JSON
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const pizzas = await res.json();
    if (!res.ok)
      throw new Error(`Attention !!${pizzas.message} status code${res.status}`);
    return pizzas;
  } catch (err) {
    throw err;
    //we need to re-trhow err as this error was nested in the modal
  }
};

// export const getJSON = async function (url) {
//   try {
//     const getData = await AJAX(url);
//     return getData;
//   } catch (err) {
//     throw err;
//     //we need to re-trhow err as this error was nested in the modal
//   }
// };
// export const postJSON = async function (url, uploadData) {
//   try {
//     const postData = await AJAX(url, uploadData);
//     return postData;
//   } catch (err) {
//     throw err;
//     //we need to re-trhow err as this error was nested in the modal
//   }
// };

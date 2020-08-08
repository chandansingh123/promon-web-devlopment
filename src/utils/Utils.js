
import { toast } from 'react-toastify';
import moment from 'moment';

export const includesObject = function (object, array) {
  return array.some(elem => elem === object)
}

export const getIdByValue = (value, array, field = 'value') => array.filter(obj => obj[field] === value)[0].id

export const getValueById = (id, array) => array.filter(obj => obj.id === id)[0].value;

export const displaySnakBar = (message) => {
  let snakbar = document.getElementById("snackbar");
  snakbar.className = "show";
  snakbar.innerHTML = message;
  setTimeout(function () { snakbar.className = snakbar.className.replace("show", ""); }, 5000);
}

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const getDate = (epoch) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(epoch);

  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

export const getTime = (epoch) => new Date(epoch).toTimeString().split(' ')[0];

export const ToastType = Object.freeze({
  'SUCCESS': 1,
  'ERROR': 2,
  'WARNING': 3
});

export const notify = (type, message) => {
  switch (type) {
    case ToastType.SUCCESS: toast.success(message, { autoClose: 5000, className: 'toast-message' }); break;
    case ToastType.ERROR: toast.error(message, { autoClose: 5000, className: 'toast-message' }); break;
    case ToastType.WARNING: toast.warn(message, { autoClose: 5000, className: 'toast-message' }); break;
    default: toast.success(message, { autoClose: 5000, className: 'toast-message' }); break;
  }
};

export const relativeTime = (pastDate) => {
  return `${moment(pastDate).fromNow()} on ${moment().format('ddd MMMM Do YYYY, h:mm a')}`;
};

export const formatDate = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm a');
};

export const isValidDateString = dateString => {
  const parsedDate = String(dateString).substring(0, 10);
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!parsedDate.match(regEx)) return false;  // Invalid format
  var date = new Date(dateString);
  var dateInMiliSeconds = date.getTime();
  if (!dateInMiliSeconds && dateInMiliSeconds !== 0) return false; // NaN value, Invalid date
  return true;
}

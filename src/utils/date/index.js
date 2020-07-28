export const getChatTime = date => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export const setDateChat = date => {
  const year = date.getUTCFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const getCurrentDate = () => {
  let today = new Date();
  let d = today.getDate();
  let m = today.getMonth();
  let month = monthNames[m];
  let y = today.getFullYear();
  var hours = today.getHours(); //Current Hours
  var min = today.getMinutes(); //Current Minutes
  var sec = today.getSeconds(); //Current Seconds
  let date = `${d} ${month} ${y}, ${hours}:${min}:${sec}`;
  return date;
};

export function getCookie(cName: string) {
  cName = cName + '=';
  const cookieData = document.cookie;
  let start = cookieData.indexOf(cName);
  let cValue = '';
  if (start !== -1) {
    start += cName.length;
    let end = cookieData.indexOf(';', start);
    if (end === -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

export function setCookie(name: string, value: string) {
  document.cookie = name + '=' + value + ';';
}

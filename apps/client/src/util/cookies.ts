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
  return cValue;
}

export function setCookie(name: string, value: string) {
  document.cookie = name + '=' + value + ';';
}

export function deleteCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

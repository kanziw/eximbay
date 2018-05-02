export const sortByKeys = data => {
  const newData = {}
  Object.keys(data).sort().forEach(key => newData[ key ] = data[ key ])
  return newData
}

// encode 된 값으로 query string 을 만들면 실패한다.
const addQueryString = (data, str, key, idx) => `${str}${idx === 0 ? '' : '&'}${key}=${data[ key ]}`
export const makeQueryString = (data = {}) => Object.keys(data).reduce(addQueryString.bind(null, data), '')

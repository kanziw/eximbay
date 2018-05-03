const curry2 = f => (..._) => _.length < 2 ? (..._2) => f(..._, ..._2) : f(..._);

const sortByKeys = data => {
  const newData = {}
  Object.keys(data).sort().forEach(key => newData[ key ] = data[ key ])
  return newData
}

// encode 된 값으로 query string 을 만들면 실패한다.
const addQueryString = (data, str, key, idx) => `${str}${idx === 0 ? '' : '&'}${key}=${data[ key ]}`
const makeQueryString = (data = {}) => Object.keys(data).reduce(addQueryString.bind(null, data), '')

const common = {
  sortByKeys,
  makeQueryString,
  curry2,
}

try {
  if (window) {
    Object.assign(window, common)
  }
} catch (ex) {
  module.exports = common
}

/**
 * 请求接口前设置请求头信息
 * @param {String} X-Nonce 随机字符串（16位）
 * @param {Number} X-Time unixtime时间戳（10位）
 * @param {String} Authorization 认证用 Bear，基本用Basic
 * @param {String} X-Sign 格式lower(sha1("lkker:{{X-Nonce}}:{{X-Time}}:{{data}}”))（40位）
 */
import sha1 from 'js-sha1';

// let esc = function (param) {
//     return encodeURIComponent(param)
//         .replace(/[!'()*]/g, escape)
//         .replace(/%20/g, '+');
// };
function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toLocaleUpperCase();
  });
}

function httpBuildQuery (queryData, numericPrefix, argSeparator, tempKey) {
  numericPrefix = numericPrefix || null;
  argSeparator = argSeparator || '&';
  tempKey = tempKey || null;

  let query = Object.keys(queryData).map(function (k) {
    let res;
    let key = k;

    if (tempKey) {
      key = tempKey + '[' + key + ']';
    }

    if (typeof queryData[k] === 'object') {
      res = httpBuildQuery(queryData[k], null, argSeparator, key);
    } else {
      if (numericPrefix) {
        key = isNumeric(key) ? numericPrefix + Number(key) : key;
      }
      res = fixedEncodeURIComponent(key) + '=' + fixedEncodeURIComponent(queryData[k]);
    }

    return res;
  });

  return query.filter(function (value, index) { if (value !== '') return value; }).join(argSeparator).replace(/[!'()*]/g, '');
};

function buildQuery (queryArr) {
  let str = '';
  queryArr.forEach(function (value, index) {
    if (Array.isArray(value.value) || typeof value.value === 'object') {
      if (Object.keys(value.value).length !== 0) {
        str += httpBuildQuery(value.value, null, null, value.key) + '&'
      }
    } else {
      str += value.key + '=' + fixedEncodeURIComponent(value.value) + '&'
    }
  });

  return str.slice(0, -1);
}

function sortByKey (lists) {
  lists.sort(function (a, b) {
    if (a.key > b.key) {
      return 1;
    } else if (a.key < b.key) {
      return -1;
    }
    return 0;
  });
  return lists;
}

function splitQuery (query) {
  if (query === '') {
    return [];
  }
  query = query.substring(1);
  let lists = [];
  let kv = query.split('&');
  console.log(query)
  kv.forEach(function (value, index) {
    let [_key, _value] = value.split('=');
    lists[index] = {key: _key, value: _value}
  });
  return lists;
}

function map2list (kv) {
  let lists = [];
  Object.keys(kv).forEach(function (_value, _index) {
    lists[_index] = {key: _value, value: kv[_value]}
  });
  return lists;
}

function parserUrl (url) {
  let parser = document.createElement('a');
  parser.href = url;
  return parser;
}

function getSignQueryData (request, token) {
  let _data = '';
  let data = '';
  const url = parserUrl(request.url);

  _data = request.method.toLocaleUpperCase() +
      url.pathname +
      buildQuery(sortByKey(splitQuery(url.search)).map(function (value) {
        value.value = decodeURIComponent(value.value);
        return value;
      }));

  data = token + ':' + request.headers['X-Nonce'] + ':' + request.headers['X-Time'] + ':' + _data;
  return data;
}

function getSignQueryAndBodyData (request, token) {
  let data = {}
  let methodType = request.method.toLocaleUpperCase();
  if (methodType === 'GET') {
    data = request.params
  } else {
    data = request.data
  }
  let post = '';
  if (typeof data !== 'undefined') {
    post = buildQuery(sortByKey(map2list(data)));
  }
  return getSignQueryData(request, token) + post;
}

// 获取 unixtime时间戳
export function getUnixtime () {
  return Math.floor((new Date()).getTime() / 1000);
}

// 获取随机字符串（16位）
export function getRandomStr (len = 16) {
  let ret = '';
  let str = '1234567890qwertyuioplkjhgfdsazxcvbnmQAZWSXEDCRFVTGBYHNUJMIKOL';
  let strlen = str.length;
  for (let i = 0; i < len; i++) {
    ret += str.charAt(Math.floor(Math.random() * strlen));
  }
  return ret;
}

// 获取X-Sign数据
export function getSignData (config, token) {
  let methodType = config.method.toLocaleUpperCase();
  let data = '';
  switch (methodType) {
  case 'DELETE':
    data = getSignQueryData(config, token);
    break;
  case 'GET':
  case 'POST':
  case 'PUT':
  case 'PATCH':
    data = getSignQueryAndBodyData(config, token);
    break;
  default:
  }
  data = data.replace(/&+/g, '&');
  // console.log('getSignData === > ' + data);
  return sha1(data);
}

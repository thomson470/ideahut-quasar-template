import { util } from "src/scripts/util";
import { uix } from "src/scripts/uix";
import { sha } from "src/scripts/sha";
import { storage } from "src/scripts/storage";
import axios from "axios";

const WS_URL = process.env.WS_URL;
const API_URL = process.env.API_URL;
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT);

const onError = function (error, onError, notify) {
  let obj = {};
  let response = error.response || {};
  if (response.status === 502 || response.status === 503) {
    obj.code = response.status + "";
    obj.text = "Service is unavailable";
  } else if (response.status === -4) {
    obj.code = response.status + "";
    obj.text = "Timeout";
  } else if (response.status && response.error) {
    obj.code = response.status + "";
    obj.text = response.error;
  } else {
    obj.code = "NE";
    obj.text = "Network Error";
  }
  if (notify) {
    uix.notify(obj.text + " (" + obj.code + ")");
  }
  if (util.isFunction(onError)) {
    onError(obj);
  }
};

const checkReset = function(response) {
  if (response?.headers && "access-reset" in response.headers) {
    storage.access(null);
    storage.user(null);
    storage.menu(null);
  }
};

const build = function (options) {
  let opts = util.isObject(options) ? options : {};
  opts.method = util.isString(opts.method)
    ? opts.method.trim().toUpperCase()
    : "GET";
  opts.baseURL = API_URL;
  opts.url = util.isString(opts.url) ? opts.url : options.path;
  let now = new Date();
  let access = storage.access();
  let key = util.isString(access.accessKey) ? access.accessKey : "";
  let zone = 0 - now.getTimezoneOffset() * 60 + "";
  let time = now.getTime() + "";
  let language = storage.language();
  let headers = util.isObject(opts.headers) ? opts.headers : {};
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Accept-Language"] = language;
  headers["Access-Zone"] = zone;
  headers["Access-Time"] = time;
  headers["Access-Src"] = "portal";
  if ("" !== key) {
    headers["Access-Key"] = util.isString(access.accessKey)
      ? access.accessKey
      : "";
    if (access.accessUqk && "" !== access.accessUqk) {
      headers["Access-Sign"] = sha.sha1("" + access.accessUqk + time);
    }
  }
  if (!util.isDefined(headers["Accept"])) {
    headers["Accept"] = "application/json";
  }
  if (!util.isDefined(headers["Content-Type"])) {
    headers["Content-Type"] = "application/json";
  }
  opts.headers = headers;
  opts.timeout =
    util.isNumber(opts.timeout) && opts.timeout > 0
      ? opts.timeout
      : API_TIMEOUT;
  opts.timeout = opts.timeout * 1000;
  if (util.isFunction(opts.onStart)) {
    opts.onStart(opts);
  }
  let res = axios(opts);
  return res;
};

const request = function (options) {
  let opts = util.isObject(options) ? options : {};
  build(opts)
    .then(function (response) {
      util.log("<<api-request-success>>", response);
      checkReset(response);
      if (util.isFunction(opts.onFinish)) {
        opts.onFinish();
      }
      if (200 === response.status) {
        let result = response.data;
        if (0 === result.status) {
          if (util.isFunction(opts.onSuccess)) {
            opts.onSuccess(result.data, result.info);
          }
        } else {
          let error =
            util.isArray(result.error) && result.error.length !== 0
              ? result.error[result.error.length - 1]
              : {};
          let code = error.code;
          if ("E.80" === code || "E.81" === code || "E.82" === code) {
            storage.access(null);
          } else if ("E.14" === code) {
            storage.user(null);
            window.location.href = "/#/login";
          } else if ("AR6" === code || "AR1" === code) {
            storage.user(null);
            storage.access(null);
          }
          if (util.isFunction(opts.onError)) {
            opts.onError(result);
            if (opts.notify) {
              uix.notify(error.text + " (" + error.code + ")");
            }
          } else {
            uix.notify(error.text + " (" + error.code + ")");
          }
        }
      } else {
        let oerr = { code: response.status + "", text: response.error + "" };
        if (util.isFunction(opts.onError)) {
          opts.onError(oerr);
          if (opts.notify) {
            uix.notify(oerr.text + " (" + oerr.code + ")");
          }
        } else {
          uix.notify(oerr.text + " (" + oerr.code + ")");
        }
      }
    })
    .catch(function (error) {
      util.log("<<api-request-error>>", error);
      checkReset(error.response || {});
      if (util.isFunction(opts.onFinish)) {
        opts.onFinish();
      }
      onError(error, opts.onError, opts.notify);
    });
};

const api = {
  url: {
    api: function() {
      return API_URL;
    },
    ws: function() {
      return WS_URL;
    },
  },
  multimedia: function (link) {
    link = link || "";
    if (
      !link.startsWith("http://") &&
      !link.startsWith("https://") &&
      !link.startsWith("file://")
    ) {
      let multimediaUrl = storage.config().multimediaUrl || "";
      return multimediaUrl + link;
    }
    return link;
  },
  call: function (options) {
    request(options);
  },
  send: function(options) {
    // tidak ada pengecekan format respon
    // bisa berguna untuk download
    let opts = util.isObject(options) ? options : {};
    build(opts)
      .then(function (response) {
        util.log("<<api-send-success>>", response);
        checkReset(response);
        if (util.isFunction(opts.onFinish)) {
          opts.onFinish();
        }
        if (util.isFunction(opts.onSuccess)) {
          opts.onSuccess(response);
        }
      })
      .catch(function (error) {
        util.log("<<api-error>>", error);
        checkReset(error.response || {});
        if (util.isFunction(opts.onFinish)) {
          opts.onFinish();
        }
        onError(error, opts.onError, opts.notify);
      });
  },
};
export { api };

import { LocalStorage, Platform } from "quasar";
import { util } from "src/scripts/util";
import { sha } from "src/scripts/sha";

const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE;
const DEVICE_INFO = JSON.stringify(Platform.is);
const STOREGE_ID = sha.sha1(DEVICE_INFO);

const persist = function (v) {
  let o;
  if (util.isObject(v)) {
    o = v;
    LocalStorage.set(STOREGE_ID, o);
  } else {
    o = LocalStorage.getItem(STOREGE_ID);
  }
  if (!util.isObject(o)) {
    o = {};
    LocalStorage.set(STOREGE_ID, o);
  }
  return o;
};

const storage = {
  persist: function (v) {
    return persist(v);
  },
  access: function (v) {
    let o = persist();
    if (util.isDefined(v)) {
      if (util.isObject(v)) {
        o.access = v;
      } else {
        delete o.access;
      }
      persist(o);
    }
    return o.access || {};
  },
  user: function (v) {
    let o = persist();
    if (util.isDefined(v)) {
      if (util.isObject(v)) {
        o.user = v;
      } else {
        delete o.user;
      }
      persist(o);
    }
    return o.user || {};
  },
  config: function (v) {
    let o = persist();
    if (util.isDefined(v)) {
      if (util.isObject(v)) {
        o.config = v;
      } else {
        delete o.config;
      }
      persist(o);
    }
    return o.config || {};
  },
  language: function (v) {
    let o = persist();
    if (util.isString(v)) {
      v = v.trim();
      if (v !== "") {
        o.language = v;
        persist(o);
      }
      return v;
    } else {
      let l = o.language;
      if (!util.isString(l)) {
        l = DEFAULT_LANGUAGE;
        o.language = l;
        persist(o);
      }
      return l;
    }
  },
  menu: function (v) {
    let o = persist();
    if (util.isDefined(v)) {
      if (util.isObject(v)) {
        o.menu = v;
      } else {
        delete o.menu;
      }
      persist(o);
    }
    return o.menu || {};
  },
  dark: function (v) {
    let o = persist();
    if (util.isDefined(v)) {
      if (util.isBoolean(v)) {
        o.dark = v;
      } else {
        delete o.dark;
      }
      persist(o);
    }
    return o.dark || false;
  },
  localId: function () {
    let o = persist();
    let v = o.local;
    let d = new Date();
    let now = d.getTime();
    if (!util.isObject(v) || v.expire < now) {
      let tz = 0 - d.getTimezoneOffset() * 60;
      v = {
        id: util.uuid() + "_" + tz + "_" + now,
        expire: now + 86400000,
      };
      o.local = v;
      persist(o);
    }
    return o.local.id;
  },
  article: {
    daily: function (v) {
      let o = persist();
      if (!util.isObject(o.article)) {
        o.article = {};
      }
      if (util.isDefined(v)) {
        if (util.isObject(v)) {
          o.article.daily = v;
        } else {
          delete o.article.daily;
        }
        persist(o);
      }
      return o.article.daily;
    },
  },
};
export { storage };

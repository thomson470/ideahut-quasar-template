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
    auth: function (v) {
        let o = persist();
        if (util.isDefined(v)) {
            if (util.isObject(v)) {
                o.auth = v;
            } else {
                delete o.auth;
            }
            persist(o);
        }
        return o.auth || {};
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
};
export { storage };

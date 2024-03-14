<template>
  <q-layout
    view="hHh lpR fFf"
    :class="is_dark_mode ? 'bg-black' : 'bg-blue-grey-1'"
  >
    <q-header class="header-main">
      <q-toolbar>
        <q-btn
          round
          :size="$q.screen.gt.sm ? 'md' : 'sm'"
          :aria-label="$t('menu.title')"
          icon="menu"
          @click="on_toggle_menu"
        >
          <q-tooltip>{{ $t("menu.title") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          no-caps
          no-wrap
          :label="$t('app.title')"
          :size="$q.screen.gt.sm ? 'xl' : 'lg'"
          :class="'q-pa-xs text-weight-bold ' + ($q.screen.gt.sm ? 'q-ml-md' : 'q-ml-xs')"
          @click="on_header_menu_click('/')"
        >
        </q-btn>
        <q-space />
        <div class="q-gutter-sm row center-items no-wrap">
          <q-select
            v-model="language.active"
            :options="language.options"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            class="toolbar-select"
            behavior="menu"
            borderless
            @update:model-value="on_change_language"
          >
          </q-select>
          <q-btn
            round
            :icon="is_dark_mode ? 'light_mode' : 'dark_mode'"
            :size="$q.screen.gt.sm ? 'md' : 'sm'"
            @click="on_toggle_dark_click()"
          >
            <q-tooltip>{{ is_dark_mode ? $t("menu.light_mode") : $t("menu.dark_mode") }}</q-tooltip>
          </q-btn>
          <q-btn
            round
            :icon="is_logged_in ? 'logout' : 'login'"
            :size="$q.screen.gt.sm ? 'md' : 'sm'"
            :loading="is_logout_progress"
            @click="is_logged_in ? on_logout_click() : on_login_click()"
          >
            <q-tooltip>{{ is_logged_in ? $t("menu.logout") : $t("menu.login") }}</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="is_show_menu"
      bordered
      elevated
      :width="300"
      :breakpoint="400"
      :class="is_dark_mode ? 'bg-grey-10' : 'bg-indigo-1'"
    >
      <q-scroll-area
        :style="
          is_logged_in ? 'height: calc(100% - 110px); margin-top: 110px;' : ''
        "
        :class="'fit q-pt-sm'"
      >
        <q-list>
          <template v-for="(menu, index) in menus" :key="index">
            <q-separator v-if="menu.separator" />
            <q-expansion-item
              v-else-if="menu.children && menu.children.length"
              :icon="menu.icon && '' !== menu.icon ? menu.icon : 'menu_book'"
              :label="menu.title"
              :default-opened="
                active_menu.parent &&
                menu.id.menuCode === active_menu.parent.id.menuCode
              "
            >
              <q-separator />
              <q-item
                v-for="child in menu.children"
                :key="child.id.menuCode"
                class="q-pl-xl"
                v-ripple
                clickable
                @click="on_menu_click(child)"
              >
                <q-item-section avatar style="min-width: 0px">
                  <q-icon size="xs" :name="child.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    :class="
                      'q-pl-md' +
                      (active_menu.id.menuCode === child.id.menuCode
                        ? ' text-weight-bold'
                        : '')
                    "
                    >{{ child.title }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item v-else v-ripple clickable @click="on_menu_click(menu)">
              <q-item-section avatar style="min-width: 0px">
                <q-icon size="sm" :name="menu.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  :class="
                    'q-pl-md' +
                    (active_menu.id.menuCode === menu.id.menuCode
                      ? ' text-weight-bold'
                      : '')
                  "
                  >{{ menu.title }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
      <div
        v-if="is_logged_in"
        class="absolute-top bg-profile text-white"
        :style="
          $q.screen.gt.sm ? 'border-top-left-radius: 16px !important;' : ''
        "
      >
        <div class="row">
          <div class="col-3 text-center">
            <q-img
              class="foto-profil"
              no-transition
              no-spinner
              :src="api.multimedia(user.detail ? user.detail.photo : null)"
              @click="is_show_profile_menu = !is_show_profile_menu"
            >
              <template v-slot:error>
                <img src="~/assets/user.png" class="foto-profil" alt="" />
              </template>
            </q-img>
            <q-fab
              v-model="is_show_profile_menu"
              external-label
              vertical-actions-align="left"
              color="white"
              icon="keyboard_arrow_down"
              direction="down"
              padding="none"
              flat
            >
              <q-fab-action
                external-label
                color="red"
                icon="logout"
                :label="$t('menu.logout')"
                @click="on_logout_click"
              />
            </q-fab>
          </div>
          <div class="col-9 q-pl-md">
            <div class="info-nama">
              {{ user.detail ? user.detail.fullname : "" }}
            </div>
            <!--
            <div class="info-saldo">
              <span>{{ $t("label.coin_balance") }}</span>
              <p>
                {{
                  format_money(
                    user.balance && user.balance.coinBalance
                      ? user.balance.coinBalance
                      : 0
                  )
                }}
              </p>
            </div>
            -->
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <div
          v-if="active_menu?.title"
          class="q-pa-sm q-pl-md q-pb-md text-h5"
          v-html="active_menu.title"
        />
        <router-view />
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="120"
          :offset="[12, 12]"
        >
          <q-btn
            round
            glossy
            size="sm"
            icon="keyboard_arrow_up"
            color="primary"
          />
        </q-page-scroller>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { util } from "src/scripts/util";
import { api } from "src/scripts/api";
import { uix } from "src/scripts/uix";
import { storage } from "src/scripts/storage";

export default {
  setup() {
    return {
      util,
      api,
      is_show_menu: ref(false),
      language: ref({active: "", options: []}),
      active_menu: ref({ id: {} }),
      menus: ref([]),
      user: ref({}),
      is_logged_in: ref(false),
      is_dark_mode: ref(false),
      is_logout_progress: ref(false),
      is_show_profile_menu: ref(false),
    };
  },
  /*
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  */
  created() {
    let self = this;
    if ("/" === self.$route.path) {
      let menu = storage.menu();
      delete menu.active;
      storage.menu(menu);
    }
    self.is_dark_mode = uix.dark.active();
    self.language.options = storage.config().languages;
    if (!util.isArray(self.language.options)) {
      self.language.options = [];
    }
    self.language.active = storage.language();
    api.call({
      path: "/menu/list",
      onSuccess(menus) {
        for (const menu of menus) {
          self.menus.push(menu);
          self.menus.push({ separator: true });
        }
        let menu = storage.menu();
        self.active_menu = util.isObject(menu.active) ? menu.active : { id: {} };
        self.is_show_menu = true === menu.show;
      }
    });
  },
  methods: {
    on_toggle_menu: function () {
      let self = this;
      self.is_show_menu = !self.is_show_menu;
      let menu = storage.menu();
      menu.show = self.is_show_menu;
      storage.menu(menu);
    },
    on_header_menu_click(path) {
      let self = this;
      self.active_menu = { id: {} };
      let cmenu = storage.menu();
      delete cmenu.active;
      storage.menu(cmenu);
      window.location.href = path;
    },

    on_menu_click(menu) {
      let self = this;
      if (util.isString(menu.link) && "" !== menu.link) {
        if (menu.noPushRoute) {
          self.active_menu = { id: {} };
          let cmenu = storage.menu();
          delete cmenu.active;
          storage.menu(cmenu);
          window.location.href = "/#" + menu.link;
        } else {
          self.active_menu = menu;
          let cmenu = storage.menu();
          cmenu.active = menu;
          storage.menu(cmenu);
          self.$router.push({ path: menu.link });
        }
      }
    },

    on_change_language(value) {
      storage.language(value);
      window.location.href = "/";
    },

    on_login_click() {
      let self = this;
      self.is_show_menu = false;
      let menu = storage.menu();
      menu.show = self.is_show_menu;
      storage.menu(menu);
      self.$router.push({ path: "/login" });
    },

    on_logout_click() {
      let self = this;
      uix.confirm(function () {
        self.is_logout_progress = true;
        api.call({
          path: "/access/logout",
          method: "post",
          onFinish() {
            self.is_logout_progress = false;
            storage.user(null);
            storage.access(null);
            let menu = storage.menu();
            menu.show = false;
            delete menu.active;
            self.active_menu = { id: {} };
            storage.menu(menu);
            window.location.href = "/";
          },
          onSuccess(data) {

          },
          onError(error) {

          },
        });
      }, "prompt.logout");
    },
    on_toggle_dark_click() {
      uix.dark.toggle();
      this.is_dark_mode = uix.dark.active();
    },
  },
};
</script>

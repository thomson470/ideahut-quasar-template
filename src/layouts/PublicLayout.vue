<template>
    <q-layout view="hHh lpR fFf" class="background-layout">
        <q-header class="header-main">
            <q-toolbar>
                <q-btn
                    flat
                    no-caps
                    no-wrap
                    :label="$t('app.title')"
                    :size="$q.screen.gt.sm ? 'xl' : 'lg'"
                    :class="'q-pa-xs text-weight-bold ' + ($q.screen.gt.sm ? 'q-ml-md' : 'q-ml-xs')"
                    @click="on_header_menu_click()"
                >
                </q-btn>
                <q-space />
                <q-select
                    v-model="language.active"
                    :options="language.options"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    class="toolbar-select q-mr-md"
                    behavior="menu"
                    borderless
                    transition-show="flip-up"
                    transition-hide="flip-down"
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
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page>
                <router-view />
            </q-page>
        </q-page-container>
    </q-layout>
</template>
  
<script>
import { ref } from "vue";
import { util } from "src/scripts/util";
import { uix } from "src/scripts/uix";
import { storage } from "src/scripts/storage";

export default {
    setup() {
        return {
            uix,
            is_dark_mode: ref(false),
            language: ref({active: "", options: []}),
        };
    },
    created() {
        let self = this;
        self.is_dark_mode = uix.dark.active();
        self.language.options = storage.config().languages;
        if (!util.isArray(self.language.options)) {
            self.language.options = [];
        }
        self.language.active = storage.language();
    },
    methods: {
        /*
         * HEADER MENU
         */
        on_header_menu_click() {
            window.location.href = "/";
        },

        /*
         * LANGUAGE
         */
         on_change_language(value) {
            storage.language(value);
            window.location.reload();
        },

        /*
         * TOGGLE DARK
         */
         on_toggle_dark_click() {
            uix.dark.toggle();
            this.is_dark_mode = uix.dark.active();
        },
    },
};
</script>
  
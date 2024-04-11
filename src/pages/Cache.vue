<template>
    <div class="q-pa-xs">
        <q-list bordered separator>
            <q-item v-for="(reload, index) in reloads" :key="index" clickable>
                <q-item-section avatar>
                    <q-avatar>
                        <q-icon :name="reload.icon" />
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold">{{reload.title}}</q-item-label>
                    <q-item-label caption lines="1">{{reload.description}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-btn
                    icon="system_update_alt"
                    :label="$t('label.reload')"
                    no-caps
                    color="secondary"
                    :loading="reload.loading"
                    @click="on_reload_click(reload)"
                />
                </q-item-section>
            </q-item>
        </q-list>
        <q-list
            v-if="groups && groups.length"
            class="q-pl-sm q-mb-lg q-mt-md"
            bordered
            separator
        >
            <q-item-label class="text-weight-bold" header>
                <q-icon name="storage" /> {{ $t("label.group") }}
                <q-btn
                    icon="refresh"
                    flat
                    dense
                    class="q-ml-md"
                    size="sm"
                    @click="get_group_list"
                >
                </q-btn>
            </q-item-label>
            <q-item v-for="(group, index) in groups" :key="index" clickable>
                <q-separator />
                <q-item-section>
                    <q-item-label>
                        <span class="text-weight-bold">{{ group.name }}</span> ({{ -1 === group.size ? "Unlimited" : group.size + " / " + group.limit}})
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-btn
                        v-if="-1 !== group.size"
                        icon="delete"
                        :label="$t('label.delete')"
                        no-caps
                        color="negative"
                        :loading="group.loading"
                        @click="on_group_clear_click(group)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
  
<script>
import { ref } from "vue";
import { util } from "src/scripts/util";
import { api } from "src/scripts/api";
import { uix } from "src/scripts/uix";

export default {
    setup() {
        return {
            reloads: ref([]),
            groups: ref([]),
        };
    },
    created() {
        let self = this;
        self.get_reload_options();
        self.get_group_list();
    },
    methods: {
        get_reload_options() {
            let self = this;
            api.call({
                path: "/reload/options",
                onSuccess(data) {
                    if (util.isArray(data)) {
                        self.reloads = data;
                    }
                },
            });
        },
        on_reload_click(reload) {
            uix.confirm(function () {
                reload.loading = true;
                api.call({
                path: "/reload" + reload.path,
                method: "post",
                onFinish() {
                    reload.loading = false;
                },
                onSuccess(data) {
                    if (true === data) {
                        uix.alert("label.success_reload", reload.title);
                    } else {
                        uix.alert("label.reloading_by_other", reload.title);
                    }
                },
                });
            }, "confirm.continue");
        },
        get_group_list() {
            let self = this;
            api.call({
                path: "/cache/groups",
                onSuccess(data) {
                    if (util.isArray(data)) {
                        self.groups = data;
                    }
                },
            });
        },
        on_group_clear_click(group) {
            let self = this;
            uix.confirm(function () {
                group.loading = true;
                api.call({
                    path: "/cache/clear",
                    method: "delete",
                    params: {
                        group: group.name + "",
                    },
                    onFinish() {
                        group.loading = false;
                    },
                    onSuccess(data) {
                        self.get_group_list();
                    },
                });
            }, "confirm.delete");
        },
    },
};
</script>
  
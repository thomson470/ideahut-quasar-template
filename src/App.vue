<template>
    <router-view v-if="initialized" />
</template>

<script>
import { ref, defineComponent } from "vue";
import { msg } from "src/scripts/msg";
import { uix } from "src/scripts/uix";

export default defineComponent({
    name: "App",
    setup() {
        return {
            initialized: ref(false),
        };
    },
    created() {
        let self = this;
        self.initialized = false;
        uix.loader.show("Loading...");
        msg.load(function () {
            self.initialized = true;
            uix.loader.hide();
        });
    },
});
</script>
  
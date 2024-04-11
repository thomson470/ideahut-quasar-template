import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import { msg } from 'src/scripts/msg';
import { storage } from "src/scripts/storage";

export default boot(({ app }) => {
    let locale = storage.language();
    const i18n = createI18n({locale: locale});
    msg.i18n(i18n);
  
    // Set i18n instance on app
    app.use(i18n);
  });

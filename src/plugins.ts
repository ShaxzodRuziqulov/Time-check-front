import "vue-toastification/dist/index.css";

import { App } from "vue";
import Toast from "vue-toastification";
import CommonToast from "@/components/CToast.vue";
import { createPinia } from "pinia";

export default function definePlugins(app: App): App {
  const pinia = createPinia();
  const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: true,
    icon: true,
    rtl: false,
    maxToasts: 1,
    newestOnTop: true,
    component: CommonToast,
  };
  app.use(pinia);
  app.use(Toast, options);
  return app;
}

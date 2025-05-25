import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "雨人部落格",
      description: "个人分享",
    },
    "/en/": {
      lang: "en-US",
      title: "Rain Man Blog",
      description: "Personal sharing",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

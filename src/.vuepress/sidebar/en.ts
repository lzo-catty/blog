import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/en/": [
    "",
    {
      text: "Posts",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
  ],
});

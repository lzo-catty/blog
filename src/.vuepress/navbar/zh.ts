import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "博文",
    icon: "pen-to-square",
    children: [
      { text: "系统设计", icon: "pen-to-square", link: "/posts/system-design/README.md" },
      { text: "日语", icon: "pen-to-square", link: "/posts/japanese/README.md" },
      { text: "网络安全", icon: "pen-to-square", link: "/posts/network-security/README.md" },
      { text: "AI", icon: "pen-to-square", link: "/posts/ai/README.md" },
      { text: "DevOps", icon: "pen-to-square", link: "/posts/devops/README.md" },
    ],
  }
]);

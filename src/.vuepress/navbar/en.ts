import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/en/",
  {
    text: "Posts",
    icon: "pen-to-square",
    prefix: "/en/posts/",
    children: [
      { text: "System Design", icon: "pen-to-square", link: "/en/posts/system-design/README.md" },
      { text: "Japanese", icon: "pen-to-square", link: "/en/posts/japanese/README.md" },
      { text: "Network Security", icon: "pen-to-square", link: "/en/posts/network-security/README.md" }
    ],
  }
]);

import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeColor: {
      bgColor: 'white',
      textColor: 'black',
      navBgColor: '#f8f9fa',
    }
  }),
  actions: {
    setTheme(theme) {
      let themeColors;
      switch(theme) {
        case "sun":
          themeColors = { bgColor: "#f9f9f9", textColor: "black", navBgColor: "#f8f9fa" };
          break;
        case "dark":
          themeColors = { bgColor: "#333", textColor: "white", navBgColor: "#555" };
          break;
        default:
          themeColors = { bgColor: "white", textColor: "black", navBgColor: "#f8f9fa" };
          break;
      }

      this.themeColor = themeColors;
      document.documentElement.style.setProperty('--theme-bg-color', themeColors.bgColor);
      document.documentElement.style.setProperty('--theme-text-color', themeColors.textColor);
      document.documentElement.style.setProperty('--theme-nav-bg-color', themeColors.navBgColor);
    }
  }
});
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeColor: {
      bgColor: '#f9f9f9',
      textColor: 'black',
      navBgColor: '#f8f9fa',
      cardBgColor: 'white',
      cardTextColor: 'black'
    }
  }),
  actions: {
    setTheme(theme) {
      let themeColors;
      switch(theme) {
        case "sun":
          themeColors = {
            bgColor: "rgba(255, 255, 255, 0.58)",
            textColor: "black",
            navBgColor: "#f8f9fa",
            cardBgColor: "white",
            cardTextColor: "black"
          };
          break;
        case "dark":
          themeColors = {
            bgColor: "#333",
            textColor: "white",
            navBgColor: "#555",
            cardBgColor: "#444",
            cardTextColor: "white",
            
            
          };
          break;
        default:
          themeColors = {
            bgColor: "white",
            textColor: "black",
            navBgColor: "#f8f9fa",
            cardBgColor: "white",
            cardTextColor: "black"
          };
          break;
      }

      this.themeColor = themeColors;
      document.documentElement.style.setProperty('--theme-bg-color', themeColors.bgColor);
      document.documentElement.style.setProperty('--theme-text-color', themeColors.textColor);
      document.documentElement.style.setProperty('--theme-nav-bg-color', themeColors.navBgColor);
      document.documentElement.style.setProperty('--theme-card-bg-color', themeColors.cardBgColor);
      document.documentElement.style.setProperty('--theme-card-text-color', themeColors.cardTextColor);
    }
  }
});

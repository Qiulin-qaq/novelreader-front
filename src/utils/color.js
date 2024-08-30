// utils/color.js
export const changeThemeColor = (theme) => {
  let bgColor, textColor, navBgColor;

  switch(theme) {
      case "sun":
          bgColor = "white";
          textColor = "black";
          navBgColor = "#f8f9fa";
          break;
      case "dark":
          bgColor = "#333";
          textColor = "white";
          navBgColor = "#555";
          break;
      case "blue":
          bgColor = "#1E90FF";
          textColor = "white";
          navBgColor = "#1C6EA4";
          break;
      default:
          bgColor = "white";
          textColor = "black";
          navBgColor = "#f8f9fa";
          break;
  }

  document.documentElement.style.setProperty('--theme-bg-color', bgColor);
  document.documentElement.style.setProperty('--theme-text-color', textColor);
  document.documentElement.style.setProperty('--theme-nav-bg-color', navBgColor);
};

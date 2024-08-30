const changeFontSize = (size) => {
    let fontSizeValue;
    switch(size) {
      case 'large':
        fontSizeValue = '20px';
        break;
      case 'medium':
        fontSizeValue = '16px';
        break;
      case 'small':
        fontSizeValue = '12px';
        break;
      default:
        fontSizeValue = '16px';
    }
    document.documentElement.style.setProperty('--font-size', fontSizeValue)
  }
  
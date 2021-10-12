(function () {

    // Grab body node
    const bodyNode = document.querySelector('body');
  
    // Replace the styles with the glow theme
    const initNeonDreams = (disableGlow, obs) => {
      var themeStyleTag = document.querySelector('.vscode-tokens-styles');
  
      if (!themeStyleTag) {
        return;
      }
  
      var initialThemeStyles = themeStyleTag.innerText;
      
      var updatedThemeStyles = initialThemeStyles;

      updatedThemeStyles = `${updatedThemeStyles}[APPENDS]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute("id", "neon-scrollbar");
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
    document.body.appendChild(newStyleTag);
    
    console.log('NeonScrollbar \'enabled!');
    
        // disconnect the observer because we don't need it anymore
        if (obs) {
        obs.disconnect();
        }
    };
  // Callback function to execute when mutations are observed
  const watchForBootstrap = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          // does the style div exist yet?
          const tokensLoaded = document.querySelector('.vscode-tokens-styles');
          // does it have content ?
          const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

          // sometimes VS code takes a while to init the styles content, so stop this observer and add an observer for that
          if (tokensLoaded) {
            observer.disconnect();
            observer.observe(tokensLoaded, { childList: true });
          }
        }
        if (mutation.type === 'childList') {
          const tokensLoaded = document.querySelector('.vscode-tokens-styles');
          const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

          // Everything we need is ready, so initialise
          if (tokensLoaded && tokenStyles) {
              initNeonDreams(false, observer);
          }
        }
    }
};
    // try to initialise the theme
    initNeonDreams(false);

    // Use a mutation observer to check when we can bootstrap the theme
    const observer = new MutationObserver(watchForBootstrap);
    observer.observe(bodyNode, { attributes: true });
})();

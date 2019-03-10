
var createPauseScene = function(sceneToReturnTo, screenWidth, screenHeight) {
  return {
    handleUserInput: function(pressedKeys, pressedThisFrame) {
      for (let key of pressedThisFrame) {
        if (key == 'p') {
          switchToNewScene(sceneToReturnTo);
        }
      }
    },
    updateModel: function() { },
    drawToScreen: function(g) {
      sceneToReturnTo.drawToScreen(g);
      
      g.drawRectangle(0, 0, screenWidth, screenHeight, '#000000', .5);
    }
  };
};

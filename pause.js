
var createPauseScene = function(sceneToReturnTo) {
	return {
		handleUserInput: function(pressedKeys, pressedThisFrame) {
			for (let key of pressedThisFrame) {
				if (key == 'p') {
					currentScene = sceneToReturnTo;
				}
			}
		},
		updateModel: function() { },
		drawToScreen: function(g) {
			sceneToReturnTo.drawToScreen(g);
			
			g.drawRectangle(0, 0, canvas.width, canvas.height, '#000000', .5);
		}
	};
};

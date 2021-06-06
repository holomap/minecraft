(function() {

	var imX = 10;
	var imY = 10;
	var exp = 180;

	// ----------
	var $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.saveImage = function() {
		var self = this;

		let saveButton = new OpenSeadragon.Button({
			tooltip:  'Image',
			srcRest:  'images/image_rest.png',
			srcGroup: 'images/image_grouphover.png',
			srcHover: 'images/image_hover.png',
			srcDown:  'images/image_pressed.png',
			onClick: saveBlob
		});
		//self.addControl(pointerButton.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
		self.buttons.buttons.push(saveButton);
		self.buttons.element.appendChild(saveButton.element);

		function saveBlob(){
			Canvas = self.drawer.canvas;
			Canvas.toBlob(function(blob) {
				const now = new Date();
				const stamp = now.getFullYear()  + 
					("00"+(now.getMonth()+1)).slice(-2)+ 
					("00"+(now.getDate())).slice(-2)+ 
					("00"+(now.getHours())).slice(-2)+ 
					("00"+(now.getMinutes())).slice(-2)+ 
					("00"+(now.getSeconds())).slice(-2);
				saveAs(blob, "2434map."+stamp+".png");
			});
		};

	};
})();
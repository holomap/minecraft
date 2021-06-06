(function() {

	var zeroX = 3072;
	var zeroY = 7168;


	// ----------
	var $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.nav = function(c) {
		var self = this;

		var n = document.createElement('nav');
		n.innerHTML += '<img src="images/center.gif">';

		self.addControl(n, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });

		var p = document.createElement('div');
		p.setAttribute('id', 'position');
		p.innerHTML += '';
		self.addControl(p, { anchor: OpenSeadragon.ControlAnchor.BOTTOM_RIGHT });


		var tracker = new OpenSeadragon.MouseTracker({
			element: self.container, 
			moveHandler: function(event) {
				var webPoint = event.position;
				var viewportPoint = self.viewport.pointFromPixel(webPoint);
				var imagePoint = self.viewport.viewportToImageCoordinates(viewportPoint);

				const positionEl = document.getElementById("position");
				positionEl.innerHTML = 'X:' + Math.floor((imagePoint.x-zeroX)/8) + ' Z:' + Math.floor((imagePoint.y-zeroY)/8) + '&nbsp;&nbsp;&nbsp;';

			}
		});
		tracker.setTracking(true);




	};
})();
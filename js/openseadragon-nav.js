(function() {

	// ----------
	var $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.nav = function(zx, zy, scale) {
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
				if (self.world.getItemCount() <= 0) return;
				var imagePoint = self.world.getItemAt(0).viewportToImageCoordinates(viewportPoint);

				const positionEl = document.getElementById("position");
				positionEl.innerHTML = 'X:' + Math.floor((imagePoint.x-zx)/scale) + ' Z:' + Math.floor((imagePoint.y-zy)/scale) + '&nbsp;&nbsp;&nbsp;';

			}
		});
		tracker.setTracking(true);

	};

})();
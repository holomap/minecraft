(function() {

	// ----------
	const $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.nav = function() {
		const self = this;
		const zx = self.map_origin.x;
		const zy = self.map_origin.y;
		const scale = self.map_scale;

		const n = document.createElement('nav');
		n.innerHTML += '<img src="images/center.gif">';
		self.addControl(n, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });

		const p = document.createElement('div');
		const p2 = document.createElement('div');
		p2.setAttribute('id', 'position');
		p.appendChild(p2);
		self.addControl(p, { anchor: OpenSeadragon.ControlAnchor.BOTTOM_RIGHT });

		var tracker = new OpenSeadragon.MouseTracker({
			element: self.container, 
			moveHandler: function(event) {
				const webPoint = event.position;
				const viewportPoint = self.viewport.pointFromPixel(webPoint);
				if (self.world.getItemCount() <= 0) return;
				const imagePoint = self.world.getItemAt(0).viewportToImageCoordinates(viewportPoint);

				p2.innerText = 'X:' + Math.floor((imagePoint.x-zx)/scale) + ' Z:' + Math.floor((imagePoint.y-zy)/scale);
			}
		});

		tracker.setTracking(true);

	};

})();
(function() {

	// ----------
	let $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.nav = function() {
		const self = this;

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
				const info = self.mapinfo;

				const x = Math.floor((imagePoint.x - info.zx) / info.scale);
				const z = Math.floor((imagePoint.y - info.zy) / info.scale);
				p2.innerText = 'X:' + x + ' Z:' + z;
			}
		});

		tracker.setTracking(true);

	};

})();
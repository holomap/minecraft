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

		addCrosshair(self);
		addCoordNav(self);
	};

	function addCrosshair(self) {
		const n = document.createElement('nav');
		n.innerHTML += '<img src="images/center.gif">';
		self.addControl(n, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
	}

	function addCoordNav(self) {
		const p = document.createElement('div');
		const p2 = document.createElement('div');
		p2.id = 'position';
		p.appendChild(p2);
		self.addControl(p, { anchor: OpenSeadragon.ControlAnchor.BOTTOM_RIGHT });

		const tracker = new OpenSeadragon.MouseTracker({
			element: self.container, 
			moveHandler: function(event) {
				if (self.world.getItemCount() <= 1) return;

				const webPoint = event.position;
				const viewportPoint = self.viewport.pointFromPixel(webPoint);
				const layer = self.world.getItemAt(1);
				const imagePoint = layer.viewportToImageCoordinates(viewportPoint);
				const rect = layer.source.rect;

				const x = Math.floor(imagePoint.x / rect.scale + rect.x);
				const z = Math.floor(imagePoint.y / rect.scale + rect.z);
				p2.innerText = 'X:' + x + ' Z:' + z;
			}
		});

		tracker.setTracking(true);
	}

})();
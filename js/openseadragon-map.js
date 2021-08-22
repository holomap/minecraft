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
	$.Viewer.prototype.setupMapInfo = function(vw, vh, zx, zy, scale) {
		const self = this;

		self.map_size = new $.Rect(0, 0, vw, vh);
		self.map_origin = new $.Point(zx, zy);
		self.map_scale = scale;

	};

	// ----------
	$.Viewer.prototype.getZoomFactor = function() {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = self.viewport.getZoom();
		const factor = zoom * csize.x / self.map_size.width;
		return factor;
	};

	// ----------
	$.Viewer.prototype.setZoomFactor = function(factor, immediately) {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = factor * self.map_size.width / csize.x;
		self.viewport.zoomTo(zoom, null, immediately);
	};

})();
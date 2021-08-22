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
	$.Viewer.prototype.setupMapInfo = function(mapinfo) {
		const self = this;

		self.mapinfo = mapinfo;

	};

	// ----------
	$.Viewer.prototype.getZoomFactor = function() {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = self.viewport.getZoom();
		const factor = zoom * csize.x / self.mapinfo.vw;
		return factor;
	};

	// ----------
	$.Viewer.prototype.setZoomFactor = function(factor, immediately) {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = factor * self.mapinfo.vw / csize.x;
		self.viewport.zoomTo(zoom, null, immediately);
	};

})();
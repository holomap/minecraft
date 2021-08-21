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

})();
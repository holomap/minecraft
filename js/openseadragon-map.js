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

		const initBaseImage = function (data) {
			const layer = data.item;
			if (layer.source.id == "base") {
				layer.source.info = mapinfo,
				self.world.removeHandler("add-item", initBaseImage);
			}
		};
		self.world.addHandler("add-item", initBaseImage);
	};

	// ----------
	$.Viewer.prototype.addTiledMap = function(id, info, src) {
		const self = this;
		const base = self.mapinfo;

		self.addTiledImage({
			index: src.index,
			tileSource: {
				id: id,
				info: info,
				minLevel: src.minLevel,
				maxLevel: src.maxLevel,
				Image: {
					xmlns: "http://schemas.microsoft.com/deepzoom/2008",
					Url: src.url,
					Format: src.format,
					TileSize: src.tileSize,
					Overlap: src.overlap,
					minLevel: src.minLevel,
					maxLevel: src.maxLevel,
					Size: {
						Width: info.vw,
						Height: info.vh,
					},
				},
			},
			width: (info.vw / info.scale) / (base.vw / base.scale),
			x: ((base.zx / base.scale) - (info.zx / info.scale)) / (base.vw / base.scale),
			y: ((base.zy / base.scale) - (info.zy / info.scale)) / (base.vw / base.scale), // not base.vh
		});
	};

	// ----------
	$.Viewer.prototype.addSingleMap = function(id, info, src) {
		const self = this;
		const base = self.mapinfo;
		
		self.addTiledImage({
			index: src.index,
			tileSource: new OpenSeadragon.ImageTileSource({
				id: id,
				url: src.url,
				info: info,
			}),
			width: (info.vw / info.scale) / (base.vw / base.scale),
			x: ((base.zx / base.scale) - (info.zx / info.scale)) / (base.vw / base.scale),
			y: ((base.zy / base.scale) - (info.zy / info.scale)) / (base.vw / base.scale), // not base.vh
		});
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
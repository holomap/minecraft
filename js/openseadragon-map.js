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
		self.layers = new Map();

		const initBaseImage = function (data) {
			const layer = data.item;
			if (layer.source.id == "base") {
				layer.source.info = mapinfo,
				self.world.removeHandler("add-item", initBaseImage);
			}
		};
		self.world.addHandler("add-item", initBaseImage);

		const initLayer = function (data) {
			const layer = data.item;
			const id = layer.source.id;
			if (!id) return;
			
			self.layers.set(id, layer);
			
			layer.on = layer.source.visible;
			if (layer.on === undefined) layer.on = true;

			layer.default_opacity = layer.source.opacity || 1;

			self.showLayer(id, layer.on)
		};
		self.world.addHandler("add-item", initLayer);
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
				visible: src.visible,
				opacity: src.opacity,
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
				visible: src.visible,
				opacity: src.opacity,
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

	// ----------
	$.Viewer.prototype.addMapSwitcher = function(items, onchange) {
		const self = this;

		const nav = document.createElement('div');
		nav.id = "layerlist";
		const wrap = document.createElement('div');
		nav.appendChild(wrap);

		const list = document.createElement('ul');
		wrap.appendChild(list);

		items.forEach(function(item) {
			const name = item[0];
			const li = document.createElement('li');
			const label = document.createElement('label');
			const input = document.createElement('input');
			input.name = name;
			input.type = "checkbox";
			input.checked = item[2];
			const text = document.createTextNode(" "+item[1]);
			label.appendChild(input);
			label.appendChild(text);
			li.appendChild(label);
			list.appendChild(li);

			if (onchange) {
				input.addEventListener("change", function(e) {
					onchange(name, e.target.checked);
				});
			}
		});

		self.addControl(nav, { anchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT });
	}

	// ----------
	$.Viewer.prototype.getLayer = function(id) {
		const self = this;
		return self.layers.get(id);
	};

	// ----------
	$.Viewer.prototype.showLayer = function(id, show) {
		const self = this;
		const layer = self.layers.get(id)
		layer.on = !!show;
		layer.setOpacity((layer.on ? layer.default_opacity : 0));
	};

})();
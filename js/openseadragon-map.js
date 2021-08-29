(function() {

	// ----------
	let $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	$.MapRect = function(width, height, x, z, scale) {
		// the size of rect in blocks
		this.w = width;
		this.h = height;
		// the coordinates of north-east corner
		this.x = x;
		this.z = z;
		// the number of pixels for 1 block in the image
		this.scale = scale;
		this.iw = this.w * this.scale;
		this.ih = this.h * this.scale;
	};

	// ----------
	$.Viewer.prototype.setupMapInfo = function(maprect) {
		const self = this;

		self.maprect = maprect;
		self.layers = new Map();

		const initBaseImage = function (data) {
			const layer = data.item;
			if (layer.source.id == "base") {
				layer.source.rect = maprect,
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
	$.Viewer.prototype.addTiledMap = function(src) {
		const self = this;
		const base = self.maprect;
		const rect = src.rect;

		self.addTiledImage({
			index: src.index,
			tileSource: {
				id: src.id,
				rect: src.rect,
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
						Width: rect.iw,
						Height: rect.ih,
					},
				},
			},
			width: (rect.w / base.w),
			x: ((rect.x - base.x) / base.w),
			y: ((rect.z - base.z) / base.w), // not base.h
		});
	};

	// ----------
	$.Viewer.prototype.addSingleMap = function(src) {
		const self = this;
		const base = self.maprect;
		const rect = src.rect;
		
		self.addTiledImage({
			index: src.index,
			tileSource: new OpenSeadragon.ImageTileSource({
				id: src.id,
				url: src.url,
				rect: src.rect,
				visible: src.visible,
				opacity: src.opacity,
			}),
			width: (rect.w / base.w),
			x: ((rect.x - base.x) / base.w),
			y: ((rect.z - base.z) / base.w), // not base.h
		});
	};

	// ----------
	$.Viewer.prototype.getZoomFactor = function() {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = self.viewport.getZoom();
		const factor = zoom * csize.x / self.maprect.w;
		return factor;
	};

	// ----------
	$.Viewer.prototype.setZoomFactor = function(factor, immediately) {
		const self = this;
		const csize = self.viewport.getContainerSize();
		const zoom = factor * self.maprect.w / csize.x;
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
		if (!layer) return;
		layer.on = !!show;
		layer.setOpacity((layer.on ? layer.default_opacity : 0));
	};

})();
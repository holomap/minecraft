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
	$.Viewer.prototype.markerLink = function(threshold) {
		const self = this;
		const exp = 180;
		const scale = self.mapinfo.scale;

		self.marker_elems = [];
		self.marker_enabled = true;
		self.marker_threshold = threshold;
		self.marker_lastchanged = 0;

		const cookie = jQuery.cookie('marker');
		self.marker_enabled = (cookie === undefined || cookie == "1");
		jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		
		self.marker_onclick = function onMarker(e) {
			const target = e.originalEvent.target;
			if (target.matches('a') && target.href) {
				if (target.target == '_blank')
					window.open(target.href);
				else
					location.href = target.href;
			}
		};

		// 変化検知
		self.activateImagingHelper({
			onImageViewChanged: function(event) {
				const now = (new Date()).getTime();
				if (now < self.marker_lastchanged + 150) return;
				self.marker_lastchanged = now;
				self.updateMarkers();
			},
		});

		const markerButton = new OpenSeadragon.Button({
			tooltip:  'Marker',
			srcRest:  'images/marker_rest.png',
			srcGroup: 'images/marker_grouphover.png',
			srcHover: 'images/marker_hover.png',
			srcDown:  'images/marker_pressed.png',
			onClick: toggleMarker
		});
		//self.addControl(markerButton.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
		self.buttons.buttons.push(markerButton);
		self.buttons.element.appendChild(markerButton.element);

		function toggleMarker() {
			self.marker_enabled = !self.marker_enabled;
			self.element.classList.toggle("marker-disabled", !self.marker_enabled);
			self.updateMarkers();
			jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		}
		
	}

	// ----------
	$.Viewer.prototype.addMarkers = function(marker) {
		const self = this;
		const info = self.mapinfo;

		marker.forEach(function(row) {
			const icon = document.createElement("a");
			const id = "marker-" + self.marker_elems.length;
			
			icon.id = id;
			icon.className = "marker";
			icon.classList.add(row[3]);
			icon.setAttribute("title", row[2]);
			if (row[5]) {
				icon.href = row[5];
				icon.target = "_blank";
			}
			icon.dataset.group = row[4];
			icon.dataset.on = "0";

			self.marker_elems.push(icon);

			self.addOverlay({
				id: id,
				element: icon,
				x: (info.zx + ((row[0]-0) + 0.5) * info.scale) / info.vw,
				y: (info.zy + ((row[1]-0) + 0.5) * info.scale) / info.vw, // not vh
				placement: $.Placement.CENTER,
				checkResize: false,
			});

			new OpenSeadragon.MouseTracker({element: icon, clickHandler: self.marker_onclick});
		});

		self.updateMarkers();

	};

	// ----------
	$.Viewer.prototype.updateMarkers = function() {
		const self = this;
		const threshold = self.marker_threshold;

		if (self.marker_enabled) {
			const zoom = self.getZoomFactor();
			self.marker_elems.forEach(function(e) {
				const show = (zoom > threshold && e.dataset.on == "1");
				e.style.display = (show ? "block" : "none");
			});
		}
	};

	// ----------
	$.Viewer.prototype.showMarkers = function(group, show) {
		const self = this;

		self.marker_elems.forEach(function(e) {
			if (!group || e.dataset.group == group) {
				e.dataset.on = (show ? "1" : "0");
			}
		});

		self.updateMarkers();
	};

})();

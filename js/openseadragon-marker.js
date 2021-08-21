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
		const scale = self.map_scale;

		self.marker_elems = [];
		self.marker_enabled = true;
		self.marker_visible = true;
		self.marker_lastchanged = 0;

		self.marker_update = () => {
			if (self.marker_enabled && self.imagingHelper.getZoomFactor() > threshold/scale) {
				if (!self.marker_visible) {
					jQuery(self.marker_elems).css('display', 'block');
					self.marker_visible = true;
				}
			} else {
				if (self.marker_visible) {
					jQuery(self.marker_elems).css('display', 'none');
					self.marker_visible = false;
				}
			}
		};

		const cookie = jQuery.cookie('marker');
		self.marker_enabled = (cookie === undefined || cookie == "1");
		jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		
		self.marker_onclick = function onMarker(e) {
			const target = e.originalEvent.target;
			if (target.matches('a') && target.getAttribute('href')!="") {
				if (target.getAttribute('target') === '_blank')
					window.open(target.getAttribute('href'));
				else
					location.href = target.getAttribute('href');
			}
		};

		// 変化検知
		self.activateImagingHelper({
			onImageViewChanged(event) {
				const now = (new Date()).getTime();
				if (now < self.marker_lastchanged + 150) return;
				self.marker_lastchanged = now;
				self.marker_update();
			}
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
			self.marker_update();
			jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		}
		
	}

	// ----------
	$.Viewer.prototype.addMarkers = function(marker, size) {
		const self = this;
		const vw = self.map_size.width;
		const vh = self.map_size.height;
		const zx = self.map_origin.x;
		const zy = self.map_origin.y;
		const scale = self.map_scale;
		const mh = size;
		const mw = size;

		marker.forEach((row) => {
			const icon = document.createElement("a");
			const id = "marker-" + self.marker_elems.length;
			
			icon.id = id;
			icon.className = "marker";
			icon.setAttribute("href", row[3]);
			icon.setAttribute("title", row[2]);
			icon.setAttribute("target", "_blank");
			icon.style.width = mw+"px";
			icon.style.height = mh+"px";
			icon.style.display = (self.marker_visible ? "block" : "none");

			self.marker_elems.push(icon);

			self.addOverlay({
				id: id,
				element: icon,
				x: (zx + ((row[0]-0) + 0.5) * scale) / vw,
				y: (zy + ((row[1]-0) + 0.5) * scale) / vw, // not vh
				placement: $.Placement.CENTER,
				checkResize: false,
			});
			
			new OpenSeadragon.MouseTracker({element: icon, clickHandler: self.marker_onclick});
		});

		self.marker_update();

	};

})();

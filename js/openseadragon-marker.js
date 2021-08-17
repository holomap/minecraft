(function() {

	// ----------
	var $ = window.OpenSeadragon;

	if (!$) {
		$ = require('openseadragon');
		if (!$) {
			throw new Error('OpenSeadragon is missing.');
		}
	}

	// ----------
	$.Viewer.prototype.markerLink = function(marker, vw, vh, zx, zy, scale, threshold) {
		var self = this;
		var mh = 36;
		var mw = 36;
		var exp = 180;

		let init_required = false;
		if (!self.marker_elems) {
			self.marker_elems = [];
			self.marker_enabled = true;
			self.marker_visible = true;
			self.marker_lastchanged = 0;
			init_required = true;
		}

		const updateVisibility = () => {
			if (self.marker_enabled && self.imagingHelper.getZoomFactor() > threshold) {
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

		var cookie = jQuery.cookie('marker');
		self.marker_enabled = (cookie === undefined || cookie == "1");
		jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		
		marker.forEach((row) => {
			const icon = document.createElement("a");
			const id = "marker-" + self.marker_elems.length;
			
			icon.id = id;
			icon.className = "marker";
			icon.setAttribute("href",row[3]);
			icon.setAttribute("title",row[2]);
			icon.setAttribute("target","_blank");
			icon.style.width = mw+"px";
			icon.style.height = mh+"px";

			self.marker_elems.push(icon);
			self.addOverlay({
				id: id,
				element: icon,
				x: (zx + ((row[0]-0) + 0.5) * scale) / vw,
				y: (zy + ((row[1]-0) + 0.5) * scale) / vw, // not vh
				placement: $.Placement.CENTER,
				checkResize: false,
			});
			
			new OpenSeadragon.MouseTracker({element: icon, clickHandler: onMarker});
		});

		function onMarker(e){
			var target = e.originalEvent.target;
			if (target.matches('a') && target.getAttribute('href')!="") {
				if (target.getAttribute('target') === '_blank')
					window.open(target.getAttribute('href'));
				else
					location.href = target.getAttribute('href');
			}
		}

		if (init_required) {
			// 変化検知
			self.activateImagingHelper({
				onImageViewChanged(event) {
					var now = (new Date()).getTime();
					if (now < self.marker_lastchanged + 150) return;
					self.marker_lastchanged = now;
					updateVisibility();
				}
			});

			let markerButton = new OpenSeadragon.Button({
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

			function toggleMarker(){
				self.marker_enabled = !self.marker_enabled;
				updateVisibility();
				jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
			}
			//console.dir(self.viewport); 
			//console.log(self.viewport.getZoom);
		}

		updateVisibility();

	}

})();

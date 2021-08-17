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
	$.Viewer.prototype.markerLink = function(marker, zx, zy, scale, threshold) {
		var self = this;
		var mh = 36;
		var mw = 36;
		var exp = 180;

		if (!self.marker_elems) {
			self.marker_elems = [];
			self.marker_enabled = true;
			self.marker_visible = true;
			self.marker_lastchanged = 0;
		}

		const updateVisibility = () => {
			if (self.marker_enabled && self.imagingHelper.getZoomFactor() > threshold) {
				if (!self.marker_visible) {
					jQuery(self.marker_elems).css('display','block');
					self.marker_visible = true;
				}
			} else {
				if (self.marker_visible) {
					jQuery(self.marker_elems).css('display','none');
					self.marker_visible = false;
				}
			}
		};

		// 変化検知
		var imagingHelper = self.activateImagingHelper({onImageViewChanged: onImageViewChanged});
		function onImageViewChanged(event) {
			var now = (new Date()).getTime();
			if (now < self.marker_lastchanged + 150) return;
			self.marker_lastchanged = now;

			updateVisibility();
		}

		var hEl = self.HTMLelements();
		var M = [];

		var cookie = jQuery.cookie('marker');
		self.marker_enabled = (cookie === undefined || cookie == "1");
		jQuery.cookie('marker', (self.marker_enabled ? "1" : "0"), {expires:exp, path: '/'});
		
		for(var i=0; i<marker.length; i++){
			M[i] = document.createElement("a");
			self.marker_elems.push(M[i]);
			M[i].className = "marker";
			M[i].setAttribute("href",marker[i][3]);
			M[i].setAttribute("title",marker[i][2]);
			M[i].setAttribute("target","_blank");

			hEl.addElement({
				id: "M"+String(i),
				element: M[i],
				x: zx+(Math.abs(marker[i][0])*scale*Math.sign(marker[i][0]))-Math.round(mw/2),
				y: zy+(Math.abs(marker[i][1])*scale*Math.sign(marker[i][1]))-Math.round(mh/2),
				width: mw,
				height: mh
			})
			new OpenSeadragon.MouseTracker({element: M[i], clickHandler: onMarker});
		}

		updateVisibility();

		function onMarker(e){
			var target = e.originalEvent.target;
			if (target.matches('a')&&target.getAttribute('href')!="") {
				if (target.getAttribute('target') === '_blank') window.open(target.getAttribute('href'));
				else location.href = target.getAttribute('href');
			}
		}

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

})();

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
	$.Viewer.prototype.nav = function() {
		const self = this;

		addCrosshair(self);
		addCoordNav(self);
	};

	function addCrosshair(self) {
		const n = document.createElement('nav');
		n.innerHTML += '<img src="images/center.gif">';
		self.addControl(n, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
	}

	function addCoordNav(self) {
		const p = document.createElement('div');

		const tw = document.createElement('div');
		tw.id = 'Twitterlist';
		p.appendChild(tw);

		const twbtn = document.createElement('div');
		twbtn.id = 'Twitterbtn';
		twbtn.innerHTML = '<a href="javascript:/*twitter*/"><i class="fab fa-twitter"></i>Twitter</a>';
		p.appendChild(twbtn);

		const p2 = document.createElement('div');
		p2.id = 'position';
		twbtn.appendChild(p2);
		self.addControl(p, { anchor: OpenSeadragon.ControlAnchor.BOTTOM_RIGHT });

		jQuery("#Twitterbtn").on("click",function() {
			let Twitterto = jQuery('.Twitterto:checked').map(function() {return jQuery(this).val();});
			let twto = "";
			for(let i=0; i<Twitterto.length; i++) twto += "@"+Twitterto[i]+" ";

			let urlhash = location.hash.split('&');
			let urlx = urlz = "";
			for(let i=0; i<urlhash.length; i++) {
				if(!urlhash[i].indexOf("x=")){urlx=urlhash[i].substr(2);}
				if(!urlhash[i].indexOf("z=")){urlz=urlhash[i].substr(2);}
			}
			let twtext = twto+"〇〇〇のホロ鯖座標は、X:"+urlx+" Z:"+urlz+" です。";
			let winurl = "https://twitter.com/intent/tweet?text="+encodeURIComponent(twtext)+"%0D%0A&url="+encodeURIComponent(location.href);
			window.open(winurl, '_blank');
			return false;
		});

		const tracker = new OpenSeadragon.MouseTracker({
			element: self.container, 
			moveHandler: function(event) {
				if (self.world.getItemCount() <= 1) return;

				const webPoint = event.position;
				const viewportPoint = self.viewport.pointFromPixel(webPoint);
				const layer = self.world.getItemAt(1);
				const imagePoint = layer.viewportToImageCoordinates(viewportPoint);
				const rect = layer.source.rect;

				const x = Math.floor(imagePoint.x / rect.scale + rect.x);
				const z = Math.floor(imagePoint.y / rect.scale + rect.z);
				p2.innerText = 'X:' + x + ' Z:' + z;
			}
		});

		tracker.setTracking(true);
	}




})();
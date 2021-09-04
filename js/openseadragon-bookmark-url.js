// OpenSeadragon Bookmark URL plugin 0.0.2
// modified

(function() {

    let $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    const VERSION = 2;

    // ----------
    $.Viewer.prototype.bookmarkUrl = function(conv_old) {
        const self = this;
        const rect = self.maprect;

        let updateTimeout;

        const parseHash = function() {
            const params = {};
            const hash = window.location.hash.replace(/^#/, '');
            if (hash) {
                const parts = hash.split('&');
                parts.forEach(function(part) {
                    const subparts = part.split('=');
                    const key = subparts[0];
                    const value = subparts[1];
                    params[key] = value;
                });

                const ver = parseInt(params.v);

                if (isNaN(ver)) {
                    params.v = 1;
                } else {
                    params.v = ver;
                }

                // up to v2
                if (params.v <= 2) {
                    const y = parseFloat(params.y);
                    if (params.z === undefined) {
                        params.z = params.y;
                    }
                }

                const zoom = parseFloat(params.zoom);
                const x = parseFloat(params.x);
                const z = parseFloat(params.z);

                if (isNaN(zoom)) {
                    delete params.zoom;
                } else {
                    params.zoom = zoom;
                }
                if (isNaN(x) || isNaN(z)) {
                    console.error('bad hash param', part);
                    delete params.x;
                    delete params.z;
                    delete params.zoom;
                } else {
                    params.x = x;
                    params.z = z;
                    if (!params.zoom) {
                        params.zoom = 4;
                    }
                }

                // v1 to v2
                if (params.v < 2) {
                    if (conv_old) {
                        conv_old(params);
                    }
                }
            }

            return params;
        };

        const updateUrl = function() {
            // We only update once it's settled, so we're not constantly flashing the URL.
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
                const zoom = self.getZoomFactor().toPrecision(2);
                const pan = self.viewport.getCenter();
                const x = Math.round(pan.x * rect.w + rect.x);
                const z = Math.round(pan.y * rect.w + rect.z); // not rect.h
                const url = location.pathname + '#v=' + VERSION + '&zoom=' + zoom + '&x=' + x + '&z=' + z;
                history.replaceState({}, '', url);
            }, 100);
        };

        const useParams = function(params) {
            if (params.zoom !== undefined) {
                self.setZoomFactor(params.zoom, true);
            }

            if (params.x !== undefined && params.z !== undefined) {
                const x = (params.x - rect.x) / rect.w;
                const y = (params.z - rect.z) / rect.w; // not rect.h
                self.viewport.panTo(new $.Point(x, y), true);
            }
        };

        var params = parseHash();

        if (this.world.getItemCount() === 0) {
            this.addOnceHandler('open', function() {
                useParams(params);
            });
        } else {
            useParams(params);
        }

        this.addHandler('zoom', updateUrl);
        this.addHandler('pan', updateUrl);

        // Note that out own replaceState calls don't trigger hashchange events, so this is only if
        // the user has modified the URL (by pasting one in, for instance).
        window.addEventListener('hashchange', function() {
            useParams(parseHash());
        }, false);
    };

})();

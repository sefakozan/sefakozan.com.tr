// Mobile navigation: at narrow widths the masthead keeps the three primary
// links inline and moves everything else behind a hamburger that opens a
// full-screen, vertically centred menu. Progressive enhancement — without JS
// the full inline nav stays as it was.
(function () {
	document.documentElement.classList.add("has-js");

	function init() {
		var nav = document.querySelector(".masthead-nav");
		if (!nav) return;

		// The overlay is a clone of the masthead nav, stacked vertically and
		// without the middot separators.
		var overlay = document.createElement("div");
		overlay.className = "nav-overlay";
		overlay.id = "nav-overlay";
		var menu = nav.cloneNode(true);
		menu.className = "nav-menu";
		menu.setAttribute("aria-label", "Menu");
		Array.prototype.forEach.call(menu.querySelectorAll(".nav-dot"), function (dot) {
			dot.remove();
		});
		overlay.appendChild(menu);
		document.body.appendChild(overlay);

		var toggle = document.createElement("button");
		toggle.type = "button";
		toggle.className = "nav-toggle";
		toggle.setAttribute("aria-label", "Menu");
		toggle.setAttribute("aria-expanded", "false");
		toggle.setAttribute("aria-controls", overlay.id);
		toggle.innerHTML =
			'<span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>';
		// sits inline with the primary links, at the end of the nav row
		nav.appendChild(toggle);

		function setOpen(open) {
			document.body.classList.toggle("nav-open", open);
			toggle.setAttribute("aria-expanded", String(open));
			toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
		}

		toggle.addEventListener("click", function () {
			setOpen(!document.body.classList.contains("nav-open"));
		});

		overlay.addEventListener("click", function (event) {
			if (event.target === overlay || event.target.closest("a")) setOpen(false);
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape") setOpen(false);
		});

		// Leaving mobile widths with the menu open would otherwise strand it.
		var wide = window.matchMedia("(min-width: 641px)");
		var onChange = function (event) {
			if (event.matches) setOpen(false);
		};
		if (wide.addEventListener) wide.addEventListener("change", onChange);
		else wide.addListener(onChange);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

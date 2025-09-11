export class DarkslideElement extends HTMLElement {
	constructor(source, {
		theme = 'auto' // light, dark, auto
	}) {
		super();

		this.setAttribute('theme', theme);

		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<style type="text/css">
				:host {
					--bg: #fffe;
					--fg: #000e;
					--gap: 3vw;
					background-color: light-dark(var(--bg), var(--fg));
					color: light-dark(var(--fg), var(--bg));
					display: flex;
					flex-direction: column;
					height: 100vh;
					left: 0;
					opacity: 0;
					padding: var(--gap) var(--gap) 0 var(--gap);
					position: fixed;
					top: 0;
					transition: opacity 0.2s;
					visibility: hidden;
					width: 100vw;
					z-index: 1;
				}
				:host([theme="auto"]) { color-scheme: light dark; }
				:host([theme="dark"]) { color-scheme: dark; }
				:host([theme="light"]) { color-scheme: light; }
				:host(.active) {
					opacity: 1;
					visibility: visible;
				}
				:host img {
					cursor: zoom-out;
					flex-grow: 1;
					height: 100%;
					overflow: auto;
					object-fit: contain;
				}
				:host div {
					display: flex;
					flex-direction: row;
					height: 5rem;
					justify-content: center;
				}
				:host div a {
					cursor: pointer;
					height: 5rem;
					text-align: center;
					width: 5rem;
				}
				:host div svg {
					fill: none;
					height: 5rem;
					stroke-linecap: round;
					stroke-width: 0.4;
					stroke: currentColor;
					width: 2rem;
				}
			</style>
			<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
				<symbol id="close" viewBox="0 0 10 10">
					<path d="m2.5 2.5 5 5" />
					<path d="m2.5 7.5 5 -5" />
				</symbol>
				<symbol id="next" viewBox="0 0 10 10">
					<path d="m2 5 6 0" />
					<path d="m6 3 2 2 -2 2" />
				</symbol>
				<symbol id="previous" viewBox="0 0 10 10">
					<path d="m2 5 6 0" />
					<path d="m4 3 -2 2 2 2" />
				</symbol>
			</svg>
			<img />
			<div>
				<a><svg><use href="#previous"/></svg></a>
				<a><svg><use href="#close"/></svg></a>
				<a><svg><use href="#next"/></svg></a>
			</div>
		`;

		this.index = 0;
		this.image = this.shadowRoot.querySelector('img');
		this.source = source;
		this.touchX = 0;
	}

	connectedCallback() {
		document.addEventListener('keydown', this.handleKeydown.bind(this));

		// Initialize click handling of images.

		Array.from(this.source.querySelectorAll('img')).map((e) => {
			e.onclick = this.toggle.bind(this);
		});

		// Initialize input events of container.

		this.onclick = this.toggle.bind(this);

		this.ontouchstart = (e) => {
			if (e.changedTouches.length > 1) {
				return;
			}
			this.touchX = e.changedTouches[0].clientX;
		};

		this.ontouchend = (e) => {
			if (e.changedTouches.length > 1) {
				return;
			} else if (e.changedTouches[0].clientX - this.touchX > +50) {
				this.previous();
			} else if (e.changedTouches[0].clientX - this.touchX < -50) {
				this.next();
			}
		};

		// Initialize click handl of actions.

		const actions = this.shadowRoot.querySelectorAll('a');

		actions[0].onclick = (e) => {
			e.stopPropagation();
			this.previous();
		}

		actions[1].onclick = (e) => {
			e.stopPropagation();
			this.toggle();
		}

		actions[2].onclick = (e) => {
			e.stopPropagation();
			this.next();
		}
	}

	disconnectedCallback() {
		document.removeEventListener('keydown', this.handleKeydown.bind(this));
	}

	handleKeydown (e) {
		switch (e.keyCode) {
			case 37: this.previous(); break
			case 39: this.next(); break;
			case 27: this.toggle(); break;
			default: break;
		}
	}

	next () {
		this.show(this.current.nextElementSibling ?? this.source.firstElementChild);
	}

	previous () {
		this.show(this.current.previousElementSibling ?? this.source.lastElementChild);
	}

	show (e) {
		this.current = e;
		this.image.src = e.dataset.dsTarget ?? e.src;
	}

	toggle (e) {
		if (e) {
			this.show(e.srcElement);
		}
		this.classList.toggle('active');
	}
}

export function Darkslide(el, options = {}) {
	const instance = new DarkslideElement(el, options);
	document.body.appendChild(instance);
	return instance;
}

customElements.define('x-darkslide', DarkslideElement);

// Add scroll prevention style rule to document once.
const style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule('body:has(x-darkslide.active) { overflow: hidden; }');

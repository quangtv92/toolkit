/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.LazyLoad = new Class({
	Extends: Titon.Component,
	Binds: ['load', 'loadAll'],

	/** Have all elements been force loaded? */
	isLoaded: false,

	/**
	 * Default options.
	 *
	 *	forceLoad		- (bool) Will force all items to load after a delay
	 *	delay			- (int) The delay in milliseconds before items are force loaded
	 *	threshold		- (int) The threshold in pixels to load images outside the viewport
	 *	context			- (element) The element the lazy loading triggers in (defaults window)
	 *	onLoad			- (function) Callback to trigger when the scroll bar loads items
	 *	onLoadAll		- (function) Callback to trigger when all items are loaded
	 *	onShow			- (function) Callback to trigger when an item is shown
	 *	onShutdown		- (function) Callback to trigger when lazy loading is disabled
	 */
	options: {
		forceLoad: false,
		delay: 10000,
		threshold: 150,
		context: null,

		// Events
		onLoad: null,
		onLoadAll: null,
		onShow: null,
		onShutdown: null
	},

	/**
	 * Initialize container events, instantly load() elements in viewport and set force load timeout if option is true.
	 *
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		options = options || {};
		options.multiElement = true;

		this.parent(query, options);

		// Add events
		$(this.options.context || window).addEvents({
			scroll: this.load,
			resize: this.load
		});

		// Load elements within viewport
		window.addEvent('domready', function() {
			this.load();

			// Set force load on DOM ready
			if (this.options.forceLoad) {
				window.setTimeout(this.loadAll, this.options.delay);
			}
		}.bind(this));
	},

	/**
	 * When triggered, will shutdown the instance from executing any longer.
	 * Any container events will be removed and loading will cease.
	 */
	shutdown: function() {
		this.isLoaded = true;

		$(this.options.context || window).removeEvents({
			scroll: this.load,
			resize: this.load
		});

		this.fireEvent('shutdown');
	},

	/**
	 * Loop over the lazy loaded elements and verify they are within the viewport.
	 *
	 * @return {bool}
	 */
	load: function() {
		if (this.isLoaded) {
			return false;
		}

		var elements = $$(this.query);

		if (elements.length === 0) {
			this.shutdown();

			return false;
		}

		elements.each(function(node) {
			if (this.inViewport(node)) {
				this.show(node);
			}
		}, this);

		this.fireEvent('load');

		return true;
	},

	/**
	 * Load the remaining hidden elements and remove any container events.
	 *
	 * @return {bool}
	 */
	loadAll: function() {
		if (this.isLoaded) {
			return false;
		}

		var elements = $$(this.query);

		elements.each(function(node) {
			this.show(node);
		}, this);

		this.fireEvent('loadAll', elements);

		this.shutdown();

		return true;
	},

	/**
	 * Show the element by removing the lazy load class.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		node.removeClass(this.query.remove('.'));

		// Replace src attributes on images
		node.getElements('img').each(function(image) {
			var data = image.get('data-lazyload');

			if (data) {
				image.set('src', data);
			}
		});

		this.fireEvent('show', node);
	},

	/**
	 * Verify that the element is within the current browser viewport.
	 *
	 * @param {Element} node
	 * @return {bool}
	 */
	inViewport: function(node) {
		var threshold = this.options.threshold,
			scrollSize = window.getScroll(),
			windowSize = window.getSize(),
			nodeOffset = node.getPosition();

		return (
			// Below the top
			(nodeOffset.y >= (scrollSize.y - threshold)) &&
			// Above the bottom
			(nodeOffset.y <= (scrollSize.y + windowSize.y + threshold)) &&
			// Right of the left
			(nodeOffset.x >= (scrollSize.x - threshold)) &&
			// Left of the right
			(nodeOffset.x <= (scrollSize.x + windowSize.x + threshold))
		);
	}

});

/**
 * All instances loaded via factory().
 */
Titon.LazyLoad.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} [options]
 * @return {Titon.LazyLoad}
 */
Titon.LazyLoad.factory = function(query, options) {
	if (Titon.LazyLoad.instances[query]) {
		return Titon.LazyLoad.instances[query];
	}

	var instance = new Titon.LazyLoad(query, options);

	Titon.LazyLoad.instances[query] = instance;

	return instance;
};

})();
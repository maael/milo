'use strict';

var ComponentFacet = require('../c_facet')
	, facetsRegistry = require('./cf_registry')	
	, _ = require('mol-proto')
	, check = require('../../util/check')
	, Match = check.Match
	, binder = require('../../binder')
	, BindAttribute = require('../../attribute/a_bind')
	, DomFacetError = require('../../util/error').DomFacet;


// data model connection facet
var Dom = _.createSubclass(ComponentFacet, 'Dom');

_.extendProto(Dom, {
	init: init,
	start: start,

	show: show,
	hide: hide,
	remove: remove,
	append: append,
	prepend: prepend,
	appendChildren: appendChildren,
	prependChildren: prependChildren,
	setStyle: setStyle,

	find: find,
	hasTextBeforeSelection: hasTextBeforeSelection
	// _reattach: _reattachEventsOnElementChange
});

facetsRegistry.add(Dom);

module.exports = Dom;


// initialize Dom facet
function init() {
	ComponentFacet.prototype.init.apply(this, arguments);
}

// start Dom facet
function start() {
	if (this.config.cls)
		this.owner.el.classList.add(this.config.cls);
}

// show HTML element of component
function show() {
	this.owner.el.style.display = 'block';
}

// hide HTML element of component
function hide() {
	this.owner.el.style.display = 'none';
}

function setStyle(property, value) {
	this.owner.el.style[property] = value;
}

// remove HTML element of component
function remove() {
	var thisEl = this.owner.el;
	thisEl.parentNode.removeChild(thisEl);
}

// append inside HTML element of component
function append(el) {
	this.owner.el.appendChild(el)
}

// prepend inside HTML element of component
function prepend(el) {
	var thisEl = this.owner.el
		, firstChild = thisEl.firstChild;
	if (firstChild)
		thisEl.insertBefore(el, firstChild);
	else
		thisEl.appendChild(el);
}

// appends children of element inside this component's element
function appendChildren(el) {
	while(el.childNodes.length)
		this.append(el.childNodes[0]);
}

// prepends children of element inside this component's element
function prependChildren(el) {
	while(el.childNodes.length)
		this.prepend(el.childNodes[el.childNodes.length - 1]);
}

var findDirections = {
	'up': 'previousNode',
	'down': 'nextNode'
};

// Finds component passing optional iterator's test
// in the same scope as the current component (this)
// by traversing DOM tree upwards (direction = "up")
// or downwards (direction = "down")
function find(direction, iterator) {
	if (! findDirections.hasOwnProperty(direction))
		throw new DomFacetError('incorrect find direction: ' + direction);

	var el = this.owner.el
		, scope = this.owner.scope
		, treeWalker = document.createTreeWalker(scope._rootEl, NodeFilter.SHOW_ELEMENT);

	treeWalker.currentNode = el;
	var nextNode = treeWalker[findDirections[direction]]()
		, componentsNames = Object.keys(scope)
		, found = false;

	while (nextNode) {
		var attr = new BindAttribute(nextNode);
		if (attr.node) {
			attr.parse().validate();
			if (scope.hasOwnProperty(attr.compName)) {
				var component = scope[attr.compName];
				if (! iterator || iterator(component)) {
					found = true;
					break;
				}
			}
		}
		treeWalker.currentNode = nextNode;
		nextNode = treeWalker[findDirections[direction]]();
	}

	if (found) return component;
}


// returns true if the element has text before selection
function hasTextBeforeSelection() {
	var selection = window.getSelection();
	if (! selection.isCollapsed) return true;
	if (selection.anchorOffset) return true;

	// walk up the DOM tree to check if there are text nodes before cursor
	var treeWalker = document.createTreeWalker(this.owner.el, NodeFilter.SHOW_TEXT);
	return !! treeWalker.previousNode();
}

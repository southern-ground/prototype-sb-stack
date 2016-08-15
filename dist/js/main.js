(function () {
    'use strict';

    console = window.console || function(){};

    var Sortable = window.Sortable;
    var el = document.querySelector('#SimpleList');
    var sortable = new Sortable(el, {
        group: "stack",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
        // sort: true,  // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        disabled: false, // Disables the sortable if set to true.
        store: null,  // @see Store
        animation: 250,  // ms, animation speed moving items when sorting, `0` — without animation
        // handle: ".my-handle",  // Drag handle selector within list items
        // filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
        draggable: ".list-group-item",  // Specifies which items inside the element should be draggable
        // ghostClass: "sortable-ghost",  // Class name for the drop placeholder
        // chosenClass: "sortable-chosen",  // Class name for the chosen item
        // dataIdAttr: 'data-id',

        // forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
        // fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
        // fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body

        scroll: true, // or HTMLElement
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px

        setData: function (dataTransfer, dragEl) {
            console.log('setData', dataTransfer, dragEl);
            dataTransfer.setData('Text', dragEl.textContent);
        },

        /*// dragging started
        onStart: function (/!**Event*!/evt) {
            // console.log('onStart', evt.oldIndex); // element index within parent
        },*/

        // dragging ended
        onEnd: function (/**Event*/evt) {
            console.log('onEnd', evt.oldIndex, evt.newIndex); // element's new/old index within parent
            console.log(evt);
        }

        /*// Element is dropped into the list from another list
        onAdd: function (/!**Event*!/evt) {
            var itemEl = evt.item;  // dragged HTMLElement
            console.log('onAdd');
            console.log('\titemEl', itemEl);
            console.log('\tfrom', evt.from);
        },*/

        /*// Changed sorting within list
        onUpdate: function (/!**Event*!/evt) {
            console.log('onUpdate');
            var itemEl = evt.item;  // dragged HTMLElement
            console.log('itemEl', itemEl);
        },*/

        /*// Called by any change to the list (add / update / remove)
        onSort: function (/!**Event*!/evt) {
            console.log('onSort', evt);
        },*/

        /*// Element is removed from the list into another list
        onRemove: function (/!**Event*!/evt) {
            console.log('onRemove', evt);
        },*/

        /*// Attempt to drag a filtered element
        onFilter: function (/!**Event*!/evt) {
            console.log('onFilter');
            var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
            console.log('\titemEl', itemEl);
        },*/

        /*// Event when you move an item in the list or between lists
        onMove: function (/!**Event*!/evt) {
            console.log('onMove');
            // Example: http://jsbin.com/tuyafe/1/edit?js,output
            console.log('Dragged', evt.dragged);
            console.log('DraggedRect', evt.draggedRect);
            console.log('Related', evt.related);
            console.log('RelatedRect', evt.relatedRect);
            // return false; — for cancel
        }*/

    });

    console.log(sortable);
})();

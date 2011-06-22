// ==UserScript==
// @name           homegate_notes
// @namespace      http://tpo.sourcepole.ch
// @include        http://www.homegate.ch/kaufen/haus/trefferliste*
// @requires       http://code.jquery.com/jquery-1.5.2.min.js
// @description    Annotate Homegate search results with your notes.
// @author         Tomáš Pospíšek
// @license        BSD
// ==/UserScript==

(function(){

  unsafeWindow.saveComment = function(element,immoID) {
    unsafeWindow.localStorage.setItem(immoID, element.value);
  };

  function extractImmoID(href) {
    // http://www.homegate.ch/kaufen/103596254;HGSESSIONID=ySy7NpLLmRtSYZpjSYkzv...
    return href.match(/http:.*kaufen\/(\d+)/)[1];
  }

  // as soon as the document is loaded add our notes
  window.addEventListener('load', function(event) {
    // Grab a reference to homegate's copy of jQuery
    var jQuery = unsafeWindow['jQuery'];

    //add a note below each immo description
    jQuery('td.tdTitle h2').each(
      function(i,h2) {
        var a, immoID, note, color;

	// grab the link to the immo
        a = jQuery(h2).find('a')[0];

        // attr onclick returns a function!
        immoID = extractImmoID(String(jQuery(a).attr('onclick')));

	// retrieve note from local storage
        note = unsafeWindow.localStorage.getItem(immoID) || "";

	// notes with a 'nix:' prefix get a different color
        if(note.match(/^nix:/)) color="blue";
	else                    color="orange";

	// add our input field with the note
        jQuery("<input style='color:" + color + "'" +
                     " value='" + note + "'" +
                     " onclick='event.cancelBubble = true;'" +
                     " onblur='saveComment(this," + immoID + ");'>").insertAfter(h2);
      }
    );
  }, 'false');

})();

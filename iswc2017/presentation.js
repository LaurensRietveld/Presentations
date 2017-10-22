$(document).ready(function() {
  //draw header stuff. Need to dynamically insert via javascript, because we want the header added once when doing a proper presentation, and we want to add the header to all pages when exporting to pdf
  var header =
    '<div class="bottomBar">' +
    '<img class="vuLogo" src="imgs/VU.png"</div>' +
    '<img class="triplyLogo" src="imgs/triply.png">' +
    "</div>";
  if (window.location.search.match(/print-pdf/gi)) {
    $("section:not(.stack)").append($(header).css("transform", "scale(0.7)"));
  } else {
    $("div.reveal").append(header);
  }
  if (Reveal.isFirstSlide()) {
    $(".bottomBar").hide();
  }
  Reveal.addEventListener("slidechanged", function(event) {
    if (event.indexh === 0) {
      $(".bottomBar").hide();
    } else {
      $(".bottomBar").show();
    }
  });
});

//Change menu tabs behaviour from click to hover
const megaMenuTabs = document.querySelectorAll('.styles-mega-menu .kt-tabs-title-list li a');
megaMenuTabs.forEach(function(e){
    e.addEventListener('mouseover', function() {
      e.click();
    });
});

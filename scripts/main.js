$(function() {

    // menu initialization
    var $menu = $('#menu');
    var $menuEntries = $menu.children('div');
    $(window).on('hashchange load', function() {
        $menuEntries.hide();
        var clickedMenuEntry =
            $menuEntries.filter(window.location.hash).size() ?
            window.location.hash :
            '#index';
        $(clickedMenuEntry).show();
    });

    var curBackground = 1;
    var backgroundsCount = 10;
    var backgroundsExt = '.jpg';
    var backgroundsUrlPrefix = 'css/img/backgrounds/';

    // simple images preloading
    for (var i = curBackground; i <= backgroundsCount; i++) {
        $('<img src="' + backgroundsUrlPrefix + i + backgroundsExt + '">');
    }

    var $backgroundContainer = $('#background');

    setInterval(function() {
        $backgroundContainer.fadeOut('slow', function() {
            $backgroundContainer.css(
                'background-image',
                'url(' + backgroundsUrlPrefix + curBackground + backgroundsExt + ')'
            ).fadeIn('slow');
        });
        curBackground = (curBackground === backgroundsCount) ? 1 : ++curBackground;
    }, 5000);

});
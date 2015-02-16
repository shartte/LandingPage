$(function() {

    // menu initialization
    var $menu = $('#menu');
    var $menuEntries = $menu.children('div');
    var $playIframe = $('#play').find('iframe');
    $(window).on('hashchange', function() {
        $menuEntries.hide();
        var clickedMenuEntry =
            $menuEntries.filter(window.location.hash).size() ?
            window.location.hash :
            '#index';

        // actually active "play" iframe
        // because for now applet is self-signed, Java plugin displays security window
        // this code need to be removed when applet will be signed properly
        if (clickedMenuEntry === '#play' && !$playIframe.attr('src')) {
            $playIframe.attr('src', $playIframe.data('src'));
        }

        $(clickedMenuEntry).show();
    }).trigger('hashchange'); // initial

});

$(function() {

    function selectRecommendedRelease() {

        var parser = new UAParser();
        var os = parser.getOS().name;
        var arch = parser.getCPU().architecture;
        var is64Bit = (arch === "amd64" || arch == "ia64");

        var platformIcon;
        var releaseName;
        var platformName;
        switch (os.toLowerCase()) {
            case "windows":
                releaseName = is64Bit ? "win64" : "win32";
                platformIcon = "fa-windows";
                platformName = is64Bit ? "Windows 64-bit" : "Windows 32-bit";
                break;
            case "linux":
            case "centos":
            case "fedora":
            case "debian":
            case "gnu":
            case "mandriva":
            case "redhat":
            case "suse":
            case "ubuntu":
            case "vectorlinux":
                releaseName = is64Bit ? "linux64" : "linux32";
                platformIcon = "fa-linux";
                platformName = is64Bit ? "Linux 64-bit" : "Linux 32-bit";
                break;
            case "mac os":
                releaseName = "macosx";
                platformIcon = "fa-apple";
                platformName = "Mac OS X";
                break;
            default:
                break;
        }

        // Try fallback to jar once.
        if (!releaseName || !latestLauncherRelease[releaseName]) {
            releaseName = "jar";
            platformIcon = "fa-file-zip-o";
            platformName = "Jar for Java 8";
        }

        var release = latestLauncherRelease[releaseName];
        if (release) {
            var recommended = $(".recommended").show();
            recommended.find("p i.fa").addClass(platformIcon);
            recommended.find(".platform").text(platformName);
            recommended.find(".size").text(release.size);
            recommended.find("a").attr("href", release.url);
        }
    }

    selectRecommendedRelease();

    var curBackground = 1;
    var backgroundsCount = 10;
    var backgroundsExt = '.jpg';
    var backgroundsUrlPrefix = 'assets/backgrounds/';

    // simple images preloading
    for (var i = curBackground; i <= backgroundsCount; i++) {
        $('<img src="' + backgroundsUrlPrefix + i + backgroundsExt + '">');
    }

    var $backgroundContainer = $('#background');

    // background images cycling
    setInterval(function() {
        $backgroundContainer.fadeOut('slow', function() {
            $backgroundContainer.css(
                'background-image',
                'url(' + backgroundsUrlPrefix + curBackground + backgroundsExt + ')'
            ).fadeIn(3000);
        });
        curBackground = (curBackground === backgroundsCount) ? 1 : ++curBackground;
    }, 10000);

    // "fullscreen" background image viewing (by hiding the content)
    var $body = $('body');
    var $content = $('#content');
    $body.on('click', function(e) {
        if (e.target === $body.get(0)) $content.fadeToggle();
    });

    // mini player
    var tracks = [];
    var $player = $('#player');
    var $playerBtn = $player.find('.player-btn');
    var $playerTitle = $player.find('.player-title');

    var playNextTrack = function() {
        var track = tracks[Math.floor(Math.random() * tracks.length)];
        // soundManager.useHTML5Audio = true;
        SC.stream(
            track.uri,
            { onfinish: playNextTrack, autoPlay: true, html5only: true },
            function(track) { currentTrack = track; }
        );
        $playerTitle.attr('href', track.permalink_url).text(track.title);
    };
    var currentTrack = { togglePause: playNextTrack };

    // async player loading and initialization
    $.getScript('//connect.soundcloud.com/sdk.js', function() {
        var clientId = 'e123680e99cfdd302dd0c76d47a69385';

        SC.initialize({ client_id: clientId });

        var playlistUrl = 'http://api.soundcloud.com/playlists/2353797';
        $.getJSON(playlistUrl, { client_id: clientId }, function(playlistData) {
            tracks = playlistData.tracks;
            $player.fadeIn();
            $playerBtn.on('click', function() {
                $playerBtn.toggleClass('playing');
                currentTrack.togglePause();
            });
        });
    });
});

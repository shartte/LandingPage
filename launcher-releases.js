module.exports = function () {

    var done = this.async();
    var fs = require('fs');
    var humanize = require('humanize');

    var client = require('octonode').client();
    client.requestDefaults.headers['User-Agent'] = 'Moving Blocks';

    var repo = client.repo('MovingBlocks/TerasologyLauncher');
    repo.releases(function (error, releases) {

        var data = {};

        var i = 0;
        var latestRelease = releases[i];
        while (i < releases.length && latestRelease.prerelease) {
            latestRelease = releases[++i];
        }

        latestRelease.assets.forEach(function (asset) {
            var dlasset = {
                size: humanize.filesize(asset.size),
                url: asset.browser_download_url
            };

            var m = asset.name.match(/^terasologylauncher-([\d\w]+)\.zip$/i);
            if (m) {
                data[m[1]] = dlasset;
            } else {
                if (asset.name.match(/terasologylauncher.zip/i)) {
                    data["jar"] = dlasset;
                }
            }
        });

        data.version = latestRelease.tag_name.replace(/^v/, "");
        data.released = Date.parse(latestRelease.published_at);

        try {
            fs.mkdirSync('data');
        } catch (e) {
        }

        fs.writeFileSync('data/launcherReleases.json', JSON.stringify(data));

        done();
    });

};
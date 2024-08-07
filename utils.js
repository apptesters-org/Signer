const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

function makeKey(le) 
{
    var res = '';
    var chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`;
    var cl = chars.length;
    for (var i = 0; i < le; i++) {
        res += chars.charAt(Math.floor(Math.random() * cl));
    }
    return res;
}

async function execAwait(cmd) {
    try {
        var meow = await execPromise(cmd);
        var output = meow.stdout;
        var slicedoutput = output.split(' ');
        var bundleid = slicedoutput.indexOf('BundleId:');
        var abundleid = slicedoutput[bundleid+1].replace(/\s+/g, ' ').trim();
        abundleid = abundleid.replace('>>>', '');
        abundleid = abundleid.replace(' ', '');
        return abundleid
    }catch(err) {
        if(err.stdout.toLowerCase().includes("password")) {
            return true
        }else{
            throw new Error(err)
        }
    }
}

async function makePlist(bid, uuid, nya, domain)
{
    const plist = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
    "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
        <dict>
            <key>items</key>
            <array>
                <dict>
                    <key>assets</key>
                    <array>
                        <dict>
                            <key>kind</key>
                            <string>software-package</string>
                            <key>url</key>
                            <string>${domain}/apps/${uuid}.ipa</string>
                        </dict>
                        <dict>
                            <key>kind</key>
                            <string>display-image</string>
                            <key>needs-shine</key>
                            <false/>
                            <key>url</key>
                            <string>https://cdn.discordapp.com/attachments/1130557037361770526/1205309158073700393/apptesters-iconx1024.png</string>
                        </dict>
                        <dict>
                            <key>kind</key>
                            <string>full-size-image</string>
                            <key>needs-shine</key>
                            <false/>
                            <key>url</key>
                            <string>htthttps://cdn.discordapp.com/attachments/1130557037361770526/1205309158073700393/apptesters-iconx1024.png</string>
                        </dict>
                    </array>
                    <key>metadata</key>
                    <dict>
                        <key>bundle-identifier</key>
                        <string>${bid ? bid : nya}</string>
                        <key>bundle-version</key>
                        <string>1.0.1</string>
                        <key>kind</key>
                        <string>software</string>
                        <key>title</key>
                        <string>${uuid}</string>
                    </dict>
                </dict>
            </array>
        </dict>
    </plist>`;
    return plist;
}

async function deleteFiles(uuid) {
    try {
        await fs.unlinkSync(path.join(__dirname, 'files', 'temp', `${uuid}.ipa`));
        await fs.unlinkSync(path.join(__dirname, 'files', 'certs', `${uuid}.p12`));
        await fs.unlinkSync(path.join(__dirname, 'files', 'certs', `${uuid}.mobileprovision`));
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    makeKey,
    execAwait,
    makePlist,
    deleteFiles
}

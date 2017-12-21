/**
 * Execute the following action
 * @param {string} action - action to be executed
 */
function handleAction(action) {
    console.log(action);
    browser.tabs.query({ url: 'https://*.spotify.com/*' }, (tabs) => {

        // Open a spotify tab if one does not exist yet.
        if (tabs.length === 0) {
            browser.tabs.create({ url: 'https://open.spotify.com' });
        }

        // Apply command
        for (let tab of tabs) {
            let code = "";
            if (tab.url.startsWith('https://play.spotify.com')) {
                code = "document.getElementById('app-player').contentDocument.getElementById('" + command + "').click()";
            }
            else if (tab.url.startsWith('https://open.spotify.com')) {
                switch (action) {
                    case "play-pause": 
                        code = '(document.querySelector(".spoticon-play-16") || document.querySelector(".spoticon-pause-16")).click()'; 
                        break;
                    case "next":
                        code = 'document.querySelector(".spoticon-skip-forward-16").click()';
                        break;
                    case "previous":
                        code = 'document.querySelector(".spoticon-skip-back-16").click()';
                        break;
                    case "shuffle":
                        code = 'document.querySelector(".spoticon-shuffle-16").click()';
                        break;
                    case "repeat": 
                        code = 'document.querySelector(".spoticon-repeat-16").click()';
                        break;
                }
            }
            if (code.length) {
                browser.tabs.executeScript(tab.id, {code: code});
            }
        }
    });
}


/**
 * Gets custom shortcuts from the local storage. If any is set add listener to default ones.
 */
browser.storage.local.get("SpotifyShortcuts").then(result => {
    let shortcuts = result.SpotifyShortcuts ? result.SpotifyShortcuts : null;
    if (!shortcuts) {
        browser.commands.onCommand.addListener((command) => {
            handleAction(command);
        });
    }
});

/**
 * 
 */
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const action = request.action;
    if (action === "getShortcuts") {
        return browser.storage.local.get("SpotifyShortcuts").then(result => {
            return result.SpotifyShortcuts ? result.SpotifyShortcuts : null; 
        });
    }
    handleAction(action);
});
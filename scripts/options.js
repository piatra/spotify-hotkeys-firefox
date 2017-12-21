
function onError(error) {
    // TODO: show user
    console.log(`Error: ${error}`);
}


function saveOptions(e) {
    e.preventDefault();

    function checkShortcuts(play, next, previous, shuffle, repeat) {
        // TODO: check possible shortcuts
        if (!play || !next || !previous) {
            onError("Required shortcuts were empty/invalid");
            return null;
        }
        return {
            "play-pause": play,
            "next": next,
            "previous": previous
        };
    }

    const play = document.querySelector("#play-pause").value;
    const next = document.querySelector("#next").value;
    const previous = document.querySelector("#previous").value;
    const shuffle = document.querySelector("#shuffle").value;
    const repeat = document.querySelector("#repeat").value;
    const shortcuts = checkShortcuts(play, next, previous, shuffle, repeat);
    if (shortcuts) {
        browser.storage.local.set({
            "SpotifyShortcuts": shortcuts
        });
    }
}

function restoreOptions() {

    function setDefaultOptions() {
        const options = {
            "play-pause": "Alt+Shift+P",
            "next": "Alt+Shift+Right",
            "previous": "Alt+Shift+Left"
        };
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                document.querySelector(`#${key}`).value = options[key];
            }
        }
    }

    function setCurrentChoice(result) {
        if (!result["SpotifyShortcuts"]) return setDefaultOptions();
        
        console.log(result);
        for (const key in result.SpotifyShortcuts) {
            if (result.SpotifyShortcuts.hasOwnProperty(key)) {
                document.querySelector(`#${key}`).value = result.SpotifyShortcuts[key];
            }
        }
    }


    let getting = browser.storage.local.get("SpotifyShortcuts");
    getting.then(setCurrentChoice, onError);
}

function restoreDefaultShortcuts() {
    browser.storage.local.remove("SpotifyShortcuts");
    restoreOptions();
    console.log("Restored!")
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", restoreDefaultShortcuts);
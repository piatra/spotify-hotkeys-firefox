
console.log("entra en content-script");

/**
 * Set the custom shortcuts listeners.
 * @param {action: keycombo} shortcuts - Object with all the custom shortcuts or null if not defined
 */
function setShortcuts(shortcuts) {
    console.log(shortcuts);
    if (shortcuts) { // check null (no custom)
        for (const key in shortcuts) {
            if (shortcuts.hasOwnProperty(key)) {
                console.log(shortcuts[key]);
                Mousetrap.bind(shortcuts[key].toLowerCase(), function() {
                    browser.runtime.sendMessage({action: key});
                });
            }
        }
    }
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

const sending = browser.runtime.sendMessage({action: "getShortcuts"});
sending.then(setShortcuts, handleError);


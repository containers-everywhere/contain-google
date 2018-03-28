// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const GOOGLE_CONTAINER_NAME = "Google";
const GOOGLE_CONTAINER_COLOR = "red";
const GOOGLE_CONTAINER_ICON = "briefcase";
const GOOGLE_DOMAINS = ["google.com", "google.ch", "google.de", "google.at", "youtube.com"];

const MAC_ADDON_ID = "@testpilot-containers";

let googleCookieStoreId = null;

const googleHostREs = [];

async function isGoogleAlreadyAssignedInMAC () {
  let macAddonInfo;
  // If the MAC add-on isn't installed, return false
  try {
    macAddonInfo = await browser.management.get(MAC_ADDON_ID);
  } catch (e) {
    return false;
  }
  let anyGoogleDomainsAssigned = false;
  for (let googleDomain of GOOGLE_DOMAINS) {
    const googleCookieUrl = `https://${googleDomain}/`;
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url: googleCookieUrl
    });
    if (assignment) {
      anyGoogleDomainsAssigned = true;
    }
  }
  return anyGoogleDomainsAssigned;
}

(async function init() {
  const googleAlreadyAssigned = await isGoogleAlreadyAssignedInMAC();
  if (googleAlreadyAssigned) {
    return;
  }

  // Clear all google cookies
  for (let googleDomain of GOOGLE_DOMAINS) {
    googleHostREs.push(new RegExp(`^(.*)?${googleDomain}$`));
    const googleCookieUrl = `https://${googleDomain}/`;

    browser.cookies.getAll({domain: googleDomain}).then(cookies => {
      for (let cookie of cookies) {
        browser.cookies.remove({name: cookie.name, url: googleCookieUrl});
      }
    });
  }

  // Use existing Google container, or create one
  browser.contextualIdentities.query({name: GOOGLE_CONTAINER_NAME}).then(contexts => {
    if (contexts.length > 0) {
      googleCookieStoreId = contexts[0].cookieStoreId;
    } else {
      browser.contextualIdentities.create({
        name: GOOGLE_CONTAINER_NAME,
        color: GOOGLE_CONTAINER_COLOR,
        icon: GOOGLE_CONTAINER_ICON}
      ).then(context => {
        googleCookieStoreId = context.cookieStoreId;
      });
    }
  });

  // Listen to requests and open Google into its Container,
  // open other sites into the default tab context
  async function containGoogle(options) {
    const requestUrl = new URL(options.url);
    let isGoogle = false;
    for (let googleHostRE of googleHostREs) {
      if (googleHostRE.test(requestUrl.host)) {
        isGoogle = true;
        break;
      }
    }
    const tab = await browser.tabs.get(options.tabId);
    const tabCookieStoreId = tab.cookieStoreId;
    if (isGoogle) {
      if (tabCookieStoreId !== googleCookieStoreId && !tab.incognito) {
        // See https://github.com/mozilla/contain-facebook/issues/23
        // Sometimes this add-on is installed but doesn't get a googleCookieStoreId ?
        if (googleCookieStoreId) {
          browser.tabs.create({url: requestUrl.toString(), cookieStoreId: googleCookieStoreId});
          browser.tabs.remove(options.tabId);
          return {cancel: true};
        }
      }
    } else {
      if (tabCookieStoreId === googleCookieStoreId) {
        browser.tabs.create({url: requestUrl.toString()});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  }

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containGoogle, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
})();

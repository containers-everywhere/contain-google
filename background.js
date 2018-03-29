// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const GOOGLE_CONTAINER_NAME = "Google";
const GOOGLE_CONTAINER_COLOR = "red";
const GOOGLE_CONTAINER_ICON = "briefcase";
const GOOGLE_DOMAINS = ["google.com", "google.ch", "google.de", "google.at", "youtube.com"];

const MAC_ADDON_ID = "@testpilot-containers";

let macAddonEnabled = false;
let googleCookieStoreId = null;
let googleCookiesCleared = false;

const googleHostREs = [];

async function isMACAddonEnabled () {
  try {
    const macAddonInfo = await browser.management.get(MAC_ADDON_ID);
    if (macAddonInfo.enabled) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function setupMACAddonManagementListeners () {
  browser.management.onInstalled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  });
  browser.management.onUninstalled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  })
  browser.management.onEnabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  })
  browser.management.onDisabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  })
}

async function getMACAssignment (url) {
  try {
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url
    });
    return assignment;
  } catch (e) {
    return false;
  }
}

function generateGoogleHostREs () {
  for (let googleDomain of GOOGLE_DOMAINS) {
    googleHostREs.push(new RegExp(`^(.*\\.)?${googleDomain}$`));
  }
}

function clearGoogleCookies () {
  // Clear all google cookies
  for (let googleDomain of GOOGLE_DOMAINS) {
    const googleCookieUrl = `https://${googleDomain}/`;

    browser.cookies.getAll({domain: googleDomain}).then(cookies => {
      for (let cookie of cookies) {
        browser.cookies.remove({name: cookie.name, url: googleCookieUrl});
      }
    });
  }
}

async function setupContainer () {
  // Use existing Google container, or create one
  const contexts = await browser.contextualIdentities.query({name: GOOGLE_CONTAINER_NAME})
  if (contexts.length > 0) {
    googleCookieStoreId = contexts[0].cookieStoreId;
  } else {
    const context = await browser.contextualIdentities.create({
      name: GOOGLE_CONTAINER_NAME,
      color: GOOGLE_CONTAINER_COLOR,
      icon: GOOGLE_CONTAINER_ICON
    })
    googleCookieStoreId = context.cookieStoreId;
  }
}

async function containGoogle (options) {
  // Listen to requests and open Google into its Container,
  // open other sites into the default tab context
  const requestUrl = new URL(options.url);

  let isGoogle = false;
  for (let googleHostRE of googleHostREs) {
    if (googleHostRE.test(requestUrl.host)) {
      isGoogle = true;
      break;
    }
  }

  // We have to check with every request if Google is assigned with MAC
  // because the user can assign it at any given time (needs MAC Events)
  if (isGoogle && macAddonEnabled) {
    const googleAlreadyAssigned = await getMACAssignment(options.url);
    if (googleAlreadyAssigned) {
      // This Google URL is assigned with MAC, so we don't handle this request
      return;
    }
  }

  const tab = await browser.tabs.get(options.tabId);
  const tabCookieStoreId = tab.cookieStoreId;
  if (isGoogle) {
    if (tabCookieStoreId !== googleCookieStoreId && !tab.incognito) {
      // See https://github.com/mozilla/contain-google/issues/23
      // Sometimes this add-on is installed but doesn't get a googleCookieStoreId ?
      if (googleCookieStoreId) {
        browser.tabs.create({
          url: requestUrl.toString(),
          cookieStoreId: googleCookieStoreId,
          active: tab.active,
          index: tab.index
        });
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  } else {
    if (tabCookieStoreId === googleCookieStoreId) {
      browser.tabs.create({
        url: requestUrl.toString(),
        active: tab.active,
        index: tab.index
      });
      browser.tabs.remove(options.tabId);
      return {cancel: true};
    }
  }
}

(async function init() {
  await setupMACAddonManagementListeners();
  macAddonEnabled = await isMACAddonEnabled();

  clearGoogleCookies();
  generateGoogleHostREs();
  await setupContainer();

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containGoogle, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
})();

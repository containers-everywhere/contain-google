// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const GOOGLE_CONTAINER_NAME = "Google";
const GOOGLE_CONTAINER_COLOR = "red";
const GOOGLE_CONTAINER_ICON = "briefcase";

let GOOGLE_DOMAINS = [
  "google.com", "google.org", "googleapis.com", "g.co", "ggpht.com",
  "blogger.com", "googleblog.com", "blog.google", "googleusercontent.com", "googlesource.com",
  "google.org", "google.net", "466453.com", "gooogle.com", "gogle.com", "ggoogle.com", "gogole.com", "goolge.com", "googel.com", "googlee.com", "googil.com", "googlr.com", "elgoog.im", "ai.google", "com.google", "about.google", "registry.google",
];

const GOOGLE_INTL_DOMAINS = [
  "google.ac", "google.ad", "google.ae", "google.com.af", "google.com.ag", "google.com.ai", "google.al", "google.am", "google.co.ao", "google.com.ar", "google.as", "google.at", "google.com.au", "google.az", "google.ba", "google.com.bd", "google.be", "google.bf", "google.bg", "google.com.bh", "google.bi", "google.bj", "google.com.bn", "google.com.bo", "google.com.br", "google.bs", "google.bt", "google.com.bw", "google.by", "google.com.bz", "google.ca", "google.com.kh", "google.cc", "google.cd", "google.cf", "google.cat", "google.cg", "google.ch", "google.ci", "google.co.ck", "google.cl", "google.cm", "google.cn", "google.com.co", "google.co.cr", "google.com.cu", "google.cv", "google.com.cy", "google.cz", "google.de", "google.dj", "google.dk", "google.dm", "google.com.do", "google.dz", "google.com.ec", "google.ee", "google.com.eg", "google.es", "google.com.et", "google.fi", "google.com.fj", "google.fm", "google.fr", "google.ga", "google.ge", "google.gf", "google.gg", "google.com.gh", "google.com.gi", "google.gl", "google.gm", "google.gp", "google.gr", "google.com.gt", "google.gy", "google.com.hk", "google.hn", "google.hr", "google.ht", "google.hu", "google.co.id", "google.iq", "google.ie", "google.co.il", "google.im", "google.co.in", "google.io", "google.is", "google.it", "google.je", "google.com.jm", "google.jo", "google.co.jp", "google.co.ke", "google.ki", "google.kg", "google.co.kr", "google.com.kw", "google.kz", "google.la", "google.lb", "google.com.lc", "google.li", "google.lk", "google.co.ls", "google.lt", "google.lu", "google.lv", "google.com.ly", "google.co.ma", "google.md", "google.me", "google.mg", "google.mk", "google.ml", "google.com.mm", "google.mn", "google.ms", "google.com.mt", "google.mu", "google.mv", "google.mw", "google.com.mx", "google.com.my", "google.co.mz", "google.com.na", "google.ne", "google.com.nf", "google.com.ng", "google.com.ni", "google.nl", "google.no", "google.com.np", "google.nr", "google.nu", "google.co.nz", "google.com.om", "google.com.pk", "google.com.pa", "google.com.pe", "google.com.ph", "google.pl", "google.com.pg", "google.pn", "google.com.pr", "google.ps", "google.pt", "google.com.py", "google.com.qa", "google.ro", "google.rs", "google.ru", "google.rw", "google.com.sa", "google.com.sb", "google.sc", "google.se", "google.com.sg", "google.sh", "google.si", "google.sk", "google.com.sl", "google.sn", "google.sm", "google.so", "google.st", "google.sr", "google.com.sv", "google.td", "google.tg", "google.co.th", "google.com.tj", "google.tk", "google.tl", "google.tm", "google.to", "google.tn", "google.com.tr", "google.tt", "google.com.tw", "google.co.tz", "google.com.ua", "google.co.ug", "google.co.uk", "google.us", "google.com.uy", "google.co.uz", "google.com.vc", "google.co.ve", "google.vg", "google.co.vi", "google.com.vn", "google.vu", "google.ws", "google.co.za", "google.co.zm", "google.co.zw",
];

const GOOGLE_SERVICES = [
"like.com", "keyhole.com", "panoramio.com", "picasa.com", "urchin.com", "igoogle.com", "foofle.com", "froogle.com", "localguidesconnect.com", "googlemail.com", "googleanalytics.com", "google-analytics.com", "googletagmanager.com", "googlecode.com", "googlesource.com", "googledrive.com", "googlearth.com", "googleearth.com", "googlemaps.com", "googlepagecreator.com", "googlescholar.com", "advertisercommunity.com", "thinkwithgoogle.com", "googlegroups.com",
];

const YOUTUBE_DOMAINS = [
  "youtube.com", "youtu.be", "yt.be", "ytimg.com", "youtube-nocookie.com", "youtubegaming.com", "youtubeeducation.com",
];

const BLOGSPOT_DOMAINS = [
  "blogspot.com", "blogspot.ae", "blogspot.al", "blogspot.am", "blogspot.com.ar", "blogspot.co.at", "blogspot.com.au", "blogspot.ba", "blogspot.be", "blogspot.bg", "blogspot.bj", "blogspot.com.br", "blogspot.com.by", "blogspot.ca", "blogspot.cf", "blogspot.ch", "blogspot.cl", "blogspot.com.co", "blogspot.cv", "blogspot.com.cy", "blogspot.cz", "blogspot.de", "blogspot.dj", "blogspot.dk", "blogspot.dm", "blogspot.com.do", "blogspot.dz", "blogspot.com.eg", "blogspot.es", "blogspot.fi", "blogspot.fr", "blogspot.gr", "blogspot.hr", "blogspot.hu", "blogspot.co.id", "blogspot.ie", "blogspot.co.il", "blogspot.in", "blogspot.is", "blogspot.it", "blogspot.jp", "blogspot.co.ke", "blogspot.kr", "blogspot.li", "blogspot.lt", "blogspot.lu", "blogspot.md", "blogspot.mk", "blogspot.com.mt", "blogspot.mx", "blogspot.my", "blogspot.com.ng", "blogspot.nl", "blogspot.no", "blogspot.co.nz", "blogspot.pt", "blogspot.qa", "blogspot.ro", "blogspot.rs", "blogspot.ru", "blogspot.se", "blogspot.sg", "blogspot.si", "blogspot.sk", "blogspot.sn", "blogspot.com.sr", "blogspot.td", "blogspot.co.tl", "blogspot.co.to", "blogspot.com.tr", "blogspot.tw", "blogspot.co.uk", "blogspot.com.uy", "blogspot.co.za", "stackdriver.com",
];

const ALPHABET_DOMAINS = [
  "abc.xyz", "waze.com", "capitalg.com", "gv.com", "calicolabs.com", "x.company", "nest.com", "sidewalklabs.com", "verily.com",
];

const AD_DOMAINS = [
  "doubleclickbygoogle.com", "feedburner.com", "doubleclick.com", "doubleclick.net", "adwords.com", "adsense.com", "admob.com", "advertisercommunity.com",
  "googlesyndication.com", "googlecommerce.com", "googlebot.com", "googleapps.com", "googleadservices.com", "gmodules.com", "googl.com",
  "1e100.net", "domains.google", "gv.com", "googletraveladservices.com",
];

const DEVELOPER_DOMAINS = [
  "madewithcode.com", "design.google", "wellbeing.google", "gallery.io", "domains.google", "material.io", "getmdl.io", "android.com", "chromium.org", "cobrasearch.com", "chromecast.com", "chrome.com", "chromebook.com", "madewithcode.com", "whatbrowser.org", "withgoogle.com", "web.dev",
];

GOOGLE_DOMAINS = GOOGLE_DOMAINS.concat(GOOGLE_INTL_DOMAINS)
  .concat(GOOGLE_SERVICES).concat(YOUTUBE_DOMAINS).concat(BLOGSPOT_DOMAINS).concat(ALPHABET_DOMAINS)
  .concat(DEVELOPER_DOMAINS).concat(AD_DOMAINS);

const MAC_ADDON_ID = "@testpilot-containers";

let macAddonEnabled = false;
let googleCookieStoreId = null;
let extensionSettings = {};

const canceledRequests = {};
const tabsWaitingToLoad = {};
const googleHostREs = [];
const youtubeHostREs = [];

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
  });
  browser.management.onEnabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  });
  browser.management.onDisabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  });
}

async function getMACAssignment (url) {
  if (!macAddonEnabled) {
    return false;
  }

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

function cancelRequest (tab, options) {
  // we decided to cancel the request at this point, register canceled request
  canceledRequests[tab.id] = {
    requestIds: {
      [options.requestId]: true
    },
    urls: {
      [options.url]: true
    }
  };

  // since webRequest onCompleted and onErrorOccurred are not 100% reliable
  // we register a timer here to cleanup canceled requests, just to make sure we don't
  // end up in a situation where certain urls in a tab.id stay canceled
  setTimeout(() => {
    if (canceledRequests[tab.id]) {
      delete canceledRequests[tab.id];
    }
  }, 2000);
}

function shouldCancelEarly (tab, options) {
  // we decided to cancel the request at this point
  if (!canceledRequests[tab.id]) {
    cancelRequest(tab, options);
  } else {
    let cancelEarly = false;
    if (canceledRequests[tab.id].requestIds[options.requestId] ||
        canceledRequests[tab.id].urls[options.url]) {
      // same requestId or url from the same tab
      // this is a redirect that we have to cancel early to prevent opening two tabs
      cancelEarly = true;
    }
    // register this requestId and url as canceled too
    canceledRequests[tab.id].requestIds[options.requestId] = true;
    canceledRequests[tab.id].urls[options.url] = true;
    if (cancelEarly) {
      return true;
    }
  }
  return false;
}

function generateGoogleHostREs () {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

  for (let googleDomain of GOOGLE_DOMAINS) {
    googleDomain = googleDomain.replace(matchOperatorsRegex, '\\$&');
    googleHostREs.push(new RegExp(`(^|\.)${googleDomain}$`));
  }
  for (let youtubeDomain of YOUTUBE_DOMAINS) {
    youtubeDomain = youtubeDomain.replace(matchOperatorsRegex, '\\$&');
    youtubeHostREs.push(new RegExp(`(^|\.)${youtubeDomain}$`));
  }
}

async function loadExtensionSettings () {
  extensionSettings = await browser.storage.sync.get();
}

async function clearGoogleCookies () {
  // Clear all google cookies
  const containers = await browser.contextualIdentities.query({});
  containers.push({
    cookieStoreId: "firefox-default"
  });

  let macAssignments = [];
  if (macAddonEnabled) {
    const promises = GOOGLE_DOMAINS.map(async googleDomain => {
      const assigned = await getMACAssignment(`https://${googleDomain}/`);
      return assigned ? googleDomain : null;
    });
    macAssignments = await Promise.all(promises);
  }

  GOOGLE_DOMAINS.map(async googleDomain => {
    const googleCookieUrl = `https://${googleDomain}/`;

    // dont clear cookies for googleDomain if mac assigned (with or without www.)
    if (macAddonEnabled &&
        (macAssignments.includes(googleDomain) ||
         macAssignments.includes(`www.${googleDomain}`))) {
      return;
    }

    containers.map(async container => {
      const storeId = container.cookieStoreId;
      if (storeId === googleCookieStoreId) {
        // Don't clear cookies in the Google Container
        return;
      }

      const cookies = await browser.cookies.getAll({
        domain: googleDomain,
        storeId
      });

      cookies.map(cookie => {
        browser.cookies.remove({
          name: cookie.name,
          url: googleCookieUrl,
          storeId
        });
      });
    });
  });
}

async function setupContainer () {
  // Use existing Google container, or create one
  const contexts = await browser.contextualIdentities.query({name: GOOGLE_CONTAINER_NAME});
  if (contexts.length > 0) {
    googleCookieStoreId = contexts[0].cookieStoreId;
  } else {
    const context = await browser.contextualIdentities.create({
      name: GOOGLE_CONTAINER_NAME,
      color: GOOGLE_CONTAINER_COLOR,
      icon: GOOGLE_CONTAINER_ICON
    });
    googleCookieStoreId = context.cookieStoreId;
  }
}

function reopenTab ({url, tab, cookieStoreId}) {
  browser.tabs.create({
    url,
    cookieStoreId,
    active: tab.active,
    index: tab.index + 1,
    windowId: tab.windowId
  });
  // We do not want to erase google container if going from 
  // google container back to default.
  if (!(isSearchPageURL(tab.url))) {
    browser.tabs.remove(tab.id);
  }
}

function isGoogleURL (url) {
  const parsedUrl = new URL(url);
  for (let googleHostRE of googleHostREs) {
    if (googleHostRE.test(parsedUrl.host)) {
      return true;
    }
  }
  return false;
}

function isYouTubeURL (url) {
  const parsedUrl = new URL(url);
  for (let youtubeHostRE of youtubeHostREs) {
    if (youtubeHostRE.test(parsedUrl.host)) {
      return true;
    }
  }
  return false;
}

function isSearchPageURL (url) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.startsWith('/search');
}

function isMapsURL (url) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.startsWith('/maps');
}

function isFlightsURL (url) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.startsWith('/flights');
}

function shouldContainInto (url, tab) {
  if (!url.startsWith("http")) {
    // we only handle URLs starting with http(s)
    return false;
  }

  let handleUrl = isGoogleURL(url);

  if (handleUrl && extensionSettings.ignore_youtube && isYouTubeURL(url)) {
    handleUrl = false;
  }

  if (handleUrl && extensionSettings.ignore_searchpages && isSearchPageURL(url)) {
    handleUrl = false;
  }

  if (handleUrl && extensionSettings.ignore_maps && isMapsURL(url)) {
    handleUrl = false;
  }

  if (handleUrl && extensionSettings.ignore_flights && isFlightsURL(url)) {
    handleUrl = false;
  }

  if (handleUrl) {
    if (tab.cookieStoreId !== googleCookieStoreId) {
      // Google-URL outside of Google Container Tab
      // Should contain into Google Container
      return googleCookieStoreId;
    }
  } else if (tab.cookieStoreId === googleCookieStoreId) {
    // Non-Google-URL inside Google Container Tab
    // Should contain into Default Container
    return "firefox-default";
  }

  return false;
}

async function maybeReopenAlreadyOpenTabs () {
  const maybeReopenTab = async tab => {
    const macAssigned = await getMACAssignment(tab.url);
    if (macAssigned) {
      // We don't reopen MAC assigned urls
      return;
    }
    const cookieStoreId = shouldContainInto(tab.url, tab);
    if (!cookieStoreId) {
      // Tab doesn't need to be contained
      return;
    }
    reopenTab({
      url: tab.url,
      tab,
      cookieStoreId
    });
  };

  const tabsOnUpdated = (tabId, changeInfo, tab) => {
    if (changeInfo.url && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for switched it's url, maybe we reopen
      delete tabsWaitingToLoad[tabId];
      maybeReopenTab(tab);
    }
    if (tab.status === "complete" && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for completed loading
      delete tabsWaitingToLoad[tabId];
    }
    if (!Object.keys(tabsWaitingToLoad).length) {
      // We're done waiting for tabs to load, remove event listener
      browser.tabs.onUpdated.removeListener(tabsOnUpdated);
    }
  };

  // Query for already open Tabs
  const tabs = await browser.tabs.query({});
  tabs.map(async tab => {
    if (tab.incognito) {
      return;
    }
    if (tab.url === "about:blank") {
      if (tab.status !== "loading") {
        return;
      }
      // about:blank Tab is still loading, so we indicate that we wait for it to load
      // and register the event listener if we haven't yet.
      //
      // This is a workaround until platform support is implemented:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1447551
      // https://github.com/mozilla/multi-account-containers/issues/474
      tabsWaitingToLoad[tab.id] = true;
      if (!browser.tabs.onUpdated.hasListener(tabsOnUpdated)) {
        browser.tabs.onUpdated.addListener(tabsOnUpdated);
      }
    } else {
      // Tab already has an url, maybe we reopen
      maybeReopenTab(tab);
    }
  });
}

async function containGoogle (options) {
  // Listen to requests and open Google into its Container,
  // open other sites into the default tab context
  if (options.tabId === -1) {
    // Request doesn't belong to a tab
    return;
  }
  if (tabsWaitingToLoad[options.tabId]) {
    // Cleanup just to make sure we don't get a race-condition with startup reopening
    delete tabsWaitingToLoad[options.tabId];
  }

  // We have to check with every request if the requested URL is assigned with MAC
  // because the user can assign URLs at any given time (needs MAC Events)
  const macAssigned = await getMACAssignment(options.url);
  if (macAssigned) {
    // This URL is assigned with MAC, so we don't handle this request
    return;
  }

  const tab = await browser.tabs.get(options.tabId);
  if (tab.incognito) {
    // We don't handle incognito tabs
    return;
  }

  // Check whether we should contain this request into another container
  const cookieStoreId = shouldContainInto(options.url, tab);
  if (!cookieStoreId) {
    // Request doesn't need to be contained
    return;
  }
  if (shouldCancelEarly(tab, options)) {
    // We need to cancel early to prevent multiple reopenings
    return {cancel: true};
  }
  // Decided to contain
  reopenTab({
    url: options.url,
    tab,
    cookieStoreId
  });
  return {cancel: true};
}

(async function init() {
  await setupMACAddonManagementListeners();
  macAddonEnabled = await isMACAddonEnabled();

  try {
    await setupContainer();
  } catch (error) {
    // TODO: Needs backup strategy
    // See https://github.com/mozilla/contain-facebook/issues/23
    // Sometimes this add-on is installed but doesn't get a googleCookieStoreId ?
    // eslint-disable-next-line no-console
    console.log(error);
    return;
  }
  loadExtensionSettings();
  clearGoogleCookies();
  generateGoogleHostREs();

  // Clean up canceled requests
  browser.webRequest.onCompleted.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});
  browser.webRequest.onErrorOccurred.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containGoogle, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

  maybeReopenAlreadyOpenTabs();
})();

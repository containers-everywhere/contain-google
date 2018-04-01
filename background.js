// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const GOOGLE_CONTAINER_NAME = "Google";
const GOOGLE_CONTAINER_COLOR = "red";
const GOOGLE_CONTAINER_ICON = "briefcase";
const GOOGLE_DOMAINS = ["google.com", "google.ac", "google.ad", "google.ae", "google.com.af", "google.com.ag", "google.com.ai", "google.al", "google.am", "google.co.ao", "google.com.ar", "google.as", "google.at", "google.com.au", "google.az", "google.ba", "google.com.bd", "google.be", "google.bf", "google.bg", "google.com.bh", "google.bi", "google.bj", "google.com.bn", "google.com.bo", "google.com.br", "google.bs", "google.bt", "google.com.bw", "google.by", "google.com.bz", "google.ca", "google.com.kh", "google.cc", "google.cd", "google.cf", "google.cat", "google.cg", "google.ch", "google.ci", "google.co.ck", "google.cl", "google.cm", "google.cn", "google.com.co", "google.co.cr", "google.com.cu", "google.cv", "google.com.cy", "google.cz", "google.de", "google.dj", "google.dk", "google.dm", "google.com.do", "google.dz", "google.com.ec", "google.ee", "google.com.eg", "google.es", "google.com.et", "google.fi", "google.com.fj", "google.fm", "google.fr", "google.ga", "google.ge", "google.gf", "google.gg", "google.com.gh", "google.com.gi", "google.gl", "google.gm", "google.gp", "google.gr", "google.com.gt", "google.gy", "google.com.hk", "google.hn", "google.hr", "google.ht", "google.hu", "google.co.id", "google.iq", "google.ie", "google.co.il", "google.im", "google.co.in", "google.io", "google.is", "google.it", "google.je", "google.com.jm", "google.jo", "google.co.jp", "google.co.ke", "google.ki", "google.kg", "google.co.kr", "google.com.kw", "google.kz", "google.la", "google.lb", "google.com.lc", "google.li", "google.lk", "google.co.ls", "google.lt", "google.lu", "google.lv", "google.com.ly", "google.co.ma", "google.md", "google.me", "google.mg", "google.mk", "google.ml", "google.com.mm", "google.mn", "google.ms", "google.com.mt", "google.mu", "google.mv", "google.mw", "google.com.mx", "google.com.my", "google.co.mz", "google.com.na", "google.ne", "google.com.nf", "google.com.ng", "google.com.ni", "google.nl", "google.no", "google.com.np", "google.nr", "google.nu", "google.co.nz", "google.com.om", "google.com.pk", "google.com.pa", "google.com.pe", "google.com.ph", "google.pl", "google.com.pg", "google.pn", "google.com.pr", "google.ps", "google.pt", "google.com.py", "google.com.qa", "google.ro", "google.rs", "google.ru", "google.rw", "google.com.sa", "google.com.sb", "google.sc", "google.se", "google.com.sg", "google.sh", "google.si", "google.sk", "google.com.sl", "google.sn", "google.sm", "google.so", "google.st", "google.sr", "google.com.sv", "google.td", "google.tg", "google.co.th", "google.com.tj", "google.tk", "google.tl", "google.tm", "google.to", "google.tn", "google.com.tr", "google.tt", "google.com.tw", "google.co.tz", "google.com.ua", "google.co.ug", "google.co.uk", "google.us", "google.com.uy", "google.co.uz", "google.com.vc", "google.co.ve", "google.vg", "google.co.vi", "google.com.vn", "google.vu", "google.ws", "google.co.za", "google.co.zm", "google.co.zw", "youtube.com", "blogger.com", "doubleclickbygoogle.com", "googleblog.com", "blog.google"];

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

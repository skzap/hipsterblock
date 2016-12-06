var blocky = true;
var skippy;
var retry;
var views = -1;
var defConf = {
  time: 5,
  threshold: 1000000,
  active: true
}

chrome.browserAction.onClicked.addListener(function(tab) {
  blocky = !blocky;
  ResetState()
  if (blocky) {
    views = -1;
    BlockMainstream(tab);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, props, tab) {
  if (props.status == "complete") {
    ResetState()
    BlockMainstream(tab);
  }
});

function ResetState() {
  if (blocky) chrome.browserAction.setIcon({path:"mustache48.png"});
  else chrome.browserAction.setIcon({path:"mustache_blurred.png"});
  clearTimeout(skippy);
  clearTimeout(retry);
}

function BlockMainstream(tab) {
  // waiting 10 sec to give user time
  if (blocky && tab.url.indexOf('https://www.youtube.com/') == 0 && tab.url.length > 24) {
    chrome.tabs.executeScript(tab.id, {
      code: "document.getElementsByClassName(\"view-count\")[0].innerHTML"
    }, function (result) {
      if (!result || !result[0] || ParseViews(result[0]) == views) {
        retry = setTimeout(function() {
          BlockMainstream(tab)
        }, 500);
        return;
      }
      clearTimeout(retry);
      views = ParseViews(result[0]);
      chrome.storage.sync.get(defConf, function(config) {
        if (!config) config = defConf;
        if (views >= config.threshold) {
          SkipVideo(tab.id, config.time*1000)
        }
      });
    });
  }
}

function SkipVideo(tabId, msTime) {
  chrome.browserAction.setIcon({path:"mustache48f.png"});
  skippy = setTimeout(function() {
    chrome.browserAction.setIcon({path:"mustache48.png"});
    chrome.tabs.executeScript(tabId, {
      code: "document.getElementsByClassName(\"ytp-next-button\")[0].click();"
    });
  }, msTime);
}

function ParseViews(html) {
  html = html.replace(/&nbsp;/g, '');
  html = html.replace(/,/g, '');
  html = html.replace(/\./g, '');
  return parseInt(html);
}

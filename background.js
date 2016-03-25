var blocky = true;
var skippy;

chrome.browserAction.onClicked.addListener(function(tab) {
  blocky = !blocky;
  if (blocky) {
    chrome.browserAction.setIcon({path:"mustache128.png"});
    BlockMainstream(tab);
  }
  else {
    chrome.browserAction.setIcon({path:"mustache_blurred.png"});
    clearTimeout(skippy);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, props, tab) {
  if (props.status == "complete")
    BlockMainstream(tab);
});

function BlockMainstream(tab) {
  // waiting 10 sec to give user time
  if (blocky && tab.url.indexOf('https://www.youtube.com/') == 0) {
    clearTimeout(skippy);
    skippy = setTimeout(function() {
      chrome.tabs.executeScript(tab.id, {
        file: "youtube.js"
      });
    }, 10000);
  }
}

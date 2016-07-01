// Saves options to chrome.storage
function save_options() {
  var time = document.getElementById('time').value;
  var threshold = document.getElementById('threshold').value;
  chrome.storage.sync.set({
    time: time,
    threshold: threshold
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    time: 5,
    threshold: 1000000
  }, function(items) {
    document.getElementById('time').value = items.time;
    document.getElementById('threshold').value = items.threshold;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

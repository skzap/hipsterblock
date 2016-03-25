var views = document.getElementsByClassName('watch-view-count')[0].innerHTML;
views = views.replace(/&nbsp;/g, '');
views = views.replace(/,/g, '');
views = views.replace(/\./g, '');
views = parseInt(views);
if (views > 999999) {
  console.log(views+' views! too mainstream, skipping...');
  document.getElementsByClassName("ytp-next-button")[0].click();
}

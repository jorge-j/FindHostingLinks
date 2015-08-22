function getLinks() {
  var links = document.querySelectorAll("a");

  var results = [];
  var seenLinks = {};

  for (var i  = 0; i < links.length; ++i) {
    var text = links[i].textContent;
    if (text.length > 200)
      text = text.substring(0, 197) + "...";
    text = text.trim();
    text= text.replace(new RegExp('( |\\s|\\&nbsp)+', 'g'), " "); //reemplaza:'     ' por ' '

    var link = links[i].href.replace(/(.*)#?/, "$1");

    if (seenLinks[link]) continue;
    seenLinks[link] = 1;
    results.push({ href: link, text: text, title: links[i].title});
  }
  return results;
};


getLinks();
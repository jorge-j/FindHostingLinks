//note: _.uniq() is function of Underscore
//note2: URI is function of URI.js

function getHostings(listaLinks){
  var links=[];
  var uri = new URI();
  for (var i = 0; i < listaLinks.length; i++) {

      uri.href( listaLinks[i].href );
      //var url = uri.domain().replace("."+uri.tld(), "");
      var url = uri.domain();
      links.push(url);
      };
  return _.uniq(links);
}
function getHost(url){
  var uri = new URI();
  uri.href(url);
  //return uri.domain().replace("."+uri.tld(), "");
  return uri.domain();
}


function copyTextToClipboard(text) {
 //nota: solo funciona para Extension Chrome. 
  var copyFrom = $('<textarea/>');
  copyFrom.text(text);
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();  
}

function isUrlValide(url){
  var uri = new URI(url);

  if(uri.is("url")){
    return true;
  };
  return false;
}
function formateaUrl(url){
  var uri = new URI(url);
  
  if( !uri.protocol() || uri.protocol()===''){
    uri.protocol('http://');
    alert(uri.toString());
  }

  //uri= uri.normalizeProtocol().normalizeHostname().normalizePort().normalizePathname().normalizeSearch();
  //uri=uri.readable();

  return uri.toString();
}






/*function urlExists(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.status < 400);
    }
  };
  xhr.open('HEAD', url);
  xhr.send();
}*/

/*function urlExists(url, callback)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}*/



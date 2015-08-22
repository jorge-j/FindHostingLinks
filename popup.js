var listaLinks;


$( document ).ready(function() {

chrome.tabs.executeScript(null,{file:"js/getLinks.js"},
    function(results){
      listaLinks = results[0];
      $('#tabla-titulo').html(listaLinks.length +' Links Founds');
      for (var i = 0; i < listaLinks.length; i++) {
            addLink(i,listaLinks[i].text, listaLinks[i].href, listaLinks[i].title);
          };
      $('#loading').html('');
      inicializaTagsList();
    });


  $('#botonCopiar').click(function(){
    var texto='';
    for (var i = 0; i < listaLinks.length; i++) {
          texto += listaLinks[i].href +"\n";
          };
    copyTextToClipboard(texto);
    alert("Copiado a Clipboard");
  });
});


function addLink(num,text, link, title) {

 if(!link){return;};
 if(!title) {title= link;};
 if(!text || text==='...' || text===null) {text= title;};
//glyphicon-ok-sign, -remove-sign, remove-circle, ok-circle, glyphicon glyphicon-question-sign  class="info"
 var fila='<tr id="link-'+num+'">\
            <td id="link-status-'+num+'" title="Link status: ?">\
              <span id="link-icon-'+num+'" class="glyphicon glyphicon-refresh glyphicon-rotate"></span>\
            </td>\
            <td>\
              <a id="link-url-'+num+'" href="'+link+'" title="'+link+'">'+text+'</a>\
            </td>\
          </tr>';

 $( "#columnLinks" ).append(fila);

 addStatusLink(link, num);
}

function addStatusLink(url, id){
//nota: ajax para comprobar si link existe.

url=formateaUrl(url);

if( !isUrlValide(url)){
  $('#link-icon-'+id).removeClass('glyphicon-refresh');
  $('#link-icon-'+id).removeClass('glyphicon-rotate');
  return;
}

$.ajax({
  url: url,
  success: function(data){
      $('#link-'+id).addClass('info');
      $('#link-icon-'+id).removeClass('glyphicon-refresh');
      $('#link-icon-'+id).removeClass('glyphicon-rotate');

      $('#link-icon-'+id).addClass('glyphicon-ok-sign');
      $('#link-status-'+id).attr('title','Link is live.');
        
      return true;
  },
  error: function(data){
      $('#link-'+id).addClass('danger');
      $('#link-icon-'+id).removeClass('glyphicon-refresh');
      $('#link-icon-'+id).removeClass('glyphicon-rotate');

      $('#link-icon-'+id).addClass('glyphicon-minus-sign');
      $('#link-status-'+id).attr('title','Link is dead.');

      $('#link-url-'+id).css('text-decoration','line-through');

      return false;
  }
}); 
}

function inicializaTagsList(){
    var tags= $('#my-tag-list').tags({
              tagData: getHostings(listaLinks),
              suggestions: getHostings(listaLinks),
              caseInsensitive:true,
             // suggestions:["Image","Audio","Video","Multimedia","Online","Offline", "Hostings", "File","Rar","Zip","Compresed", "Direct File"],
              afterAddingTag: function(tag)
                  { //alert("add: "+tags.getTags() );
                   },
              afterDeletingTag: function(tag)
                  { //alert("del: "+tags.getTags() );
                   }
              });
}

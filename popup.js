var linksSelected;
var status='all';

$( document ).ready(function() {

chrome.tabs.executeScript(null,{file:"js/getLinks.js"},
  function(results){
    linksSelected= results[0];      
    for (var i = 0; i < linksSelected.length; i++) {
            addLink(i,linksSelected[i].text, linksSelected[i].href, linksSelected[i].title);
         };

    $('#loading').html('');
    $('#tabla-titulo').html(linksSelected.length +' Links Founds');


    //add Host To Multi Select
    var domain= getHostings(linksSelected);
    var options = [];
    for (var i = 0; i < domain.length; i++){
      options.push({label: domain[i]+' <img id="favicon-'+i+'" style="float:right;" src="" ></img>', title: domain[i], value: i, selected: true});
      addFavicon('favicon-'+i, domain[i]);
    }
    $('#multiSelectDomain').multiselect('dataprovider', options);
  });


  $('#botonCopiar').click(function(){
     var texto='';
     for (var i = 0; i < linksSelected.length; i++) {
           texto += linksSelected[i].href +"\n";
           };      
     copyTextToClipboard(texto);
   // texto = linksSelected['href'].join('\n');

    alert(linksSelected.length +" links Copiado a Clipboard");
  });


  $('#multiSelectDomain').multiselect({
           // buttonClass: 'btn btn-link',
            //buttonContainer: '<div class="btn-group" />'
            //nonSelectedText: 'Check an option!'
            //nSelectedText: ' - Too many options selected!'
            //allSelectedText: 'No option left ...'
            //numberDisplayed: 1
            //delimiterText '; ' 
            //filterBehavior: 'value'
            //enableClickableOptGroups: true,
            enableHTML:true, //By default, item text is encoded to defeat XSS injection vulnerabilities.
            disableIfEmpty: true,
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            filterPlaceholder: 'Search Domain...',
            includeSelectAllOption: true,
            buttonWidth: '100%',
            dropRight: true,
            nonSelectedText: 'Select Domain',
            allSelectedText: 'All Domain selected',
            numberDisplayed: 4,
           // maxHeight: '80%',
            //templates: {li: '<li><a href="" class=""><label></label></a></li>'},
            onDropdownHide: function(event) {
              //function for filter rows    
              filterRows();
            },

/*            buttonText: function(options, select) {
                if (options.length === 0) {
                    return 'No option selected ...';
                }
                else if (options.length > 3) {
                    return 'More than 3 options selected!';
                }
                 else {
                     var labels = [];
                     options.each(function() {
                         if ($(this).attr('label') !== undefined) {
                             labels.push($(this).attr('label'));
                         }
                         else {
                             labels.push($(this).html());
                         }
                     });
                     return labels.join(', ') + '';
                 }
            },*/
            buttonTitle: function(options, select) {
                var labels = [];
                options.each(function () {
                    labels.push( $(this).attr('title') );
                });
                return labels.join(', ');
            }
        });

//cambiar color de boton seleccionado
  $('[name="statusBoton"]').click( function(){ 
    switch(this.id){
      case 'statusBotonAll': 
            $('#statusBotonAll').addClass('btn-info');
            $('#statusBotonLive').removeClass('btn-success');
            $('#statusBotonDead').removeClass('btn-danger');
            status='all';
           break;
      case 'statusBotonLive': 
            $('#statusBotonAll').removeClass('btn-info');
            $('#statusBotonLive').addClass('btn-success');
            $('#statusBotonDead').removeClass('btn-danger');
            status='live';
            break;
      case 'statusBotonDead':
            $('#statusBotonAll').removeClass('btn-info');
            $('#statusBotonLive').removeClass('btn-success');
            $('#statusBotonDead').addClass('btn-danger');
            status='dead';
            break;     
    }
  filterRows();
  });


});


function addLink(id,text, link, title) {

  if(!link){return;};
  if(!title) {title= link;};
  if(!text || text==='...' || text===null) {text= title;};

  var host= getHost(link);
  //glyphicon-ok-sign, -remove-sign, remove-circle, ok-circle, glyphicon glyphicon-question-sign  class="info"
  var fila='<tr id="link-'+id+'" host="'+host+'" status="?" href="'+link+'">\
              <td id="link-status-'+id+'" title="Link status: ?">\
                <span id="link-icon-'+id+'" class="glyphicon glyphicon-refresh glyphicon-rotate"></span>\
              </td>\
              <td>\
                <a id="link-url-'+id+'" href="'+link+'" title="'+link+'">'+text+'</a>\
              </td>\
            </tr>';
  $( "#columnLinks" ).append(fila);


 //add Status Link
 link=formateaUrl(link);
  if( !isUrlValide(link)){
    $('#link-icon-'+id).removeClass('glyphicon-refresh');
    $('#link-icon-'+id).removeClass('glyphicon-rotate');
    $('#link-'+id).attr('status','all');
    return;
    }

  $.ajax({
    url: link,
    success: function(data){
      $('#link-'+id).addClass('info');
      $('#link-'+id).attr('status','live');

      $('#link-icon-'+id).removeClass('glyphicon-refresh');
      $('#link-icon-'+id).removeClass('glyphicon-rotate');

      $('#link-icon-'+id).addClass('glyphicon-ok-sign');
      $('#link-status-'+id).attr('title','Link is live.');
        
      return true;
    },
    error: function(data){
      $('#link-'+id).addClass('danger');
      $('#link-'+id).attr('status','dead');

      $('#link-icon-'+id).removeClass('glyphicon-refresh');
      $('#link-icon-'+id).removeClass('glyphicon-rotate');

      $('#link-icon-'+id).addClass('glyphicon-minus-sign');
      $('#link-status-'+id).attr('title','Link is dead.');

      $('#link-url-'+id).css('text-decoration','line-through');

      return false;
      }
    }); 
}

function filterRows(){

  var domainSelected = []; 
  $('#multiSelectDomain :selected').each(function(i, selected){ 
    domainSelected[i] = $(selected).attr('title'); 
    }); 

  $('.searchable tr').hide();
  var cant=0;
  linksSelected=[];
  $('.searchable tr').filter(function () {

  if( _.contains(domainSelected, $(this).attr('host')) && (status===$(this).attr('status') || status==='all') )
    {cant++;
     linksSelected.push({ href: $(this).attr('href')});
     return true;
    }
  else{return false;}
  }).show();

  $('#tabla-titulo').html(cant +' Links Founds');
}

function addFavicon(id, link){

    $.ajax({
    url: 'http://www.google.com/s2/favicons?domain='+link,
    success: function(data){ $('#'+id).attr('src', 'http://www.google.com/s2/favicons?domain='+link); },
    error: function(data){ $('#'+id).attr('src','images/blank.ico'); }
  });
}
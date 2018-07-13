//  auto close bootstrap alerts after x seconds
window.setTimeout(function() {
  $(".time-close").fadeTo(10000, 0).slideUp(700, function(){
    $(this).remove();
  });
}, 5000);

//paginação
function paginacao(target, data, element, method){
  $.ajax({
    url: element.attr('href'),
    data: data,
    type: method,
    success: function(data){
      target.html(data);
    }
  })
}

/** FUNÇÃO DE ATRIBUIÇÃO DE ELEMENTO CLONADO
* --------------------------------------------------------
* Realiza a atribuição de elemento clonado. Os valores de
* inputs do elemento clonado são formatados.
* Utilizado p/ campos de adição de multiplos elementos.
* --------------------------------------------------------
* @param clone - elemento previamente clonado
* @param target - onde o elemento será inserido em seguida
* @author Rafael Domingues Teixeira
*/
function clonar(clone, target){
    //Atribui valor nulo p/ todos os campos
    clone.find('input:not([type=radio],[type=checkbox]), select').val("");
    clone.find("input:checkbox, input:radio").prop('checked',false);
    //remoção de mensagens de erros existentes
    clone.find('label.error, div.check-icon').remove()
    clone.find('*').removeClass('error');
    //inserção do elemento
    clone.insertAfter(target);
  }

/** FUNÇÃO DE RECONTAGEM DE ELEMENTOS
* ------------------------------------------------------
* Realiza a atualização de indexes de inputs, titulo, etc.
* ------------------------------------------------------
* @param divs - Seletor de elemento p/ atribuição
* @param callback - Parametro alternativo p/ atribuição de função no laço.
* @author Rafael Domingues Teixeira
*/
function recontar(divs, callback){
  $.each(divs, function(count) {
    var campos = $(this).find('input, select');
    var label = $(this).find('label');
    var titulo = $(this).find('h4.titulo');

    titulo.text(titulo.text().replace(/\d+/, (count+1)));

    $.each(campos,function(){
      $(this).attr({
        name: $(this).attr('name').replace(/\d+/, count),
        id: $(this).attr('name').replace(/\d+/, count),
      });
    })

    // CALLBACK PARA USO DE DIVS ESPECÍFICAS
    if(jQuery.isFunction(callback))
      callback(count,$(this));
  })
}

function populateSelect(value, target, url, option, selected = null){
  var options = "<option value=''>Selecione</option>";

  if(value !== "") {
    $.ajax({
      url: main_url + url,
      method: 'GET',
      success: function (data) {
        $.each(JSON.parse(data), function (index, result) {
          options += "<option "+(selected == result[option.value] ? 'selected' : '')+" value='" + result[option.value] + "'>" + result[option.text] + "</option>";
        });

        target.empty();
        target.append(options);
      }
    });
  }
  target.empty();
  target.append(options);
  
}

function setLoading(target) {
  var loading = $('<h3></h3>').attr({'class': 'text-center'})
  var img = $('<img />').attr({'src': main_url+"assets/img/svg/load.svg"})
  img.appendTo(loading)
  target.html(loading)
}


function divAlert(message,tipo) {
  return $('<div class="alert alert-'+tipo+' alert-dismissible fade show" role="alert">'+
    message+
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
    '<span aria-hidden="true">&times;</span>'+
    '</button>'+
    '</div>');
}

// ********************* ONLOAD PAGE ******************** //
$(document).ready(function(){
  $(document).on('click','a.delete-button',function(e){
    e.preventDefault();
    $('<form method="POST" action="'+$(this).attr('href')+'" hidden><input name="_method" value="DELETE"></form>').appendTo('body').submit();
  })

  $(document).on('click','button.show-description', function(){
    $(this).removeClass('btn-primary').addClass('btn-info').find('i').removeClass('fa-plus').addClass('fa-minus');

    if($(this).hasClass('collapsed'))
      $(this).removeClass('btn-info').addClass('btn-primary').find('i').removeClass('fa-minus').addClass('fa-plus');
  })

  // EVENTOS PADRÕES DE CLONAGEM DE ELEMENTOS
  $(document).on('click', 'button.addCloned', function(){
    var clonedMain = $(this).parents('div.cloned-main');
    var clonedDiv = clonedMain.find('div.cloned-div');

    clonedMain.find('div.alert').remove();
    console.log(clonedMain.find('div.cloned-div'))
    if(clonedDiv.length == clonedMain.data('limit')){
      divAlert('<strong>Atenção!</strong> Número máximo atingido.', 'warning').insertAfter(clonedDiv.last());
      return false;
    }

    clonar(clonedDiv.first().clone(), clonedDiv.last())

    recontar(clonedMain.find('div.cloned-div'), function(i,element){
      if(i == 0)
        element.find('.delCloned').parent().hide()
      else
        element.find('.delCloned').parent().show()        
    })    
  })

  $(document).on('click', 'button.delCloned', function(){
    var clonedMain = $(this).parents('div.cloned-main')
    clonedMain.find('div.alert').remove();

    if(clonedMain.find('div.cloned-div').length != 1)
      $(this).parents('div.cloned-div').remove();
    recontar($('div.cloned-div'))
  })

  $.each($('div.cloned-main'), function(){
    recontar($(this).find('div.cloned-div'), function(i,element){
      if(i == 0)
        element.find('.delCloned').parent().hide()
      else
        element.find('.delCloned').parent().show()        
    })
  })
})


jQuery.validator.setDefaults({
  errorPlacement: function (error, element) {
    element.parents('.form-group').append(error);
  },

  highlight: function(element, errorClass, validClass){
    var icon  = '<div class="input-group-append check-icon"><span class="input-group-text"><i class="fa fa-exclamation validate-icon" aria-hidden="true" style="color:#f44336"></i></span></div>';
    $(element).addClass(errorClass)
    $(element).parents('.form-group').find('.check-icon,label.error').remove();
    $(icon).insertAfter($(element));
  },

  success: function(label){
    label.parents('.form-group').find('.check-icon,label.error').remove();
  },

  // onfocusout: function(element) {
  //   this.element(element);
  // },
});

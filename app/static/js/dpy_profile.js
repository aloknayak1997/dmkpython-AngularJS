$(document).ready(function(){

  $('.user-edit-1').click(function(){
    $(this).addClass('d-none');
    $(this).parent().parent().find('input').removeAttr('disabled');
    $(this).parent().find('button.user-save-1').removeClass('d-none');
    $(this).parent().find('button.user-cancel-1').removeClass('d-none');
  });
  $('.user-cancel-1').click(function(){
    $(this).addClass('d-none');
    $(this).parent().parent().find('input').attr('disabled',true);
    $(this).parent().find('button.user-edit-1').removeClass('d-none');
    $(this).parent().find('button.user-save-1').addClass('d-none');
  });  
  $('.user-save-1').click(function(){
    var key = $(this).parent().parent().find('input').attr('name');
    var value = $(this).parent().parent().find('input').val();
    console.log(key,value);
    
    $(this).addClass('d-none');
    $(this).parent().parent().find('input').attr('disabled',true);
    $(this).parent().find('button.user-edit-1').removeClass('d-none');
    $(this).parent().find('button.user-cancel-1').addClass('d-none');    
  });
});//Document Ends Here
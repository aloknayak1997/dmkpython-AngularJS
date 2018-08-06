/**
   * Funtion for checking erorrs on add teacher
   */
  function check_errors () {
      var errors = 0;
      $("#form-add-student").find('.invalid-feedback').remove();

      $("#id_first_name,#id_last_name,#id_email,#id_mobile,#id_dob,#id_gender,#id_class_section").each(function () {
          var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
          ($(this).val().trim().length == 0) ? ($(this).addClass('is-invalid').after(errtxt),errors++) : $(this).removeClass('is-invalid');
      });

      var erremail = '<div class="invalid-feedback">Please enter a valid email.</div>';
      (validateEmail($("#id_email").val().trim())) ? $("#id_email").removeClass('is-invalid') : ($("#id_email").addClass('is-invalid').after(erremail),errors++);

      if (errors > 0) {
          myToast('&#9755; Please provide all the fields!', {color: 'danger','duration':'4000'});
          return false;
      }
  }

$(document) .ready(function(){
  /**
   * Funtion for validating add-student fields if user clicks or skips the input.
   */
  $("#form-add-student [required]").blur(function (argument) {
      $(this).parent().find('.invalid-feedback').remove();
      var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
      // ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid') : $(this).removeClass('is-invalid');
      ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid').after(errtxt) : $(this).removeClass('is-invalid');
  });

  /**
   * Funtion for adding teachers
   */
  $('#add-student').click(function (e) {
      e.preventDefault()
      check_errors();

      var url = ip+'/onboarding/add-student/';
      var image = document.getElementById('id_image').files[0];
      
      $("#id_first_name,#id_last_name,#id_email,#id_middle_name,#id_mobile,#id_dob,#id_blood_group,#id_religion,#id_caste,#id_mother_name,#id_nationality,#id_place_of_birth,#id_address,#id_address2").each(function(){
          usr[$(this).attr('name')] = ($(this).val().trim())?$(this).val().trim():null;
      });

      usr['password'] = 123;
      usr[$("#id_gender").attr('name')]=$("#id_gender option:selected").val();
      instUsr['type']=1;
      instUsr['role']=7;
      instUsr['designation']='student';
      // instUsr[$("#id_designation").attr('name')]=$("#id_designation").val();
      instUsr[$("#id_date_of_joining").attr('name')]=$("#id_date_of_joining").val();

      // console.log(usr,instUsr);return false;

      var class_user = {};
      selected_class = $("#id_class_section option:selected").val();
      roll_no = $("#id_roll_no").val();
      if(selected_class != ""){
        class_user['selected_class']=selected_class;
        if (roll_no.trim() != ""){
          class_user['roll_no']=roll_no;
          alert(class_user['roll_no'])
      }
      else{
          class_user['roll_no']=null;
        }
      }
      else if(roll_no.trim() != ""){
        alert("without assigning class you can't assign a student roll number.");
        return;
      }
      // if(true){
      // alert(selected_class);
      // alert(class_user.length);
      // return;
      // }
      // if (class_user.length != 0) {
      
        /////////////////////////////////////////////////
        ///////////Additional Fields data handling///////
        /////////////////////////////////////////////////
      var additional_fields = {};
      // var id = '{{addition_field.id}}';
      // $('.additional_field').each(function() {
          $("#addition_field").each(function(){
            additional_fields[$(this).children('input').attr('name')] = ($(this).children('input').val())?$(this).children('input').val().trim():null;
            alert($(this).children('input').val());
          });
          console.log(additional_fields);
          // return;
        /////////////////////////////////////////////////
        
      var formData = new FormData();
          formData.append("user",JSON.stringify(usr));
          formData.append("instuser",JSON.stringify(instUsr));
          formData.append("image",image);
          formData.append("class_user",JSON.stringify(class_user))
          formData.append("additional_fields",JSON.stringify(additional_fields))
      $.ajax({
        type: "POST",
        url: url,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        contentType: false,
        processData: false,
       
        data: formData,
       
        success: function(response) {
          console.log(response);
          myToast("<h5>"+response.message+"</h5>", {color: 'success','duration':'4000'});
          location.relaod();
        },
        error: function(response) {
          console.log(response);
          var msg = "Oops something went wrong!!!";
          if (response.responseJSON) {
            if (response.responseJSON.message){
                msg = '';
                $.each(response.responseJSON.message,function(key,value){
                  msg+='<h6 class="alert-heading text-capitalize font-weight-bold">'+key+':</h6>'+value.join(", ")
                });
            }
          } myToast(msg,{color:'danger'});
        }
      });
    
  });

});
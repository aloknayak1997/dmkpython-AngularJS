  /**
   * Funtion for checking erorrs on add teacher
   */
  function check_errors () {
      var errors = 0;
      $("#form-add-teacher").find('.invalid-feedback').remove();

      $("#id_first_name,#id_last_name,#id_email,#id_mobile,#id_dob,#id_gender,#id_nationality,#id_designation").each(function () {
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
   * Funtion for validating add-teacher fields if user clicks or skips the input.
   */
  $("#form-add-teacher [required]").blur(function (argument) {
      $(this).parent().find('.invalid-feedback').remove();
      var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
      // ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid') : $(this).removeClass('is-invalid');
      ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid').after(errtxt) : $(this).removeClass('is-invalid');
  });

  /**
   * Funtion for adding teachers
   */
  $('#add-teacher').click(function (e) {
      e.preventDefault()
      check_errors();

      var url = $(this).attr('data-url'), usr = {},instUsr = {};
      var image = document.getElementById('id_image').files[0];
      
      $("#id_first_name,#id_last_name,#id_middle_name,#id_email,#id_mobile,#id_dob,#id_blood_group,#id_religion,#id_caste,#id_nationality,#id_place_of_birth,#id_address,#id_address2").each(function(){
          usr[$(this).attr('name')] = ($(this).val().trim())?$(this).val().trim():null;
      });

      usr['password'] = 123;
      usr[$("#id_gender").attr('name')]=$("#id_gender option:selected").val();
      instUsr['type']=2;
      instUsr['role']=3;
      instUsr[$("#id_designation").attr('name')]=$("#id_designation").val();
      instUsr[$("#id_date_of_joining").attr('name')]=$("#id_date_of_joining").val();

      // console.log(usr,instUsr);return false;

      var formData = new FormData();
          formData.append("user",JSON.stringify(usr));
          formData.append("instuser",JSON.stringify(instUsr));
          formData.append("image",image);

      $.ajax({
        type: "POST",
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
          console.log(response);
          myToast("<h5>"+response.message+"</h5>", {color: 'success','duration':'4000'});
        },
        error: function(err) {
          console.log(err);
          var msg = "Oops something went wrong!!!";
          if (err.responseJSON) {
            if (err.responseJSON.message){
                msg = '';
                $.each(err.responseJSON.message,function(key,value){
                  msg+='<h6 class="alert-heading text-capitalize font-weight-bold">'+key+':</h6>'+value.join(", ")
                });
            }
          } myToast(msg,{color:'danger'});
        }
      });
  });

});
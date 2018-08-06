// /**
//    * Funtion for checking erorrs on add teacher
//    */
//   function check_errors () {
//       var errors = 0;
//       $("#form-add-student").find('.invalid-feedback').remove();

//       $("#id_first_name,#id_last_name,#id_email,#id_mobile,#id_dob,#id_gender,#id_class_section").each(function () {
//           var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
//           ($(this).val().trim().length == 0) ? ($(this).addClass('is-invalid').after(errtxt),errors++) : $(this).removeClass('is-invalid');
//       });

//       var erremail = '<div class="invalid-feedback">Please enter a valid email.</div>';
//       (validateEmail($("#id_email").val().trim())) ? $("#id_email").removeClass('is-invalid') : ($("#id_email").addClass('is-invalid').after(erremail),errors++);

//       if (errors > 0) {
//           myToast('&#9755; Please provide all the fields!', {color: 'danger','duration':'4000'});
//           return false;
//       }
//   }

// $(document) .ready(function(){
//   /**
//    * Funtion for validating add-student fields if user clicks or skips the input.
//    */
//   $("#form-add-student [required]").blur(function (argument) {
//       $(this).parent().find('.invalid-feedback').remove();
//       var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
//       // ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid') : $(this).removeClass('is-invalid');
//       ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid').after(errtxt) : $(this).removeClass('is-invalid');
//   });

//   /**
//    * Funtion for adding teachers
//    */
//   $('#add-student').click(function (e) {
//       e.preventDefault()
//       check_errors();

//       var url = $(this).attr('data-url'), usr = {},instUsr = {};
//       var image = document.getElementById('id_image').files[0];
      
//       $("#id_first_name,#id_last_name,#id_email,#id_middle_name,#id_mobile,#id_dob,#id_blood_group,#id_religion,#id_caste,#id_mother_name,#id_nationality,#id_place_of_birth,#id_address,#id_address2,").each(function(){
//           usr[$(this).attr('name')] = ($(this).val().trim())?$(this).val().trim():null;
//       });

//       usr['password'] = 123;
//       usr[$("#id_gender").attr('name')]=$("#id_gender option:selected").val();
//       instUsr['type']=1;
//       instUsr['role']=7;
//       instUsr['designation']='student';
//       // instUsr[$("#id_designation").attr('name')]=$("#id_designation").val();
//       instUsr[$("#id_date_of_joining").attr('name')]=$("#id_date_of_joining").val();

//       // console.log(usr,instUsr);return false;

//       var class_user = {};
//       selected_class = $("#id_class_section option:selected").val();
//       roll_no = $("#id_roll_no").val();
//       if(selected_class != ""){
//         class_user['selected_class']=selected_class;
//         if (roll_no.trim() != ""){
//           class_user['roll_no']=roll_no;
//           alert(class_user['roll_no'])
//       }
//       else{
//           class_user['roll_no']=null;
//         }
//       }
//       else if(roll_no.trim() != ""){
//         alert("without assigning class you can't assign a student roll number.");
//         return;
//       }
//       // if(true){
//       // alert(selected_class);
//       // alert(class_user.length);
//       // return;
//       // }
//       // if (class_user.length != 0) {
      
//         /////////////////////////////////////////////////
//         ///////////Additional Fields data handling///////
//         /////////////////////////////////////////////////
//       var additional_fields = {};
//       // var id = '{{addition_field.id}}';
//       // $('.additional_field').each(function() {
//           $("#addition_field").each(function(){
//             additional_fields[$(this).children('input').attr('name')] = ($(this).children('input').val())?$(this).children('input').val().trim():null;
//             alert($(this).children('input').val());
//           });
//           console.log(additional_fields);
//           // return;
//         /////////////////////////////////////////////////
      
//       var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();    
//       var formData = new FormData();
//           formData.append("user",JSON.stringify(usr));
//           formData.append("instuser",JSON.stringify(instUsr));
//           formData.append("image",image);
//           formData.append("csrfmiddlewaretoken",csrftoken);
//           formData.append("class_user",JSON.stringify(class_user))
//           formData.append("additional_fields",JSON.stringify(additional_fields))
//       $.ajax({
//         type: "POST",
//         url: url,
//         contentType: false,
//         processData: false,
       
//         data: formData,
       
//         success: function(response) {
//           console.log(response);
//           myToast("<h5>"+response.message+"</h5>", {color: 'success','duration':'4000'});
//           location.relaod();
//         },
//         error: function(response) {
//           console.log(response);
//           var msg = "Oops something went wrong!!!";
//           if (response.responseJSON) {
//             if (response.responseJSON.message){
//                 msg = '';
//                 $.each(response.responseJSON.message,function(key,value){
//                   msg+='<h6 class="alert-heading text-capitalize font-weight-bold">'+key+':</h6>'+value.join(", ")
//                 });
//             }
//           } myToast(msg,{color:'danger'});
//         }
//       });
    
//   });

// });


$(document).ready(function() { 
              
              $("#first_name").prop('disabled', true);
              $("#middle_name").prop('disabled', true);
              $("#last_name").prop('disabled', true);
              $("#email").prop('disabled', true);
              $("#mobile").prop('disabled', true);
              $("#dob").prop('disabled', true);
              $("#religion").prop('disabled', true);
              $("#caste").prop('disabled', true);
              $("#adhar_no").prop('disabled', true);
              $("#gender").prop('disabled', true);
              $("#blood_group").prop('disabled', true);
              $("#profile_file").prop('disabled', true);
              $("#nationality").prop('disabled', true);
              $("#place_of_birth").prop('disabled', true);
              $("#date_of_addmission").prop('disabled', true);
              $("#address").prop('disabled', true);
              $("#address2").prop('disabled', true);
              $("#save_personal").prop('hidden', true);
              $("#cancel_personal").prop('hidden', true);

              // alert("hello");
           });
            $("#edit_personal").click(function(){
              $("#first_name").prop('disabled', false);
              $("#middle_name").prop('disabled', false);
              $("#last_name").prop('disabled', false);
              $("#email").prop('disabled', false);
              $("#mobile").prop('disabled', false);
              $("#dob").prop('disabled', false);
              $("#date_of_addmission").prop('disabled', false);
              $("#religion").prop('disabled', false);
              $("#caste").prop('disabled', false);
              $("#adhar_no").prop('disabled', false);
              $("#gender").prop('disabled', false);
              $("#blood_group").prop('disabled', false);
              $("#profile_file").prop('disabled', false);
              $("#nationality").prop('disabled', false);
              $("#place_of_birth").prop('disabled', false);
              $("#address").prop('disabled', false);
              $("#address2").prop('disabled', false);
              $("#save_personal").prop('hidden', false);
              $("#cancel_personal").prop('hidden', false);
              $("#edit_personal").prop('hidden', true);

              $('#first_name').parent().css('borer','1px solid green')
              // alert("hello");
              $("#edit_admin").prop('disabled', true);
            });
            
            $("#cancel_personal").click(function(){
              window.location.reload();
            });

            var picker1 = new Pikaday({field: document.getElementById('date_of_addmission'),format: 'YYYY-MM-DD'});
            var picker2 = new Pikaday({field: document.getElementById('dob'),format: 'YYYY-MM-DD'});


            // $('.datepick').each(function(){
            //     $(this).datepicker();
            //   });
            $("#save_personal").click(function(){
              
              var url = "{% url 'dashboard:update_student_profile' id=form.id %}";
              var formData = {};
                      
                      // formData.push($("#first_name").val());
                      // formData.push($("#middle_name").val());
                      // formData.push($("#last_name").val());
                      // formData.push($("#email").val());
                      // formData.push($("#mobile").val());
                      // formData.push($("#dob").val());
                      // formData.push($("#religion").val());
                      // formData.push($("#caste").val());
                      // formData.push($("#adhar_no").val());
                      // formData.push($("#gender").val());
                      // formData.push($("#blood_group").val());
                      // formData.push(1);//for personal data to verify on views.py
              
                      

                      console.log(formData)
                      var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
                        $.ajax({
                        type: "post",
                        url: url,
                        data:{
                          'formData' : formData,
                        },
                        success: function(response) {
                          console.log(response);
                          alert("successfully updated.");
                          location.reload();
                        },
                        error: function(response) {
                          console.log(response);
                        }

                      });
            });
          
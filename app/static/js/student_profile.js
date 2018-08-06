
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
              $("#religion").prop('disabled', false);
              $("#caste").prop('disabled', false);
              $("#adhar_no").prop('disabled', false);
              $("#gender").prop('disabled', false);
              $("#blood_group").prop('disabled', false);
              $("#profile_file").prop('disabled', false);
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

            $("#save_personal").click(function(){
              
              var url = "{% url 'dashboard:update_student_profile' id=form.id %}";
              var formData = [];
                      formData.push($("#first_name").val());
                      formData.push($("#middle_name").val());
                      formData.push($("#last_name").val());
                      formData.push($("#email").val());
                      formData.push($("#mobile").val());
                      formData.push($("#dob").val());
                      formData.push($("#religion").val());
                      formData.push($("#caste").val());
                      formData.push($("#adhar_no").val());
                      formData.push($("#gender").val());
                      formData.push($("#blood_group").val());
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
$(document).ready(function () {
    /**
     * Funtion for checking erorrs on tab 1
     */
    function tab_1_errors () {
        var errors = 0;
        $("#form-tab-1").find('.invalid-feedback').remove();

        $("#id_name,#id_institute_email,#id_contact,#id_board,#id_address,#id_pin_code,#id_nature").each(function (argument) {
            var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
            ($(this).val().trim().length == 0) ? ($(this).addClass('is-invalid').after(errtxt),errors++) : $(this).removeClass('is-invalid');
        });

        // var err_nature = '<div class="invalid-feedback">Enter '+$("#id_nature").attr('placeholder')+'</div>';
        // ($("#id_nature option:selected").val().length == 0) ? ($("#id_nature").addClass('is-invalid').after(err_nature),errors++) : $("#id_nature").removeClass('is-invalid');

        var erremail = '<div class="invalid-feedback">Please enter a valid email.</div>';
        (validateEmail($("#id_institute_email").val().trim())) ? $("#id_institute_email").removeClass('is-invalid') : ($("#id_institute_email").addClass('is-invalid').after(erremail),errors++);

        if (errors > 0) {
            myToast('Please provide all the fields!', {color: 'danger','duration':'4000'});
            return false;
        }else{
            $('#nav-profile-tab').tab('show')
        }        
    }

    /**
     * Funtion for checking erorrs on tab 2
     */
    function tab_2_errors (argument) {
        var errors = 0;
        $("#form-tab-2").find('.invalid-feedback').remove();

        $("#id_username,#id_first_name,#id_last_name,#id_email,#id_mobile,#id_type,#id_designation,#id_password,#id_password2").each(function (argument) {
            var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
            ($(this).val().trim().length == 0) ? ($(this).addClass('is-invalid').after(errtxt),errors++) : $(this).removeClass('is-invalid');
        });

        var erremail = '<div class="invalid-feedback">Please enter a valid email.</div>';
        (validateEmail($("#id_email").val().trim())) ? $("#id_email").removeClass('is-invalid') : ($("#id_email").addClass('is-invalid').after(erremail),errors++);

        if (errors > 0) {
            myToast('Please provide all the fields!', {color: 'danger','duration':'4000'});
            return false;
        }else{
            $('#nav-profile-tab').tab('show')
        }        
    }

    $("#form-tab-1 [required], #form-tab-2 [required]").blur(function (argument) {
    // $("#id_name,#id_institute_email,#id_contact,#id_board,#id_address,#id_pin_code,#id_nature").blur(function (argument) {
        $(this).parent().find('.invalid-feedback').remove();
        var errtxt = '<div class="invalid-feedback">'+$(this).attr('placeholder')+' is required.</div>';
        ($(this).val().trim().length == 0) ? $(this).addClass('is-invalid').after(errtxt) : $(this).removeClass('is-invalid');
    });

    $('#goto-next').on('click', function (e) {
        e.preventDefault()
        tab_1_errors();
    });

    $('#onboard-institute').click(function (e) {
        e.preventDefault()
        tab_2_errors();

        var url = $(this).attr('data-url'), inst = {},usr = {},instUsr = {};
        var logo = document.getElementById('id_logo').files[0];
        var school_image = document.getElementById('id_school_image').files[0];
        var image = document.getElementById('id_image').files[0];
        
        $("#id_name,#id_institute_email,#id_contact,#id_board,#id_university,#id_address,#id_city,#id_pin_code,#id_state").each(function(){
            inst[$(this).attr('name')] = $(this).val();
        });
        $("#id_first_name,#id_middle_name,#id_last_name,#id_email,#id_mobile,#id_password,#id_password2").each(function(){
            usr[$(this).attr('name')] = $(this).val();
        });

        inst[$("#id_nature").attr('name')]=$("#id_nature option:selected").val();
        instUsr[$("#id_type").attr('name')]=$("#id_type option:selected").val();
        instUsr[$("#id_level").attr('name')]=$("#id_level option:selected").val();
        instUsr[$("#id_designation").attr('name')]=$("#id_designation").val();
        instUsr[$("#id_date_of_joining").attr('name')]=$("#id_date_of_joining").val();

        // console.log(inst,usr,instUsr);return false;

        var formData = new FormData();
            formData.append("institute",JSON.stringify(inst));
            formData.append("user",JSON.stringify(usr));
            formData.append("instuser",JSON.stringify(instUsr));
            formData.append("logo",logo);
            formData.append("school_image",school_image);
            formData.append("image",image);

        $.ajax({
          type: "POST",
          url: url,
          data: formData,
          contentType: false,
          processData: false,
          success: function(response) {
            console.log(response);
          },
          error: function(err) {
            console.log(err);
          }
        });
    });

});
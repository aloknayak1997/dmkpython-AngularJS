  /**
   * Variables for add-class div animating
   */
  var current_pg, next_pg, previous_pg; //fieldsets
  var left, opacity, scale; //fieldset properties which we will animate
  var animating; //flag to prevent quick multi-click glitches


  /**
   * This function animates to the next page
   * @param {dom-object} next_pg
   */
  function next_animate(next_pg) {
      console.log(animating);
      if (animating) return false;
      animating = true;
      // $("#progressbar li").eq($("div.add-class-body").index(next_pg)).addClass("active");
      //show the next fieldset
      next_pg.show();
      //hide the current fieldset with style
      current_pg.animate({
          opacity: 0
      }, {
          step: function(now, mx) {
              left = (now * 10) + "%";
              opacity = 1 - now;
              current_pg.css({ 'transform': 'scale(' + scale + ')' });
              next_pg.css({ 'left': left,'opacity': opacity });
              // next_pg.css({ 'margin-left': '95px'});
          },
          duration: 200,
          complete: function() {
              current_pg.hide();
              animating = false;
          },
          easing: 'easeInOutBack'
      });
  }


  /**
   * This function adds appends class checkbox for applying sessions in second tab.
   * @param {obj} success respone-data of addclas api
   */
  function append_session_data(data) {
    var d = '';
    $('.remove-chk').remove();
    $.each(data,function(key,value) {
      var class_name = (value.division) ? value.standard+'-'+value.division:value.standard;
      d+='<div class="custom-control custom-checkbox remove-chk">'
            +'<input type="checkbox" class="custom-control-input sess-chk-class" disabled checked="" id="sess-cbox-'+value.id+'" data-cid="'+value.id+'">'
            +'<label class="custom-control-label" for="sess-cbox-'+value.id+'">'+class_name+'</label>'
          +'</div>';
    });
    $('.session-select-all').after(d);
  }//End


  /**
   * This function appends class and session data to table for adding subjects.
   * @param {obj} class_data: success respone-data of add-class api
   * @param {obj} session_data: success respone-data of add-session api
   */
  function append_subject_data(class_data,session_data) {
    var coll = '', btn = '', class_map = {};
    
    $('#cssub-collapse-trigger').empty();
    $('.sub-clps').remove();
    
    
    $.each(class_data,function(key,value) {
      var class_name = (value.division) ? value.standard+'-'+value.division:value.standard;
      class_map[value.id]=class_name;
        btn+='<label class="btn btn-secondary mr-1" data-toggle="collapse" href="#sub-collapse-'+value.id+'" role="button" aria-expanded="false" aria-controls="sub-collapse-'+value.id+'">'
                +'<input type="checkbox" checked="false" autocomplete="off">'+class_name+' '
              +'</label>';
    });
    $('#cssub-collapse-trigger').append(btn);

    $.each(session_data,function(key,value){
      coll+='<div class="col sub-clps">'
              +'<div class="collapse multi-collapse mb-3" id="sub-collapse-'+value.ic+'">'
                +'<div class="card card-body">'+'<h5 class="card-title text-primary">Add Subject for '+class_map[value.ic]+'</h5>'
                  +'<div class="input-group mb-3 mt-3">'
                    +'<input type="text" class="form-control" placeholder="Enter Subject Name">'
                    +'<div class="input-group-append">'
                      +'<button class="btn btn-outline-secondary add-sess-sub" type="button" data-ic_id="'+value.ic+'" data-id="'+value.id+'">Add</button>'
                    +'</div>'
                  +'</div>'
                  +'<div class="col-md-12" id="append-sess-sub-'+value.ic+'"></div>'
                +'</div>'
              +'</div>'
            +'</div>';
    });
    $('#cssub-collapse-trigger').after(coll);

  }//End


  /**
   * This function adds standard-division of a class by calling ajax request.
   * @param none
   */
  function add_stan_sec(_parent) {
    current_pg = _parent;
    var fieldsetValue = $("div.add-class-body").index(current_pg);

    var stan_sec = [];
    var department_id = parseInt($('.select-dept option:selected').val());
    
    (department_id.length == 0)?myToast("&#9755; Please select Department!",{color:'danger'}):false;

    $('.st-cloned-row').each(function(){
      var standard = $(this).children().find('input.c-standard').val().trim();
      var division = $(this).children().find('input.c-division').val().trim().split(",");
      $.each(division,function(key,value){
        stan_sec.push({'standard':standard,'division':value.trim()});
      })
    });

    $.ajax({
        url: profiling_urls.addclass, 
        method: "POST",
        // contentType: "application/json",
        // dataType: "json",
        data:{
          'department_id':parseInt(department_id),
          'data':JSON.stringify(stan_sec),
          csrfmiddlewaretoken: g_csrftoken
        }
    }).done(function(resp) {
        if(resp.status == true){
            myToast("<h5>"+resp.message+"</h5>",{color:'success'});
            append_session_data(resp.data);
            next_pg = current_pg.next();
            next_animate(next_pg);
            /**
             * This function submits an ajax-request to add class session's.
             * @param none
             */
            $('.set-class-session').click(function(){
              add_class_session($(this).parent(),resp.data);
            });            
        }
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      if (err.responseJSON) {
        console.log(err.responseJSON);
        // (err.responseJSON.non_field_errors) ? msg = err.responseJSON.non_field_errors.join():false;
      }
      myToast(msg,{color:'danger'});
    });      
  }//End


  /**
   * This function posts an ajax-request to add class session's.
   * @param none
   */
  function add_class_session(_parent,class_data) {
    current_pg = _parent;

    var session = [];
    var sd = $('#id_session_start option:selected').val();
    var ed = $('#id_session_end option:selected').val();

    $('.sess-chk-class').each(function(){
      var ic_id = $(this).attr('data-cid');
      if($(this).is(":checked"))
        session.push({'ic':parseInt(ic_id),'start_month':parseInt(sd),'end_month':parseInt(ed)});
    });
    $.ajax({
        url: profiling_urls.addsession, 
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // data:{
        //   data:session,
        //   csrfmiddlewaretoken: g_csrftoken
        // }
        csrfmiddlewaretoken: g_csrftoken,
        data : JSON.stringify(session),
    }).done(function(resp) {
        if(resp.status == true){
            myToast("<h5>"+resp.message+"</h5>",{color:'success'});
            next_pg = current_pg.next();
            next_animate(next_pg);
            append_subject_data(class_data,resp.data);
        }
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      if (err.responseJSON) {
        console.log(err.responseJSON);
        // (err.responseJSON.non_field_errors) ? msg = err.responseJSON.non_field_errors.join():false;
      }
      myToast(msg,{color:'danger'});
    });    
  }//End


  /**
   * This function posts an ajax-request to add class session subject's.
   * @param none
   */
  function add_class_sess_sub(_parent) {
    var subjects = [];
    current_pg = _parent;

    $('.sess-sub-badge').each(function(){
        subjects.push({'cs':parseInt($(this).attr('data-cs_id')),'name':$(this).attr('data-sub_name')});
    });

    $.ajax({
        url: profiling_urls.addsessionsub, 
        method: "POST",
        data:{ 'data':JSON.stringify(subjects), csrfmiddlewaretoken: g_csrftoken }
    }).done(function(resp) {
        if(resp.status == true){
            // next_pg = current_pg.next();// next_animate(next_pg);
          myToast("<h5>"+resp.message+"</h5>",{color:'success'});
          setTimeout(function(){ window.location.reload(); },3000);
        }
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      if (err.responseJSON) {
        console.log(err.responseJSON);
        // (err.responseJSON.non_field_errors) ? msg = err.responseJSON.non_field_errors.join():false;
      }
      myToast(msg,{color:'danger'});
    });    
  }//End

$(document).ready(function(){
  /**
   * This function checks for which page next button is clicked.
   * If first page next btn is clicked then call add-class ajax else just got to next page,
   * By calling next_animate() function.
   */
  $(".next").click(function() {
      current_pg = $(this).parent();
      var fieldsetValue = $("div.add-class-body").index(current_pg);
      if (fieldsetValue == 0) {
          next_pg = current_pg.next();
          next_animate(next_pg);
      }
      if (fieldsetValue == 1) {
          next_pg = current_pg.next();
          next_animate(next_pg);
      }
  });

  /**
   * This function animates to the previous page
   */
  $(".previous").click(function() {
      if (animating) return false;
      animating = true;
      current_pg = $(this).parent();
      previous_pg = $(this).parent().prev();
      // $("#progressbar li").eq($("div.add-class-body").index(current_pg)).removeClass("active");
      //show the previous fieldset
      previous_pg.show();

      $('#error_msg').text('');
      //hide the current fieldset with style
      current_pg.animate({
          opacity: 0
      }, {
          step: function(now, mx) {
              //as the opacity of current_pg reduces to 0 - stored in "now"
              //1. scale previous_pg from 80% to 100%
              scale = 0.8 + (1 - now) * 0.2;
              //2. take current_pg to the right(50%) - from 0%
              left = ((1 - now) * 20) + "%";
              //3. increase opacity of previous_pg to 1 as it moves in
              opacity = 1 - now;
              current_pg.css({'left': left});
              previous_pg.css({'transform': 'scale(' + scale + ')','opacity': opacity});
          },
          duration: 200,
          complete: function() {
              current_pg.hide();
              animating = false;
          },
          //this comes from the custom easing plugin
          easing: 'easeInOutBack'
      });
  });//ENd


  /**
   * This function adds a clone for standard-division groups.
   * @param none
   */
  $(".add-stan-sec").click(function() {
    var err = '';
    ($('.c-standard').val().trim().length == 0)?err+="&#9755; Please Enter standard":false;
    
    if (err.length > 0) { 
      myToast(err,{color:'danger'});
      return false;
    }

    var clone = $('.first-row').clone().removeClass('first-row').addClass('st-cloned-row');
        clone.children('div.action-btn-1').remove();
        clone.children('div.action-btn-2').removeClass('d-none');
        clone.children().find('input').attr('disabled',true);
    $('.first-row').children().find('input').val('');
    $('.second-row').before(clone);
    $('.submit-stan-sec').removeClass('d-none');
  });


  /**
   * This function removes a clone for standard-division groups.
   * @param none
   */
  $("body").delegate('.remove-stan-sec','click',function() {
    $(this).parent().parent().remove();
    ($('.st-cloned-row').length == 0) ? $('.submit-stan-sec').addClass('d-none') : false;
  });


  /**
   * This function adds standard-division of a class by calling ajax request.
   * @param none
   */
  $(".submit-stan-sec").click(function() {
    add_stan_sec($(this).parent());
  });//End


  /**
   * This function checks or un-checks all class in add-session page.
   * @param none
   */
  $('#sess-check-all').click(function(){
    if ($(this).is(":checked")) {
      $('.sess-chk-class').prop('checked',true);
    } else {
      $('.sess-chk-class').prop('checked',false);
    }
  });


  /**
   * This function appends subject badges to its respective div for the class.
   * @param none
   */
  $('body').delegate('.add-sess-sub','click',function(){
    var cs_id = $(this).attr('data-id');
    var ic_id = $(this).attr('data-ic_id');
    var sub_name = $(this).parent().parent().find('input').val().trim();
    (sub_name.length == 0)?myToast("Please enter subject to add!",{color:'danger'}):false;
    $("#append-sess-sub-"+ic_id).append('<span class="badge badge-pill badge-secondary sess-sub-badge mr-2" data-ic_id="'+ic_id+'" data-cs_id="'+cs_id+'" data-sub_name="'+sub_name+'">'+sub_name+'<i class="fa fa-times remove-sub p-2" style="cursor:pointer;"></i></span>');
    $(this).parent().parent().find('input').val('');
  });


  /**
   * This function removes subject badges from its respective div.
   * @param none
   */
  $('body').delegate('.remove-sub','click',function(){
    $(this).parent().remove();
  });


  /**
   * This function adds class-session-subjects of a class by calling ajax request.
   * @param none
   */
  $(".submit-sess-sub").click(function() {
    add_class_sess_sub($(this).parent());
  });//End

});//ENd Document Ready Function
  var sub_map = {}, teach_map = {};
  /**
   * This function get institutes class.
   * @param none
   */
  function getInstituteClass() {

    $.ajax({
        url: timetable_urls.class, 
        method: "GET",
        data:{}
    }).done(function(resp) {
      var d = '<option value="" selected>Select Class</option>';
      $.each(resp.data,function(index,value){
        var class_name = (value.division)?value.standard+' '+value.division:value.standard;
        d+= '<option value="'+value.id+'">'+class_name+'</option>';
      });
      $('#select-class').html(d);
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger',duration:2000});
    });
  }//End

  /**
   * This function get class subjects.
   * @param none
   */
  function getClassSubjects(ic_id) {
    $('.append-subjects').empty();
    emptyObject(sub_map);
    $.ajax({
        url: timetable_urls.subbyclass+'/'+ic_id, 
        method: "GET",
        data:{}
    }).done(function(resp) {
      var d = '';
      $.each(resp.data,function(index,value){
        sub_map[value.name] = value.css_id;
        d+= '<div class="ml-2 custom-control custom-radio">'
              +'<input value="'+value.name+'" data-subject_id="'+value.css_id+'" type="radio" id="cr-sub-'+value.css_id+'" name="crds1" class="custom-control-input">'
              +'<label class="custom-control-label" for="cr-sub-'+value.css_id+'">'+value.name+'</label>'
            +'</div>';
      });
      $('.append-subjects').html(d);
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger',duration:2000});
    });
  }//End

  /**
   * This function get institutes teachers.
   * @param none
   */
  function getInstituteTeachers() {
    $('.append-teacher').empty();
    $.ajax({
        url: timetable_urls.viewteachers, 
        method: "GET",
        data:{}
    }).done(function(resp) {
      var d='';
      $.each(resp.data,function(index,value){
        teach_map[value['first_name']+' '+value['last_name']] = value['user_id'];
        d+= '<div class="ml-2 custom-control custom-radio">'
              +'<input value="'+value['first_name']+' '+value['last_name']+'" data-teacher_id="'+value['user_id']+'" type="radio" id="cr-teach-'+value['user_id']+'" name="crds2" class="custom-control-input">'
              +'<label class="custom-control-label" for="cr-teach-'+value['user_id']+'" >'+value['first_name']+' '+value['last_name']+'</label>'
            +'</div>';
      });
      $('.append-teacher').append(d);
    }).fail(function(err) {
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger',duration:2000});
    });
  }//End

  /**
   * This function get class session user's by class id and type.
   * @param none
   */
  function getCssUser(ic_ic) {
    $('.ts-err-text').addClass('d-none');
    $('.append-ts').empty();
    $.ajax({
        url: '/profiling/cssuser-by-cid/'+ic_ic+'/2', 
        method: "GET",
        data:{}
    }).done(function(resp) {
      (!isEmpty(resp.data))?$('.ts-err-text').addClass('d-none'):$('.ts-err-text').removeClass('d-none');
      var d='';
      $.each(resp.data,function(index,value){
        d+= '<h6 class="ml-2 mb-2 border-secondary draggable ts-combination" data-teacher_id="'+value.user_id+'" data-subject_id="'+value.css_id+'">'+value['first_name']+' '+value['last_name']+'-'+value.name+'</h6>';
      });
      $('.append-ts').append(d);
      $(".draggable").draggable({revert: "invalid", helper: 'clone'});
    }).fail(function(err) {
      $('.ts-err-text').removeClass('d-none');
    });
  }//End
  
  function getDayLec(row,col) {
    var lecture_no = $('table').eq(0).find('tr').eq(0).find('td').eq(col).text();
    var day_id = day_arr[$('table').eq(0).find('tr').eq(row).find('td').eq(0).text().trim().toLowerCase()];
    return {'lecture_no':lecture_no,'day_id':day_id};
  }

  function deleteLecture(lecture_id,row,col,ht) {
    $.ajax({
        url: '/profiling/manage-lecture/'+lecture_id,
        method: "PATCH",
        data:{ 'data':JSON.stringify({'status':0}),csrfmiddlewaretoken: g_csrftoken}
    }).done(function(resp) {
        if(resp.status == true){
          myToast("<h6>"+resp.message+"</h6>",{color:'success'});
          ht.setDataAtCell(row, col, '');
          $('table').eq(0).find('tr').eq(row).find('td').eq(col).attr('data-obj',JSON.stringify([]));
        }
    }).fail(function(err) {
      console.log(err);
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger'});
    });     
  }

  function deleteLecture(lecture_id,row,col,ht) {
    $.ajax({
        url: '/profiling/manage-lecture/'+lecture_id,
        method: "PATCH",
        data:{ 'data':JSON.stringify({'status':0}),csrfmiddlewaretoken: g_csrftoken}
    }).done(function(resp) {
        if(resp.status == true){
          myToast("<h6>"+resp.message+"</h6>",{color:'success'});
          ht.setDataAtCell(row, col, '');
          $('table').eq(0).find('tr').eq(row).find('td').eq(col).attr('data-obj',JSON.stringify([]));
        }
    }).fail(function(err) {
      console.log(err);
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger'});
    });     
  }

  function add_teach_sub() {
    var err='';
    ($('.teach-sub').attr('data-teacher_id')) ? false:err+='<h6>&#9755; No teacher selected!</h6>';
    ($('.teach-sub').attr('data-subject_id')) ? false:err+='<h6>&#9755; No subject selected!</h6>';
    ($('#select-class option:selected').val()) ? false:err+='<h6>&#9755; No class selected!</h6>';
    
    if (err.length > 0) {
      myToast('<h6><strong>Oops...</strong><h6>'+err, {color: 'danger','duration':'4000'});
      return false;
    }

    $.ajax({
        url: timetable_urls.cssuser,
        method: "POST",
        data:{  user:$('.teach-sub').attr('data-teacher_id'),
                ic:$('#select-class option:selected').val(),
                css:$('.teach-sub').attr('data-subject_id'),
                user_type:2,
                csrfmiddlewaretoken: g_csrftoken
        }
    }).done(function(resp) {
        if(resp.status == true){
          myToast("<h6>"+resp.message+"</h6>",{color:'success'});
        }
    }).fail(function(err) {
      console.log(err);
      var msg = "Oops something went wrong!!!";
      myToast(msg,{color:'danger'});
    });     
  }

  var arr = {};
  $(document).ready(function () {

    getInstituteClass();
    getInstituteTeachers();

    $('#select-class').change(function(){
      getClassSubjects($('option:selected',this).val());
      getCssUser($('option:selected',this).val());
    });

    $('[data-toggle="tooltip"]').tooltip({
      animation:false,
      trigger:"hover"
    });

    $('.clockpicker').clockpicker({autoclose:true,twelvehour: true}).find('input').change(function(){
      $('.time-table-time').text($('.time-picker-1').val()+'-'+$('.time-picker-2').val());
      // TODO: time changed
      console.log(this.value);
    });

    $('body').delegate('input[name="crds2"]','click',function(){
      var sub = ($('input[name="crds1"]:checked').val()) ? $('input[name="crds1"]:checked').val() : 'Select Subject';
      $('.teach-sub').html($(this).val()+'-'+sub).attr('data-teacher_id',$(this).attr('data-teacher_id'));
    });
    $('body').delegate('input[name="crds1"]','click',function(){
      var teach = ($('input[name="crds2"]:checked').val()) ? $('input[name="crds2"]:checked').val() : 'Select Teacher';
      $('.teach-sub').html(teach+'-'+$(this).val()).attr('data-subject_id',$(this).attr('data-subject_id'));;
    });

    var data = [
      ['','1', '2', '3', '4', 'Break', '5'],
      ['','07:00AM-08:00AM', '08:00AM-09:00AM', '09:00AM-10:00AM', '10:00AM-11:00AM', '11:00AM-12:00AM', '12:00AM-01:00PM'],
      ["Monday", '', '', '', '', '', ''],
      ["Tuesday", '', '', '', '', '', ''],
      ["Wednesday", '', '', '', '', '', ''],
      ["Thursday", '', '', '', '', '', ''],
      ["Friday", '', '', '', '', '', ''],
      ["Saturday", '', '', '', '', '', ''],
      ["Sunday", '', '', '', '', '', '']
    ];

    for (var i = 1; i < 8; i++) {//day loop
      arr[i]={};
      for (var j = 1; j < 7; j++) {//lecture loop excluding break
        arr[i][j] = [];
      }
    }

    var container = document.getElementById('excel_table');
    var hot = new Handsontable(container, {
      data: data,
      // rowHeaders: [ "", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      // rowHeaders: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      // rowHeaders: true,
      // colHeaders: true,
      contextMenu: true,
      manualColumnResize: true,
      manualRowResize: true,
      // colWidths: 60,
      rowHeights: 30,
      customBorders:true,
      // undo:false,
      // redo:false,
      autoInsertRow:false,
      allowInsertRow: false,
      fillHandle:false,
      cells: function(row, col, prop) {
        var cellProperties = {};
        if (row === 0) {
          // cellProperties.className = 'disabled'
          // cellProperties.editor = 'time';
          cellProperties.readOnly = true;
          cellProperties.className = 'htCenter';
        }
        // if (row === 1 || col === 0 || col === 5) {
        // }
        cellProperties.readOnly = true;
        cellProperties.editor = false;//cannot edit but paste
        return cellProperties;
      },
      contextMenu: {
        callback: function (key, options) {
          if (key === 'clear') {
            $.each(options,function(key,value){
              for (var i = value.start.row; i <= value.end.row; i++) {
                for (j=value.start.col;j <= value.end.col;j++) {
                  hot.setDataAtCell(i, j, '');
                  $('table').eq(0).find('tr').eq(i).find('td').eq(j).removeAttr('data-obj');
                }
              }
            });
          }
        },
        items: {
          "undo":{},
          "clear":{name:'Clear Column (ctrl+delete)'},
          "redo":{},
        }
      },
      // mergeCells: true,
      selectionMode:'single',
    });

    $(".draggable").draggable({revert: "invalid", helper: 'clone'});

    // $('.draggable').click(function() {
    //   //$("#excel_table").insertAtCaret($(this).text());
    //   return false
    // });

    $("#excel_table").droppable({
        accept: ".draggable",
        drop: function(event, ui) {
            var ht = hot.getInstance();
            ui.helper.hide();
            var $destination = $(document.elementFromPoint(event.clientX, event.clientY));
            var $tr = $destination.closest('tr');
            var $tbody = $tr.closest('tbody');
            
            var col = $tr.children().index($destination);
            var row = $tbody.children().index($tr);
            // && !$('table').eq(0).find('tr').eq(row).find('td').eq(col).hasClass('htDimmed')
            if (row == 1) {
              ht.setDataAtCell(row, col, ui.draggable.text());
            }
            if (row >= 2 && col >= 1) {//Excluding 1st,2nd row and 1st column
              var old_data = (ht.getDataAtCell(row, col))? ht.getDataAtCell(row, col)+'\n':'';
              var lec_no = $('table').eq(0).find('tr').eq(0).find('td').eq(col).text();
              var lec_time = $('table').eq(0).find('tr').eq(1).find('td').eq(col).text().split("-");

              var ic_id = $('#select-class option:selected').val();
              var day_id = day_arr[$('table').eq(0).find('tr').eq(row).find('td').eq(0).text().trim().toLowerCase()];
              var sid = ui.draggable.attr('data-subject_id');
              var tid = ui.draggable.attr('data-teacher_id');
              var st = fnc_12_to_24(lec_time[0]);
              var et = fnc_12_to_24(lec_time[1]);

              var json = {'day_id':day_id,'start_time':st,'end_time':et,'lecture_no':lec_no,'css':sid,'user':tid,'ic_id':ic_id};

              $.ajax({
                  url: timetable_urls.managett,
                  method: "POST",
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  csrfmiddlewaretoken: g_csrftoken,
                  data:JSON.stringify(json)
              }).done(function(resp) {
                  if(resp.status == true){

                    var data_obj = $('table').eq(0).find('tr').eq(row).find('td').eq(col).attr('data-obj');
                    (data_obj) ? (data_obj = JSON.parse(data_obj),data_obj.push(resp.data.id)):data_obj = [resp.data.id];
                    myToast("<h6>"+resp.message+"</h6>",{color:'success'});
                    ht.setDataAtCell(row, col, old_data+ui.draggable.text());
                    $('table').eq(0).find('tr').eq(row).find('td').eq(col).attr('data-obj',JSON.stringify(data_obj));
                  }
              }).fail(function(err) {
                console.log(err);
                var msg = "Oops something went wrong!!!";
                myToast(msg,{color:'danger'});
              }); 

              // arr[day_id][lec_no].push({'t':tid,'s':sid,'st':st,'et':et});

              // ht.setDataAtCell(row, col, old_data+ui.draggable.text());
              
              // $('table').eq(0).find('tr').eq(row).find('td').eq(col).attr('data-obj',JSON.stringify(data_obj));

              // console.log('day_id:',day_id,' lecture no: ',lec_no,' st: ',st,' et: ',et);
            }
        },
        over: function(event, elem) {
            $(this).addClass("over");
            console.log("over");
        },
        out: function(event, elem) {
            $(this).removeClass("over");
        }
    });

    //Add custom functions to table on key press(ctrl+custom_key)
    document.addEventListener("keydown", function(event) {
      var ctrl = event.ctrlKey;
      var key = event.key;
      
      if (ctrl) {
        if (key === 'Delete') {
          console.log(hot.getSelected());
          for (var i = hot.getSelected()[0][0]; i <= hot.getSelected()[0][2]; i++) {
            for (j=hot.getSelected()[0][1];j <= hot.getSelected()[0][3];j++) {
              // var lecture_no = $('table').eq(0).find('tr').eq(0).find('td').eq(j).text();
              // var day_id = day_arr[$('table').eq(0).find('tr').eq(i).find('td').eq(0).text().trim().toLowerCase()];
              // hot.setDataAtCell(i, j, '');
              // arr[day_id][lecture_no].length = 0;
              var ids = $('table').eq(0).find('tr').eq(i).find('td').eq(j).attr('data-obj');
              if (ids.length > 0) {
                ids = JSON.parse(ids);
                for (var ind = 0;ind < ids.length;ind++){
                  deleteLecture(ids[ind],i,j,hot);
                }
              } else {
                hot.setDataAtCell(i, j, '')
                $('table').eq(0).find('tr').eq(i).find('td').eq(j).attr('data-obj',JSON.stringify([]));
              }
            }
          }
        }
      }
      if (key === 'Delete') {
        for (var i = hot.getSelected()[0][0]; i <= hot.getSelected()[0][2]; i++) {
          for (j=hot.getSelected()[0][1];j <= hot.getSelected()[0][3];j++) {
              var ids = $('table').eq(0).find('tr').eq(i).find('td').eq(j).attr('data-obj');
              if (ids.length > 0) {
                ids = JSON.parse(ids);
                for (var ind = 0;ind < ids.length;ind++){
                  deleteLecture(ids[ind],i,j,hot);
                }
              } else {
                hot.setDataAtCell(i, j, '')
                $('table').eq(0).find('tr').eq(i).find('td').eq(j).attr('data-obj',JSON.stringify([]));
              }
          }
        }
      }
    });

    $('.generate-timetable').click(function(){
      console.log(hot.getData());
      var data_arr = hot.getData();
      var fin_arr = [];

      // $.each(data_arr,function(key,val){
      //   if(key == 0||key == 1){return;}
      //   fin_arr[day_arr[data_arr[key][0].toLowerCase()]] = {};
      // });
      // console.log(fin_arr);return false;

      $.each(data_arr,function(k,v){
        if(k == 0||k == 1){return;}
        $.each(v,function(k1,v1){
          if(k1 == 0 || v1 == "Break"){return;}
          var day_id = day_arr[data_arr[k][0].toLowerCase()];
          var lec_time = data_arr[1][k1].split("-");
          var st = fnc_12_to_24(lec_time[0]);
          var et = fnc_12_to_24(lec_time[1]);
          var lec_no = data_arr[0][k1];
          var lec_arr = v1.split("*");
          // console.log('day',day_id,'lecno',lec_no,st,et,lec_arr);
          $.each(lec_arr,function(lk,lv){
            var ts = lv.split("-");
            var css = (sub_map[ts[1]]) ? sub_map[ts[1].trim()]:false;
            var user = (teach_map[ts[0]]) ? teach_map[ts[0].trim()]:false;
            if (user && css) {
              fin_arr.push({'day_id':day_id,'start_time':st,'end_time':et,'lecture_no':lec_no,'css':css,'user':user});
            }
          });
          // fin_arr[day_arr[data_arr[k][0].toLowerCase()]][data[0][k1]] = v1;
          // v1
        });
      });
      console.log(fin_arr);
    });

    $('.add-teach-sub').click(function () {
      add_teach_sub();
    });

    $('#ts-modal').on('hidden.bs.modal', function (e) {
      console.log('hidden');
      getCssUser($('#select-class option:selected').val());
    });

  });
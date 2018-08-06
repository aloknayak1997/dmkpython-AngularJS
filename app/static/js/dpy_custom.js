/**
 * This function is called whenver an ajax request is hit.
 * It sets the user's token in the header for authorization before API hit.
 * @param {none}
 */
$.ajaxSetup({
  beforeSend: function (request) {
    if(g_auth)
      (g_auth.key) ? request.setRequestHeader("Authorization", "Token " + g_auth.key):false;
  },
  error: function () {
  },
  complete: function () {
  }
});

/*
 * Today's date defined to be used in entire dashboard
 */
  var sys_dt = new Date();
  var sys_day = sys_dt.getDate();
  var sys_month = sys_dt.getMonth()+1;
  if (sys_month <= 9 ) {sys_month = '0'+sys_month}
  if (sys_day <= 9 ) {sys_day = '0'+sys_day}
  var sys_year = sys_dt.getFullYear();
  var today = sys_year+'-'+sys_month+'-'+sys_day;

/**
 * This function creates notification toast
 * @param {object} options - color,duration,icon,container-id,fade-duration.
 * @param {string} color : alert-danger,alert-success,alert-primary,alert-warning,alert-info,alert-classic
 * @param {string} icon
 * @param {string} duration : default - 5000
 * @param {string} container-id : id of the container where toast will be appended
 * @param {string} fade-duration : default - fast
 */
function ohSnap(n,t){var o={color:null,icon:null,duration:"5000","container-id":"ohsnap","fade-duration":"fast"};t="object"==typeof t?$.extend(o,t):o;var a=$("#"+t["container-id"]),e="",i="",h="";t.icon&&(e="<span class='"+t.icon+"'></span> "),t.color&&(i="alert-"+t.color),h=$('<div class="alert '+i+' pulse">'+e+n+"</div>").fadeIn(t["fade-duration"]),a.append(h),h.on("click",function(){ohSnapX($(this))}),setTimeout(function(){ohSnapX(h)},t.duration)}function ohSnapX(n,t){defaultOptions={duration:"fast"},t="object"==typeof t?$.extend(defaultOptions,t):defaultOptions,"undefined"!=typeof n?n.fadeOut(t.duration,function(){$(this).remove()}):$(".alert").fadeOut(t.duration,function(){$(this).remove()})}

/**
 * This function is adding a div in body for ohSnap library to work and ultimately calling ohSnap to make alerts.
 * Thus the user does not require to make a div in every page they want to use alerts
 * @param {string} message 
 * @param {object} options - color,duration,icon,container-id,fade-duration.
 */
function myToast(message,options={}) {
    var elementExists = document.getElementById("ohsnap");
    if (elementExists) {
        ohSnap(message,options);
    }else{
        $('body').append('<div id="ohsnap"></div>');
        ohSnap(message,options);
    }
}


/**
 * Funtion to check if the email is valid or not
 * @param1 {string} email 
 * @return {boolean} true/false.
 */
function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return (filter.test(sEmail)) ? true : false;
}

/*
 * Get all data-* attributes of an element
 * @param {js-object} js-element
 */
function getDataAttributes(el) {
    var data = {};
    [].forEach.call(el.attributes, function(attr) {
        if (/^data-/.test(attr.name)) {
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value;
        }
    });
    return data;
}

/*
 * Movable or Draggable Table
 * @param {js-object} js-element
 */
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//------X------X---END FUNCTION Movable or Draggable Table-----X------X------

//-----DRAG N DROP--------------------------------------------------
  function dragCheck(ev) {
      // console.log("im dragging");
  }
  function dragStart(ev) {
      // console.log('drag start');
      ev.dataTransfer.setData("text",$(ev.target).text());
      var data_attr = getDataAttributes(ev.target);//Defined in custom js
      ev.dataTransfer.setData("data_attr",JSON.stringify(data_attr));
  }
  function dragover(ev) {
      ev.preventDefault();
      // Set the dropEffect to move
      ev.dataTransfer.dropEffect = "move"
  }
  function drop(ev) {
      ev.preventDefault();
      console.log('dropped');
      var data = ev.dataTransfer.getData('text');
      var data_attr = JSON.parse(ev.dataTransfer.getData('data_attr'));
      $.each(data_attr,function (index,value) {
         $(ev.target).attr('data-'+index,value);
      });
      $(ev.target).html(data);
  }
//-----END DRAG N DROP--------X-----------------X------------------X

/*
 * Function checks if an Object is empty or not
 * @param {object} js-object
 */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}//End

/*
 * Function converts 12hr time 24hr time
 */
function fnc_12_to_24(time) {
  var hours = parseInt(time.substring(0,time.indexOf(":")));
  var minutes = parseInt(time.substring(time.indexOf(":")+1,time.indexOf(":")+3));
  var AMPM = time.substring(time.indexOf(":")+3,time.length).toLowerCase();
  if(AMPM == "pm" && hours<12) hours = hours+12;
  if(AMPM == "am" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes; 
  return sHours + ":" + sMinutes;
}

/*
 * Function to empty an object
 * @param{object} 
 */
function emptyObject(obj) {
  Object.keys(obj).forEach(k => delete obj[k])
}
  
$(document).ready(function($) {

    "use strict";

    [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
        new SelectFx(el);
    } );

    $('.selectpicker').selectpicker;


    $('#menuToggle').on('click', function(event) {
        $('body').toggleClass('open');
    });

    $('.search-trigger').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').addClass('open');
    });

    $('.search-close').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').removeClass('open');
    });
});
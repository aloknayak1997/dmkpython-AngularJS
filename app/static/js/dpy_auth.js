    var g_auth = localStorage.getItem("auth");
    var u_data = localStorage.getItem("u_data");
    if(g_auth == null) {
        g_auth = sessionStorage.getItem("auth");
    }

    if(g_auth) {
        try {
            g_auth = JSON.parse(g_auth);
        } catch(error) {
            g_auth = null; 
        }
    }

    var getCookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    var g_csrftoken = getCookie('csrftoken');

    var initLogin = function() {
        if(g_auth) {
            $('.btn-logout').show();
            if(g_auth.remember_me) {
                localStorage.setItem("auth", JSON.stringify(g_auth));
            } else {
                sessionStorage.setItem("auth", JSON.stringify(g_auth));
            }
            // window.location.href = '/dpy_frontend/#!/dashboard/home';
            console.log("Logged User: ",g_auth.username);
        } else {
            // window.location.href = '/dpy_frontend/login.html';
            // break;
        }
    };

    $(function () {
        initLogin();

        $('#username,#password').on('keypress',function(event) {
            if (event.which == 13 || event.which == 10) {
                    $('.login-btn').trigger('click');
                    event.preventDefault();
            }
            // Prevent default posting of form
        });
        
        $('.login-btn').click(function() {
            var username = $("#username").val();
            var password = $('#password').val();
            var remember_me = $('#remember-me').prop('checked');
            if(username && password) {
                console.log("Will try to login with ", username);
                $.ajax({
                    url: g_urls.login,
                    method: "POST", 
                    data: {
                        username: username,
                        password: password,
                        csrfmiddlewaretoken:getCookie("csrftoken"),
                    }
                }).done(function(data) {
                    console.log("DONE: ", username, data.key);
                    console.log(data);
                    var udata = data;
                    localStorage.setItem("u_data", udata);
                    g_auth = {
                        username: username,
                        key: data.key,
                        remember_me: remember_me,
                        institute_id:data['institute_info'][0].institute_id,
                        institute_nature:data['institute_info'][0].institute.nature
                    };
                    initLogin();
                    g_csrftoken = getCookie('csrftoken');
                    // window.location.href = '/dashboard/home'
                    if (data.institute_info.length > 1) {
                        var d = '';
                        $.each(data.institute_info,function(key,value){
                            d+='<div class="card card bg-light mb-3 btn select-institute" data-inst_id="'+value.institute.id+'" data-inst_nature="'+value.institute.nature+'" style="max-width: 18rem;">'
                                  +'<div class="card-header">'+value.institute.name+'</div>'
                                  +'<div class="card-body">'
                                    +'<p class="card-text">Adress: '+value.institute.address+'</p>'
                                    +'<p class="card-text">City: '+value.institute.city+'</p>'
                                    +'<p class="card-text">Pin-Code: '+value.institute.pin_code+'</p>'
                                  +'</div>'
                                +'</div>';
                        });
                        $('.multi-inst-body').html(d);
                        $('#multi-inst-modal').modal({backdrop:'static',keyboard:false});
                    }else{
                        window.location.href = '/#!/home';
                    }
                }).fail(function(err) {
                    var msg = "Oops something went wrong!!!";
                    if (err.responseJSON) {
                        var msg = (err.responseJSON.non_field_errors) ? err.responseJSON.non_field_errors.join():"Oops something went wrong!!!";
                    }
                    myToast(msg,{color:'danger',duration:2000});
                });
            } else {
                // $('#modal-error').removeClass('d-invisible');
                myToast("Please provide credentials!",{color:'danger',duration:2000});
            }
        });

        $('.btn-logout').click(function() {
            console.log("Trying to logout");
            $.ajax({
                url: g_urls.logout, 
                method: "POST", 
                beforeSend: function(request) {
                    if( g_auth ) {
                        if (g_auth.key)
                        request.setRequestHeader("Authorization", "Token " + g_auth.key);
                    }
                },
                data: {
                    csrfmiddlewaretoken:getCookie("csrftoken")
                }
            }).done(function(data) {
                console.log("DONE: ", data);
                g_auth = null;
                localStorage.removeItem("auth");
                sessionStorage.removeItem("auth");
                initLogin();
                window.location.href = '/login.html'
            }).fail(function(data) {
                console.log("FAIL: ", data);
            });
        });

        $('body').delegate('.select-institute','click',function() {
            var institute_id = $(this).attr('data-inst_id');
            var institute_nature = $(this).attr('data-inst_nature');
            g_auth.institute_nature = institute_nature;
            g_auth.institute_id = institute_id;

            $.ajax({
                url: g_urls.set_institute, 
                method: "POST", 
                beforeSend: function(request) {
                    (g_auth.key) ? request.setRequestHeader("Authorization", "Token " + g_auth.key):false;
                },
                data: {
                    institute_id: institute_id,
                    csrfmiddlewaretoken:getCookie("csrftoken"),
                }
            }).done(function(data) {
                window.location.href = '#!/home'
            }).fail(function(data) {
                console.log("FAIL: ", data);
            });            
        });

    });
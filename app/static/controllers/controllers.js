angular.module('dmk')
    .controller('add_fee',
        function ($scope, $http, ) {
            this.cycle = '';
            var temp;
            // addEventListener('load', load, false);
            $scope.searchTerm;
            $scope.clearSearchTerm = function () { $scope.searchTerm = ''; };
            $('#search-filter').on('keydown', function (ev) { ev.stopPropagation(); });
            var classec = [];
            $scope.classes = []
            $scope.selectedclasses = []
            $scope.feenames = []

            $http({
                method: 'GET',
                url: ip + "/fees_management/fees/?id=" + g_auth.institute_id,
                headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                inst_classes: classec,
            }).then(function (response) {
                if (response.data) { temp = response.data.data; } else { console.log(response); }
            });

            $http({
                method: 'GET',
                url: ip + "/profiling/class/?id=" + g_auth.institute_id,
                headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
            }).then(function (response) {
                if (response.data) {
                    temp = response.data.data;
                    var html = '';
                    $.each(temp, function (i, classes) {
                        $scope.classes.push({ 'class': classes.standard + classes.division, 'id': classes.id });
                    });
                } else {
                    myToast(response.message, { color: 'danger' });
                    console.log(response);
                }
            });

            $scope.getfee = function () {
                var classsec;
                var option = document.getElementsByTagName('md-option');
                var feesalloted = document.getElementById('fees_alloted');
                var html = ' ';
                $scope.feenames = [];
                for (i = 0; i < option.length; i++) {
                    if (option[i].getAttribute('selected')) {
                        mdtext = option[i].getElementsByClassName('md-text');
                        $.each(temp, function (i, classes) {
                            classsec = classes.class_details.standard + classes.class_details.division;
                            if (mdtext[0].innerHTML == classsec) {
                                $scope.selectedclasses.push(i);
                                html += "<div class='one-class' data=" + classsec + "><div class='accordion'>" + classsec + "</div>";
                                html += "<div class='panel'>";
                                $.each(classes, function (i, fees) {
                                    if (i == 'class_details') {
                                        //do nothing
                                    }
                                    else {
                                        html += "<div class='fee'>";
                                        html += "<div class='fee-tab'>" + fees.display_name + "</div>";
                                        $scope.feenames.push(fees.display_name);
                                        html += "<div class='fee-tab'>  " + fees.amount + "</div>";
                                        html += "</div>";
                                    }
                                });
                                html += "</div>";
                                html += "</div>";
                            }
                        });
                    }
                }
                feesalloted.innerHTML = html;
            };

            $("#feeinput").keydown(function () {
                var feenames = $scope.feenames;
                $(this).siblings('div.md-errors-spacer').text('');
                for (i = 0; i < feenames.length; i++) {
                    if ($(this).val().length > 0) {
                        if (feenames[i].toUpperCase() == $(this).val().toUpperCase()) {
                            $(this).siblings('div.md-errors-spacer').text('Fee Already Exists ').css('color', 'red');
                        }
                    }
                    else {
                        $(this).siblings('div.md-errors-spacer').text('');
                    }
                }
            });


            $scope.addfee = function () {
                var feename = $('#feeinput').val();
                var feeamount = $('#feeamount').val();
                var cycle_name = '', cycle;
                var name = '';
                $('md-option.feecycle').each(function (i) {
                    if ($(this).attr('selected')) {
                        name = $('#generatedfees').children('.tab').children('.name').text();
                        cycle_name = $(this).attr('data-name');
                        cycle = $(this).attr('data-id');
                        if (name == feename) {
                            myToast("Fee Already Exists!", { color: 'danger' });
                        }
                        else {
                            html = '<div class="tab"><div class="name">' + feename + '</div><div class="amount">' + feeamount + '</div><div class="cycle" cycle=' + cycle + '>' + cycle_name + '</div><i class="far fa-times-circle"></i></div>';
                            $('#generatedfees').append(html);
                        }

                    }
                });
            }



            $scope.savefee = function () {
                var fees = [];
                var i = 0;
                var selectedclasses = $scope.selectedclasses;
                $.each(selectedclasses, function (key, val) {
                    $('#generatedfees').children('.tab').each(function () {
                        name = $(this).children('.name').text();
                        amount = $(this).children('.amount').text();
                        cycle = $(this).children('.cycle').attr('cycle');
                        fees[i] = { institute_class: val, bifurcations: "-", amount: amount, cycle: cycle, display_name: name, status: 1 };
                        i++;
                    });
                });

                $http({
                    method: 'POST',
                    url: ip + "/fees_management/fees/",
                    headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                    'data': fees,
                }).then(function (response) {
                    if (response.data) {
                        if (response.data.data.error) {
                            $.each(response.data.data.error, function (key, val) {
                                myToast(val, { color: 'danger' });
                            });
                        }
                        else if (response.data.message) {
                            myToast(response.data.message, { color: 'danger' });
                        }
                        // console.log(response);
                    } else {
                        myToast(response.message, { color: 'danger' });
                        console.log(response);
                    }
                });
            }
        })

    .controller('fee_types',
        function ($scope, $http) {
            var classec = [];
            $http({
                method: 'GET',
                url: ip + "/fees_management/fees/?id=" + g_auth.institute_id,
                headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                inst_classes: classec,
            }).then(function (response) {
                if (response.data) {
                    temp = response.data.data;
                    var html = '';
                    $.each(temp, function (i, classes) {
                        html += "<div class='one-class'><div class='accordion'>Class ID" + i + "</div>";
                        html += "<div class='panel'>"
                        $.each(classes, function (i, fees) {
                            if (i == 'class_details') {
                                //do nothing
                            }
                            else {
                                html += "<div class='fee'>";
                                html += "<div class='fee-tab'>" + fees.display_name + "</div>";
                                html += "<div class='fee-tab'>  " + fees.amount + "</div>";
                                html += "</div>";
                            }
                        });
                        html += "</div>";
                        html += "</div>";
                    });
                    $('#class-wise').append(html);
                    var acc = document.getElementsByClassName("accordion");
                    var i;
                    console.log(acc);
                    for (i = 0; i < acc.length; i++) {
                        acc[i].addEventListener("click", function () {
                            this.classList.toggle("active1");
                            var panel = this.nextElementSibling;
                            if (panel.style.maxHeight) {
                                panel.style.maxHeight = null;
                            } else {
                                panel.style.maxHeight = panel.scrollHeight + "px";
                            }
                        });
                    }
                } else {
                    myToast(response.message, { color: 'danger' });
                    console.log(response);
                }
            });
        })

    .controller('home',
        function ($scope, $http) {
            $scope.username = u_data['user'].first_name;
        })

    .controller('pay',
        function ($scope, $http) {

            $scope.items = [{ 'mode': 'Cash', 'id': '1' }, { 'mode': 'Cheque', 'id': '2' }, { 'mode': 'Card', 'id': '3' }];
            $scope.selected = [];

            $scope.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
            // $scope.name = "Fee";
            $scope.searchTerm;
            $scope.clearSearchTerm = function () { $scope.searchTerm = ''; };
            $('#search-filter').on('keydown', function (ev) { ev.stopPropagation(); });
            $scope.classes = []
            $scope.selectedclasses = []
            $scope.feenames = []

            $http({
                method: 'GET',
                url: ip + "/profiling/class/?id=" + g_auth.institute_id,
                headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
            }).then(function (response) {
                if (response.data) {
                    temp = response.data.data;
                    var html = '';
                    $.each(temp, function (i, classes) {
                        $scope.classes.push({ 'class': classes.standard + classes.division, 'id': classes.id });
                    });
                } else {
                    myToast(response.message, { color: 'danger' });
                    // console.log(response);
                }
            });

            $scope.getfeeAndstudent = function () {
                var html = ' ';
                $scope.students = []
                $scope.fees = []
                $scope.class_id = '';
                var option = document.getElementsByTagName('md-option');
                for (i = 0; i < option.length; i++) {
                    if (option[i].getAttribute('selected')) {
                        $scope.class_id = option[i].getAttribute('data-id');
                    }
                }
                $http({
                    method: 'GET',
                    url: ip + "/profiling/classuser-by-cid/?inst_id=" + g_auth.institute_id + "&ic=" + $scope.class_id + "&type=1",
                    headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                }).then(function (response) {
                    temp = response.data.data;
                    // console.log(temp);

                    $.each(temp, function (i, students) {
                        $scope.students.push({ 'student': students.first_name + " " + students.middle_name + " " + students.last_name, 'user_id': students.user });
                    });

                });
                $scope.getfeeignore = function () {
                    $http({
                        method: 'GET',
                        url: ip + "/fees_management/fees_pay/?id=" + g_auth.institute_id,
                        headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                    }).then(function (response) {
                        if (response.data) {
                            fee_data = response.data.data;
                            transaction = fee_data[stud_id]['transactions'];
                            fees_ignore = fee_data[stud_id]['fee_ignore'];
                        }
                    });
                }
                var classes = [];
                classes.push($scope.class_id);
                $.ajax({
                    type: "GET",
                    url: ip + "/fees_management/fees/?id=" + g_auth.institute_id,
                    headers: { "Authorization": g_auth.key },
                    data: {
                        'inst_classes': classes,
                    },
                    success: function (response) {
                        temp = response.data;
                        // console.log(temp);
                        $.each(temp, function (i, fees) {
                            $.each(fees, function (i, fee) {
                                if (i == 'class_details') {
                                    //do nothing
                                }
                                else {
                                    $scope.fees.push({ 'fee': fee.display_name, 'cycle': fee.cycle, 'amount': fee.amount, 'id': fee.id });
                                }
                            });
                        });
                    },
                    error: function (response) {
                        // myToast(response.message, { color: 'danger' });
                        // console.log(response);
                    },
                });
            };
            var transaction;
            var fees_ignore = [];
            var fee_ignoredata;
            $scope.icfid = '';
            
            $scope.transaction = function(){

                var fee_data;
                var student = document.getElementsByClassName('students');
                var stud_id;
                for (j1 = 0; j1 < student.length; j1++) {
                    if (student[j1].getAttribute('selected')) {
                        stud_id = student[j1].getAttribute('stud-id');
                    }
                }
                $http({
                    method: 'GET',
                    url: ip + "/fees_management/fees_pay/?id=" + g_auth.institute_id,
                    headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                }).then(function (response) {
                    if (response.data) {
                        fee_data = response.data.data;
                        transaction = fee_data[stud_id]['transactions'];
                        fees_ignore = fee_data[stud_id]['fee_ignore'];
                        $.each(transaction, function (i, trans) {
                            var fid = trans.institute_class_fee_id, cyc = trans.cycle, slot = trans.cycle_slot, pamont = trans.paid_amount;
                            var feetab = document.getElementsByClassName('fee-tab');
                            var balance = 0;
                            for (h = 0; h < feetab.length; h++) {
                                amount = 0;
                                months = feetab[h].getElementsByClassName('months');
                                bal = feetab[h].getElementsByClassName('balance');
                                counter = 0;
                                for (n = 0; n < months.length; n++) {
                                    monamount = months[n].getAttribute('amount');
                                    monfeeid = months[n].getAttribute('fee_id');
                                    moncycle = months[n].getAttribute('cycle');
                                    monslot = months[n].getAttribute('cycle_slot');
                                    if (fid == monfeeid && cyc == moncycle && slot == monslot) {
                                        balance = 0;
                                        balance = Math.abs(monamount - pamont);
                                        if (balance != 0) {
                                            months[n].setAttribute('amount', balance);
                                            // node="<span style='color: white;padding: 1px 8px;font-weight: 700;background: #d0180b;border-radius:  12px;'>UnPaid-"+balance+"</span>";
                                            // html = months[n].parentElement.innerHTML;
                                            // months[n].parentElement.innerHTML= html+node;
                                            months[n].parentElement.style.color = "red";
                                            months[n].setAttribute('unpaid', '1');
                                            bal[0].setAttribute('bal', balance);
                                            // bal[0].innerHTML = "Balance:" + balance;
                                        }
                                        if (balance == 0) {
                                            months[n].disabled = true;
                                            // node="<span style='color: white;padding: 1px 8px;font-weight: 700;background: #0bd00b;border-radius:  12px;'>Paid</span>";
                                            // html = months[n].parentElement.innerHTML;
                                            // months[n].parentElement.innerHTML= html+node;
                                            months[n].parentElement.style.color = "green";
                                        }
                                    }

                                }
                            }
                        });
                        $.each(fees_ignore, function (i, feeig) {
                            discount = feeig.percent_discount; icfid = feeig.institute_class_fee_id;
                            $(".fee-tab").each(function () {
                                feeid = $(this).attr('fee-id');
                                if (feeid == icfid) {
                                    html = "<div class='tab' style=' background: #0fdea5; padding: 1px 7px; box-shadow: 4px 4px 20px -9px #000000, 14px 4px 20px -12px #000000; float: right; color: #fff; '>" + discount + "%" + "</div>";
                                    $(this).find('.feedata').append(html);
                                    $(this).find('.months').each(function () {
                                        if ($(this).attr('unpaid') == 0) {
                                            amount = $(this).attr('amount');
                                            calamount = amount - (discount * amount) / 100;
                                            $(this).attr('amount', calamount);
                                            $(this).closest(".month").find('.amount').val(calamount);
                                        }
                                        else if($(this).attr('unpaid') == 1){
                                            amount = $(this).attr('amount');
                                            $(this).closest(".month").find('.amount').val(amount);
                                        }

                                    });
                                }
                            });
                        });
                    } else {
                        myToast(response.message, { color: 'danger' });
                        console.log(response);
                    }
                });
            }
            $scope.fee = function () {
                var tabs = '';
                var fee_id = '';
                var feeopt = document.getElementsByClassName('fees');
                var student = document.getElementsByClassName('students');
                var stud_id;
                for (j1 = 0; j1 < student.length; j1++) {
                    if (student[j1].getAttribute('selected')) {
                        stud_id = student[j1].getAttribute('stud-id');
                    }
                }
                for (i = 0; i < feeopt.length; i++) {
                    if (feeopt[i].getAttribute('selected')) {
                        fee_id = feeopt[i].getAttribute('data-id');
                        console.log(fee_id);
                        amount = feeopt[i].getAttribute('amount');
                        var fee_data;
                        $http({
                            method: 'GET',
                            url: ip + "/fees_management/fees_pay/?id=" + g_auth.institute_id,
                            headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                        }).then(function (response) {
                            if (response.data) {
                                fee_data = response.data.data;
                                transaction = fee_data[stud_id]['transactions'];
                                fees_ignore = fee_data[stud_id]['fee_ignore'];
                                $.each(fees_ignore, function (i, feeig) {
                                    discount = feeig.percent_discount; icfid = feeig.institute_class_fee_id;
                                    console.log("icfid" + icfid);
                                    if (fee_id == icfid) {
                                        console.log("icfid" + icfid);
                                        calamount = amount - (discount * amount) / 100;
                                        amount = calamount;
                                        console.log(amount);
                                    }
                                });
                            }
                        });
                        cycle_num = feeopt[i].getAttribute('cycle');
                        fee_name = feeopt[i].getAttribute('name');
                        var today = new Date();
                        var day = today.getDate(), month = today.getMonth() + 1;
                        var year = today.getFullYear();
                        var months = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'June', 7: 'July', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };

                        tab = "<div class='fee-tab' fee-id=" + fee_id + ">";
                        tab += "<div class='feedata'>";
                        tab += "<div class='tab'>" + fee_name + "</div><div style='display:none;' class='tab discount'></div>";
                        // tab += "<div class='tab' style='background: #abaec2; color: #fff; padding: 0 10px; '>" + "₹" + amount + "</div>";
                        tab += "</div>";
                        if (cycle_num == "1") {//Annualy
                            tab += "<span class='month'><span><input class='months' unpaid='0' type='checkbox' status='0' fee_id='" + fee_id + "' cycle_slot='1' cycle='" + cycle_num + "' fee_name='" + fee_name + "' value='Annual' amount='" + amount + "'/>Annually</span><input class='amount' placeholder='Amount' value='" + amount + "'/></span>";
                        }
                        else if (cycle_num == '2') {//Half Yearly
                            // tab += "<div class='choices'>";
                            for (z = 1; z <= 2; z++) {
                                tab += "<span class='month'><span><input class='months' unpaid='0' type='checkbox' status='0' fee_id='" + fee_id + "' cycle_slot='" + z + "' cycle='" + cycle_num + "' fee_name='" + fee_name + "' value='SEM" + z + "' amount='" + amount + "'>SEM" + z + "</span><input class='amount' placeholder='Amount' value='" + amount + "'/></span>";
                            }
                        }
                        else if (cycle_num == '3') {//Monthly
                            tab += "<div class='choices'>";
                            for (j = 1; j < 12; j++) {
                                tab += "<span class='month'><span><input class='months' unpaid='0' type='checkbox' status='0' fee_id='" + fee_id + "' fee_name='" + fee_name + "' cycle='" + cycle_num + "' cycle_slot='" + j + "' amount='" + amount + "' value='" + months[j] + year + " '>" + months[j] + " " + year + "</span><input class='amount' placeholder='Amount' value='" + amount + "'/></span>";
                            }
                            tab += "</div>";
                        }
                        else if (cycle_num == '4') {//Quartely
                            tab += "<div class='choices'>";
                            for (j = 1; j < 12; j++) {
                                tab += "<span class='month'><span><input class='months' unpaid='0' type='checkbox' status='0' fee_id='" + fee_id + "' fee_name='" + fee_name + "' cycle='" + cycle_num + "' cycle_slot='" + j + "' amount='" + amount + "' value='" + months[j] + year + " '>" + months[j] + " " + year + "</span><input class='amount' placeholder='Amount' value='" + amount + "'/></span>";
                            }
                            tab += "</div>";
                        }
                        tab += "<span id='balance' class='balance' style='color:red;'></span></div>";
                        tab += "</div>";

                        tabs += tab;
                    }
                }
                $('#fee_tabs').html(tabs);
                $scope.transaction();
                $('.selectdemoSelectHeader').css('display', 'block');
            }



            var total = 0;
            $('body').on('change', 'input:checkbox.months', function () {
                var counter = 0;

                var datatab = document.getElementsByClassName('data-tab');
                for (h = 0; h < datatab.length; h++) {
                    amount = 0;
                    months = datatab[h].getElementsByClassName('months');
                    edit = datatab[h].getElementsByClassName('editamount');
                    counter = 0;
                    for (n = 0; n < months.length; n++) {
                        status = months[n].getAttribute('status');
                        if (months[n].checked) {
                            amount += parseInt(months[n].getAttribute('amount'));
                            edit[0].value = amount;
                        };
                    }
                }

                settotal();
            });
            $('.total').html("Total:₹" + total + "/-");
            function settotal() {
                // alert("S")
                var mon = document.getElementsByClassName('months');
                for (k = 0; k < mon.length; k++) {

                    if (mon[k].checked && mon[k].getAttribute('status') == 0) {
                        total += parseInt(mon[k].getAttribute('amount'));
                        mon[k].setAttribute('status', '1');
                        // mon[k].setAttribute('unpaid', '0');
                        cycle_slot = mon[k].getAttribute('cycle_slot');
                        value = mon[k].getAttribute('value');
                        feeid = mon[k].getAttribute('fee_id');
                        name = mon[k].getAttribute('name');
                        amount = mon[k].getAttribute('amount');
                        cycle = mon[k].getAttribute('cycle');

                    }
                    else if (mon[k].getAttribute('status') == 1) {

                        if (mon[k].checked) {
                            //do nothing
                        }
                        else {
                            total -= parseInt(mon[k].getAttribute('amount'));
                            mon[k].setAttribute('status', '0');
                            // mon[k].setAttribute('unpaid', '1');
                        }
                    }

                }
                $('.total').html("Total:₹" + total + "/-");
            }
            $scope.pay = function () {
                var students = document.getElementsByClassName('students');
                var stud_id;
                for (j1 = 0; j1 < students.length; j1++) {
                    if (students[j1].getAttribute('selected')) {
                        stud_id = students[j1].getAttribute('stud-id');
                    }
                }
                var pay = {};
                var fees = {};
                var fee_slot = {};
                var mop, icf_id;
                var fee_tab = document.getElementsByClassName('fee-tab');
                for (i = 0; i < fee_tab.length; i++) {
                    fee_slot = {};
                    icf_id = fee_tab[i].getAttribute('fee-id');
                    var mon = fee_tab[i].getElementsByClassName('months');
                    var mode = document.getElementsByClassName('mode');
                    for (j = 0; j < mode.length; j++) {
                        if (mode[j].getAttribute('checked')) {
                            mop = mode[j].getAttribute('data-id');
                        }
                    }
                    for (k = 0; k < mon.length; k++) {
                        if (mon[k].checked) {
                            feecycyle = mon[k].getAttribute('cycle');
                            feecyclename = mon[k].getAttribute('value');
                            feename = mon[k].getAttribute('name');
                            paid_amount = mon[k].getAttribute('amount');
                            cycle_slot = mon[k].getAttribute('cycle_slot');
                            fee_slot[cycle_slot] = { 'paid_amount': paid_amount, 'mop': mop };
                        }
                    }
                    fees[icf_id] = fee_slot;

                }
                pay[stud_id] = fees;
                console.log(pay);

                $http({
                    method: 'POST',
                    url: ip + "/fees_management/fees_pay/?id=" + g_auth.institute_id,
                    headers: { 'Authorization': 'Token' + ' ' + g_auth.key },
                    'data': pay,
                }).then(function (response) {
                    if (response.data) {
                        temp = response.data.data;
                        console.log(temp);
                        myToast(response.data.message, { color: 'success' });
                    } else {
                        myToast(response.message, { color: 'danger' });
                        console.log(response);
                    }
                });

            }


            window.onmousedown = function (e) {
                var el = e.target;
                if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
                    e.preventDefault();
                    // toggle selection
                    if (el.hasAttribute('selected')) el.removeAttribute('selected');
                    else el.setAttribute('selected', '');
                    // hack to correct buggy behavior
                    var select = el.parentNode.cloneNode(true);
                    el.parentNode.parentNode.replaceChild(select, el.parentNode);
                }
            }

            var total = 0;
            $('body').on('change', 'input.amount', function () {
                amount = $(this).val();
                $(this).siblings('span').find('.months').attr('amount', amount);
                settotal();
            });

        })
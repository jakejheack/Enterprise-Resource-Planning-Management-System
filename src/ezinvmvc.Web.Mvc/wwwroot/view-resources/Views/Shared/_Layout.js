////Skin changer
//function skinChanger() {
//    $('.right-sidebar .demo-choose-skin li').on('click', function () {
//        var currentTheme = $('.right-sidebar .demo-choose-skin li.active').data('theme');
//        $('.right-sidebar .demo-choose-skin li').removeClass('active');

//        var $selected = $(this);
//        $selected.addClass('active');
//        var selectedTheme = $selected.data('theme');

//        $('body')
//            .removeClass('theme-' + currentTheme)
//            .addClass('theme-' + selectedTheme);

//        //Change theme settings on the server
//        abp.services.app.configuration.changeUiTheme({
//            theme: selectedTheme
//        });
//    });
//}

////Skin tab content set height and show scroll
//function setSkinListHeightAndScroll() {
//    var height = $(window).height() - ($('.navbar').innerHeight() + $('.right-sidebar .nav-tabs').outerHeight());
//    var $el = $('.demo-choose-skin');

//    $el.slimScroll({ destroy: true }).height('auto');
//    $el.parent().find('.slimScrollBar, .slimScrollRail').remove();

//    $el.slimscroll({
//        height: height + 'px',
//        color: 'rgba(0,0,0,0.5)',
//        size: '4px',
//        alwaysVisible: false,
//        borderRadius: '0',
//        railBorderRadius: '0'
//    });
//}

////Setting tab content set height and show scroll
//function setSettingListHeightAndScroll() {
//    var height = $(window).height() - ($('.navbar').innerHeight() + $('.right-sidebar .nav-tabs').outerHeight());
//    var $el = $('.right-sidebar .demo-settings');

//    $el.slimScroll({ destroy: true }).height('auto');
//    $el.parent().find('.slimScrollBar, .slimScrollRail').remove();

//    $el.slimscroll({
//        height: height + 'px',
//        color: 'rgba(0,0,0,0.5)',
//        size: '4px',
//        alwaysVisible: false,
//        borderRadius: '0',
//        railBorderRadius: '0'
//    });
//}

////Activate notification and task dropdown on top right menu
//function activateNotificationAndTasksScroll() {
//    $('.navbar-right .dropdown-menu .body .menu').slimscroll({
//        height: '254px',
//        color: 'rgba(0,0,0,0.5)',
//        size: '4px',
//        alwaysVisible: false,
//        borderRadius: '0',
//        railBorderRadius: '0'
//    });
//}

//(function ($) {

//    //Initialize BSB admin features
//    $(function () {
//        skinChanger();
//        activateNotificationAndTasksScroll();

//        setSkinListHeightAndScroll();
//        setSettingListHeightAndScroll();
//        $(window).resize(function () {
//            setSkinListHeightAndScroll();
//            setSettingListHeightAndScroll();
//        });
//    });

//})(jQuery);


//function decimalOnly(txt) {
//    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
//        var txtbx = document.getElementById(txt);
//        var amount = document.getElementById(txt).value;
//        var present = 0;
//        var count = 0;

//        do {
//            present = amount.indexOf(".", present);
//            if (present !== -1) {
//                count++;
//                present++;
//            }
//        }
//        while (present !== -1);
//        if (present === -1 && amount.length === 0 && event.keyCode === 46) {
//            event.keyCode = 0;
//            return false;
//        }

//        if (count >= 1 && event.keyCode === 46) {

//            event.keyCode = 0;
//            return false;
//        }
//        if (count === 1) {
//            var lastdigits = amount.substring(amount.indexOf(".") + 1, amount.length);
//            if (lastdigits.length >= 2) {
//                event.keyCode = 0;
//                return false;
//            }
//        }
//        return true;
//    }
//    else {
//        event.keyCode = 0;
//        return false;
//    }
//}
var srConnection = new signalR.HubConnectionBuilder().withUrl(abp.appPath + 'signalr-myNotifHub').build();

srConnection.start().then(function () {
    console.log("connected");

});

$(function () {
    $(function () {
        var _userNotifService = abp.services.app.userNotificationService;
        $(document).ready(function () {
            //GetUser(abp.session.userId);
            //GetCountShareUser(abp.session.userId);
            //GetListCountShareUser(abp.session.userId);
            //GetUsersRole(abp.session.userId);
            //$('#userInput').val(abp.session.userId);
            $('#Uid').val(abp.session.userId);

            //GetListUser($('#Uid').val());
            GetNotifications(abp.session.userId);

            //GetUnreadCount($('#Uid').val());

        });

        //Wilson SignalR Load Messages//
        srConnection.on("getNotification", function (trCode, trId, receiverid, senderid, SenderName, message) {
            var userid = $('#Uid').val();
            var rids = receiverid.split(',');
            console.log(rids);
            if (rids.includes(userid)) {
                //$('#messagesList').append('<li><div class="d-flex flex-row p-1"><div class="mr-2 p-1" style="width:100%; text-align:end;"><span style="color:red">' + SenderName + '</span> <span style="color:gray;font-size:9px">' + daysent + ' </span><br><span class="text-muted">' + message + '</span></div> <img src="' + receiverimg + '" width="50" height="50" style="border-radius:50px"></div></li>');
                abp.notify.info(message, 'Notification');
                GetNotifications(userid);
            }
        });

        function GetNotifications($b) {
            _userNotifService.getUserNotifications({ filter: '0|' + $b + '|0', forExport: true }).done(function (result) {
                var count = result.items.length;
                if (count != 0) {
                    $("#notifcount").show();
                    $("#notifcount").text(count);
                }
                else {
                    $("#notifcount").hide();
                }
                $("#notifred").html('You&nbsp;have&nbsp;' + result.items.length + '&nbsp;notification.');
                $("#notiflist").html('');
                $('#markread').html('');
                for (var i = 0; i < result.items.length; i++) {
                    //var $listcount = "";
                    var $Iconlistcount = i + 1;

                    var $id = result.items[i].id;
                    var $notifId = result.items[i].notificationId;
                    var $userId = result.items[i].userId;
                    var $cTime = result.items[i].creationTime

                    var $trCode = result.items[i].transactionCode;
                    var $trId = result.items[i].transactionId;
                    var $message = result.items[i].message;
                    var $userName = result.items[i].userName;
                    var $action = result.items[i].action;
                    var $pic = abp.appPath + "/images/avatar/user.png";

                    if (i == 0) {
                        $('#markread').prepend('<a href="javascript:void(0)" class="mark-read"' + ' data-val-userId=' + $userId + '>Mark all as read (' + result.items.length + ').</a>');
                    }

                    //$("#notiflist").prepend('<a href="javascript:void(0)" class="dropdown-item media teacher-link3" title=' + $trCode + ' data-val-id=' + $id + ' data-val-notifId=' + $notifId + ' data-val-userId=' + $userId + ' data-val-cTime=' + $cTime + ' data-val-trCode=' + $trCode + ' data-val-trId=' + $trId + ' data-val-action=' + $action + '><i class="fa ' + $Iconlistcount + ' fa - 2x"></i><p>' + $message + ' by ' + $userName + '</p></a >');
                    $("#notiflist").prepend('<a href="javascript:void(0)" class="dropdown-item media teacher-link3" title=' + $trCode + ' data-val-id=' + $id + ' data-val-notifId=' + $notifId + ' data-val-userId=' + $userId + ' data-val-cTime=' + $cTime + ' data-val-trCode=' + $trCode + ' data-val-trId=' + $trId + ' data-val-action=' + $action + '>'
                        //+ '<span class= "photo media-left" ><img alt="avatar" src="images/avatar/user.png"></span>'
                        + '<span class= "photo media-left" ><img alt="avatar" src="' + $pic +'"></span>'
                        +'<div class="message media-body">'
                        + '<span class="name float-left">' + $userName + '</span>'
                        + '<span class="time float-right">' + findNotifDate($cTime) + '</span>'
                        + '<p>' + $message + '</p>'
                        +'</div>'
                        +'</a >');
                }
                $('.teacher-link3').on("click", function (e) {
                    //$('#fid').val("");
                    //$('#Name2').val("");
                    ////$('#Uid').val();
                    //$('#Rid').val("");
                    //$('#r1c').val(2);
                    var $id = $(this).attr("data-val-id");
                    var $notifId = $(this).attr("data-val-notifId");
                    var $userId = $(this).attr("data-val-userId");
                    var $cTime = $(this).attr("data-val-cTime");
                    var $trId = $(this).attr("data-val-trId");
                    var $action = $(this).attr("data-val-action");

                    var userNtf = {
                        "id": $id,
                        "notificationId": $notifId,
                        "userId": $userId,
                        "creationTime": $cTime,
                        "state": 1
                    }
                    _userNotifService.updateUserNotification(userNtf).done(function () {
                        if ($action.toUpperCase() == 'Leads2'.toUpperCase()) {
                            setTimeout(function () {
                                //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                                window.location.href = abp.appPath + 'Leads/Details?id=' + $trId;
                            }, 2000);
                        }
                        else {
                            setTimeout(function () {
                                //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                                window.location.href = abp.appPath + $action + '/Edit?id=' + $trId;
                            }, 2000);
                        }
                    });
                    //Notified();
                    //sessionStorage.setItem("id", $fileId2);
                    //sessionStorage.setItem("Rfid", $Sid);
                    //window.location.href = abp.appPath + 'SharedRole/Index?id=' + $Sid;
                });
                $('.mark-read').on("click", function (e) {
                    var $userId = $(this).attr("data-val-userId");
                    if ($userId.length > 0 || $userId > 0) {
                        _userNotifService.markAllRead({ id: $userId }).done(function () {
                            GetNotifications($userId);
                        });
                    }
                });
            });
        }

        function findNotifDate(date_notified) {
            /**
            * @ findNotifDate : Finds the Date Difference of a Notification
            * @ date_notified : The notification date
            **/
            const date_sent_tmp = new Date(date_notified);

            //Check for timestamps
            if (date_notified.indexOf('-') != -1) {
                var date_sent = date_sent_tmp.getTime();
            } else {
                var date_sent = date_notified;
            }

            const date_now = new Date();
            //current timestamp
            var today = date_now.getTime();

            //Subtract the timestamps
            var calc = new Date(today - date_sent);

            //Prevent Extra 1 Hour
            calc.setHours(calc.getUTCHours() + 0);

            //Make our result readable
            var calcDate = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
            var calcTime = calc.getHours() + ':' + calc.getMinutes() + ':' + calc.getSeconds();

            //Get How many days, months and years that has passed
            var date_passed = calcDate.split("-");
            var time_passed = calcTime.split(":");

            if (!(date_passed.includes('1-1-1970'))) {

                var days_passed = ((parseInt(date_passed[0]) - 1) != 0) ?
                    parseInt(date_passed[0]) - 1 : null;
                var months_passed = ((parseInt(date_passed[1]) - 1) != 0) ?
                    parseInt(date_passed[1]) - 1 : null;
                var years_passed = ((parseInt(date_passed[2]) - 1970) != 0) ?
                    parseInt(date_passed[2]) - 1970 : null;

            } else {
                var days_passed = null;
                var months_passed = null;
                var years_passed = null;
            }

            var hours_passed = parseInt(time_passed[0]);
            var mins_passed = parseInt(time_passed[1]);
            var secs_passed = parseInt(time_passed[2]);

            //Set up your Custom Text output here
            const s = ["sec ago", "secs ago"]; //seconds
            const m = ["min", "sec ago", "mins", "secs ago"]; //minutes
            const h = ["hr", "min ago", "hrs", "mins ago"]; //hours
            const d = ["day", "hr ago", "days", "hrs ago"]; //days
            const M = ["month", "day ago", "months", "days ago"]; //months
            const y = ["year", "month ago", "years", "months ago"]; //years

            var ret, retA, retB;

            if (!(days_passed) && !(months_passed) && !(years_passed)
                && !(hours_passed) && !(mins_passed)) {

                ret = (secs_passed == 1) ? secs_passed + ' ' + s[0] : secs_passed + ' ' + s[1];

            } else if (!(days_passed) && !(months_passed) && !(years_passed)
                && !(hours_passed)) {

                retA = (mins_passed == 1) ? mins_passed + ' ' + m[0] : mins_passed + ' ' + m[2];
                retB = (secs_passed == 1) ? secs_passed + ' ' + m[1] : secs_passed + ' ' + m[3];

                ret = retA + ' ' + retB;


            } else if (!(days_passed) && !(months_passed) && !(years_passed)) {

                retA = (hours_passed == 1) ? hours_passed + ' ' + h[0] : hours_passed + ' ' + h[2];
                retB = (mins_passed == 1) ? mins_passed + ' ' + h[1] : mins_passed + ' ' + h[3];

                ret = retA + ' ' + retB;

            } else if (!(years_passed) && !(months_passed)) {
                retA = (days_passed == 1) ? days_passed + ' ' + d[0] : days_passed + ' ' + d[2];
                retB = (hours_passed == 1) ? hours_passed + ' ' + d[1] : hours_passed + ' ' + d[3];

                ret = retA + ' ' + retB;

            } else if (!(years_passed)) {

                retA = (months_passed == 1) ? months_passed + ' ' + M[0] : months_passed + ' ' + M[2];
                retB = (days_passed == 1) ? days_passed + ' ' + M[1] : days_passed + ' ' + M[3];

                ret = retA + ' ' + retB;
            } else {
                retA = (years_passed == 1) ? years_passed + ' ' + y[0] : years_passed + ' ' + y[2];
                retB = (months_passed == 1) ? months_passed + ' ' + y[1] : months_passed + ' ' + y[3];

                ret = retA + ' ' + retB;
            }

            //Check if return contains a negative value
            if (ret.includes('-')) {
                ret += " ( TIME ERROR )-> Invalid Date Provided!";
            }

            return (ret);
        }
    });
});
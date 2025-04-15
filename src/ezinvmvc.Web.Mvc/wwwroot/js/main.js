(function ($) {

    //Notification handler
    abp.event.on('abp.notifications.received', function (userNotification) {
        abp.notifications.showUiNotifyForUserNotification(userNotification);
        console.log('notified');
        //Desktop notification
        Push.create("ezinvmvc", {
            body: userNotification.notification.data.message,
            icon: abp.appPath + 'images/app-logo-small.png',
            timeout: 6000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    });

    //serializeFormToObject plugin for jQuery
    $.fn.serializeFormToObject = function () {
        //serialize to array
        var data = $(this).serializeArray();

        //add also disabled items
        $(':disabled[name]', this).each(function () {
            data.push({ name: this.name, value: $(this).val() });
        });

        //map to object
        var obj = {};
        data.map(function (x) { obj[x.name] = x.value; });

        return obj;
    };

    //Configure blockUI
    if ($.blockUI) {
        $.blockUI.defaults.baseZ = 2000;
    }

})(jQuery);

// Menu Trigger
$('#menuToggle').on('click', function (event) {
    var windowWidth = $(window).width();
    if (windowWidth < 1010) {
        $('body').removeClass('open');
        if (windowWidth < 760) {
            $('#left-panel').slideToggle();
        } else {
            $('#left-panel').toggleClass('open-menu');
        }
    } else {
        $('body').toggleClass('open');
        $('#left-panel').removeClass('open-menu');
    }

});

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function priceDiscount(price, disc1, type1, disc2, type2, disc3, type3) {
    var total = 0;
    if (type1 === 1) {
        total = total + disc1;
        price = price - total;
    }
    else {
        total = total + (price * (disc1 / 100));
        price = price - total;
    }
    if (type2 === 1) {
        total = total + disc2;
        price = price - total;
    }
    else {
        total = total + (price * (disc2 / 100));
        price = price - total;
    }
    if (type3 === 1) {
        total = total + disc3;
        price = price - total;
    }
    else {
        total = total + (price * (disc3 / 100));
        price = price - total;
    }

    return total;
}


$(".menu-item-has-children.dropdown").each(function () {
    $(this).on('click', function () {
        var $temp_text = $(this).children('.dropdown-toggle').html();
        $(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>');
    });
});

// Load Resize
$(window).on("load resize", function (event) {
    var windowWidth = $(window).width();
    if (windowWidth < 1010) {
        $('body').addClass('small-device');
    } else {
        $('body').removeClass('small-device');
    }

});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function getFormattedDateMY(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + year;
}

function getMonthYearFull(date) {
    var bd = date.split('/');
    var fulld = "";
    if (bd.length > 1) {
        full = bd[0] + '/01/' + bd[1];
    }

    return full;
}

function getFormattedDateTime(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var hour = date.getHours().toString();
    var tt = hour > 12 ? 'PM' : 'AM';
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour.length > 1 ? hour : '0' + hour;

    var min = date.getMinutes().toString();
    min = min.length > 1 ? min : '0' + min;

    return month + '/' + day + '/' + year + ' ' + hour + ':' + min + ' ' + tt;
}
function getFormattedTime(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.toString().length > 1 ? day : '0' + day;

    var hour = date.getHours().toString();
    var tt = hour > 12 ? 'PM' : 'AM';
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour.toString().length > 1 ? hour : '0' + hour;

    var min = date.getMinutes().toString();
    min = min.toString().length > 1 ? min : '0' + min;

    return hour + ':' + min + ' ' + tt;
}

function preformatFloat(float) {
    if (!float) {
        return '';
    };

    //Index of first comma
    const posC = float.indexOf(',');

    if (posC === -1) {
        //No commas found, treat as float
        return float;
    };

    //Index of first full stop
    const posFS = float.indexOf('.');

    if (posFS === -1) {
        //Uses commas and not full stops - swap them (e.g. 1,23 --> 1.23)
        return float.replace(/\,/g, '.');
    };

    //Uses both commas and full stops - ensure correct order and remove 1000s separators
    return ((posC < posFS) ? (float.replace(/\,/g, '')) : (float.replace(/\./g, '').replace(',', '.')));
}

  $(function() {
            /*
             * Initialise example carousel
             */
            //$("#feature > div").scrollable({interval: 2000}).autoscroll();
            
            /*
             * Initialise print preview plugin
             */
            // Add link for print preview and intialise
            $('#aside').prepend('<a class="print-preview">Print this page</a>');
            $('a.print-preview').printPreview();
            
            // Add keybinding (not recommended for production use)
            //$(document).bind('keydown', function(e) {
            //    var code = (e.keyCode ? e.keyCode : e.which);
            //    if (code === 80 && !$('#print-modal').length) {
            //        $.printPreview.loadPrintPreview();
            //        return false;
            //    }            
            //});
        });
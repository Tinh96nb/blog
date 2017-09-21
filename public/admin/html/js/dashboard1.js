 $(document).ready(function() {
     "use strict";
     $(".tst2").on("click", function() {
         $.toast({
             heading: 'Welcome to my Elite admin',
             text: 'Use the predefined ones, or specify a custom position object.',
             position: 'bottom-right',
             loaderBg: '#ff6849',
             icon: 'warning',
             hideAfter: 3500,
             stack: 6
         });

     });
     $(".tst3").on("click", function() {
         $.toast({
             heading: 'Welcome to my Elite admin',
             text: 'Use the predefined ones, or specify a custom position object.',
             position: 'top-right',
             loaderBg: '#ff6849',
             icon: 'success',
             hideAfter: 3500,
             stack: 6
         });

     });

     $(".tst4").on("click", function() {
         $.toast({
             heading: 'Welcome to my Elite admin',
             text: 'Use the predefined ones, or specify a custom position object.',
             position: 'top-right',
             loaderBg: '#ff6849',
             icon: 'error',
             hideAfter: 3500
         });

     });


     //ct-visits
     new Chartist.Line('#ct-visits', {
         labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
         series: [
             [5, 2, 7, 4, 5, 3, 5, 4],
             [2, 5, 2, 6, 2, 5, 2, 4]
         ]
     }, {
         top: 0,
         low: 1,
         showPoint: true,
         fullWidth: true,
         plugins: [
             Chartist.plugins.tooltip()
         ],
         axisY: {
             labelInterpolationFnc: function(value) {
                 return (value / 1) + 'k';
             }
         },
         showArea: true
     });
     // counter
     $(".counter").counterUp({
         delay: 100,
         time: 1200
     });

     var sparklineLogin = function() {
         $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7ace4c'
         });
         $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7460ee'
         });
         $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#11a0f8'
         });
         $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#f33155'
         });
     }
     var sparkResize;
     $(window).on("resize", function(e) {
         clearTimeout(sparkResize);
         sparkResize = setTimeout(sparklineLogin, 500);
     });
     sparklineLogin();

     $("table tr").editable({

         // enable keyboard support
         keyboard: true,

         // double click to start editing
         dblclick: true,

         // enable edit buttons
         button: true,

         // CSS selector for edit buttons
         buttonSelector: ".edit",

         // uses select dropdown instead of input field
         dropdowns: {},

         // maintains column width when editing
         maintainWidth: true,

         // callbacks for edit, save and cancel actions
         edit: function(values) {
             $(".edit i", this)
                 .removeClass('fa-pencil')
                 .addClass('fa-save')
                 .attr('title', 'Save');
         },
         save: function(values) {
              $(".edit i", this)
            .removeClass('fa-save')
            .addClass('fa-pencil')
            .attr('title', 'Edit');
             var _id = $(this).context.cells[0].innerHTML;
             var values = values;
             values._id = _id;
             values._csrf = $('meta[name="_csrf"]').attr('content');
             $.ajax({
                     type: "PUT",
                     url: '',
                     data: values,
                     dataType: 'json',
                 })
                 .done(function(data) {
                    if(data.status=='error'){
                        $.toast({
                            heading: 'Có vài lỗi xảy ra.',
                            text: data.messages.toString(),
                            position: 'top-right',
                            loaderBg: '#ff6849',
                            icon: 'warning',
                            hideAfter: 3500,
                            stack: 6  });
                    } else {
                        $.toast({
                            heading: 'Thành công',
                            text:  data.messages,
                            position: 'top-right',
                            loaderBg: '#ff6849',
                            icon: 'success',
                            hideAfter: 3500,
                            stack: 6  });
                    }
                 })
                 .fail(function() {
                     console.log("error");
                 });
         },
         cancel: function(values) {
          $(".edit i", this)
            .removeClass('fa-save')
            .addClass('fa-pencil')
            .attr('title', 'Edit');
         }
     });
 });
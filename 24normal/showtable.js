$(document).ready(function () {
  $("body").append("<div id='loading'><div class='loadingMsg'></div></div>");
  $.getJSON($("meta[name=bmstable]").attr("content"), function(header){
    $("title").text(header.name);
    $("h1").text(header.name);
    $("#original_url").text(header.name);
    $("#original_url").attr("href", header.original_url);
    $("#last_update").text(header.last_update);
    $.getJSON(header.data_url, function(data){
      var table = [];
      data.forEach(function(row){
        table.push([
          header.symbol + row['level'],
          "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + row['md5'] + "'>" + row['title'] + "</a>",
          (row['url']      != '') ? "<a href='" + row['url'] + "'>" + row['artist'] + "</a>" : row['artist'],
//        (row['url_diff'] != '') ? "<a href='" + row['url_diff'] + "' title ='" + row['name_diff'] + "'>" + header.symbol + "</a>" : '<span style="color: #aaa;">-</a>',
          (row['url_diff'] != '') ? "<a href='" + row['url_diff'] + "'>" + header.symbol + "</a>" : '<span style="color: #aaa;">-</a>',
          row['comment'].replace(/\r?\n/g, '<br />'),
		  "<span style='white-space: nowrap;'><a href='http://www.ribbit.xyz/bms/score/view?p=1&md5=" + row['md5'] + "'/></a> <a href='http://www.ribbit.xyz/bms/score/view?p=2&md5=" + row['md5'] + "'/></a><span>",
        ]);
      });
      $('#difficulty_table').html('<table cellpadding="0" cellspacing="0" border="0" class="compact hover stripe row-border" id="table_list"></table>');
      var data_table = $('#table_list').DataTable({
        "data": table,
        "columns": [
          { "title": "レベル",       "class": "dt-center row-border tooltip-right col_level"},
          { "title": "タイトル",     "class": "dt-head-center compact tooltip-right"},
          { "title": "アーティスト", "class": "dt-head-center compact tooltip-right"},
          { "title": "差分",         "class": "dt-center      compact tooltip-right col_diff_link"},
          { "title": "コメント",     "class": "dt-head-center row-border tooltip-right col_comment"},
        ],
          "columnDefs": [
//          { "visible": false, "targets": 0},
            { type: 'natural', searchable: false, targets: 0 },
            { orderable: false, searchable: false, targets: [1,2,3,4,5] },
          ],
        "order": [[0, "asc" ]],
        "info": false,
        "autoWidth": false,
        "jQueryUI": true,
        "paging": false,
        "drawCallback": function(settings) {
          var api = this.api();
          var rows = api.rows({page:'current'}).nodes();
          var last = null;
          api.column(0, {page: 'current'}).data().each( function(group, i) {
            if(last !== group) {
              $(rows).eq(i).before(
                '<tr class="level_group ui-widget-header dt-body-center" style="text-align: center;"><td colspan="6">' + group + '</td></tr>'
              );
              last = group;
            }
          });
          $(".col_comment").each(function(){
            $(this).html( $(this).html().replace(/(?:[^h]|^)((ttp|ttps):\/\/[\w?=&.\/-;#~%-:!]+)/g, 'h$1') );
            $(this).html( $(this).html().replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-:!]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1">$1</a> ') );
          });
        },
      });

      // Remove loading image
      $("#loading").remove();

      // Order by the grouping
      $('#table_list tbody').on( 'click', 'tr.level_group', function () {
        var currentOrder = data_table.order()[0];
        if ( currentOrder[0] === 0 && currentOrder[1] === 'asc' ) {
            data_table.order( [ 0, 'desc' ] ).draw();
        }
        else {
            data_table.order( [ 0, 'asc' ] ).draw();
        }
      });
    });
  });
});

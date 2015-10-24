$( document ).ready(function() {
	/*var data = new FormData();
	$.each(jQuery('#file')[0].files, function(i, file) {
		data.append('file-'+i, file);
	});
	data.append('siteSection',$('#siteSection').val());
	data.append('language',$('#language').val());
	$('#spellSubmit').bind('click', function() {
		$.ajax({
			url: "/bin/aemfeatures/spellCheckerExtended", 
			type: 'POST',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			async: false, 
			error: 
				function(xhr, textStatus, errorThrown) {
				$("#result").html("textStatus : " + textStatus);

			}
		});
	});*/

	var mapArr = {};
	$('#linkCheckerReport').bind('click', function() {
		mapArr = {};
		mapArr["siteSection"] = '/content/geometrixx/fr/products';
		var myData = "contentPath="+ mapArr["contentPath"];
		$.ajax({
			url: "/bin/aemfeatures/linkChecker", 
			type: 'POST',
			data: myData,
			async: false, 
			success: 
				function(data, textStatus, xhr) {
				alert('success');
			},
			error: 
				function(xhr, textStatus, errorThrown) {
				$("#result").html("textStatus : " + textStatus);

			}
		});
	});

});


 $( document ).ready(function() {
        var mapArr = {};
        $('#linkCheckerReport').bind('click', function() {
        	mapArr = {};
        	mapArr["siteSection"] = '/content/geometrixx/fr/products';
        	var myData = "contentPath="+ mapArr["contentPath"];
          $.ajax({
   	   		url: "/bin/nabrwd/linkchecker", 
   	   		type: 'POST',
   	   		/* dataType: 'json',
   	   		contentType: "application/json; charset=UTF-8",
   	   		mimeType: 'application/json', */
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
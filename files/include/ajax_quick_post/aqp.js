
if (typeof fluxbb == 'undefined')
	var fluxbb = {};

fluxbb.aqp = {
	tid: 0,
	last_post_id: 0,
	cur_page: 0,

	post : function(the_form)
	{
		console.log(fluxbb.aqp);
		$('#aqp-icon').show();
		$('#quickpost form input').attr('disabled', 'disabled');

		var values = {};
		for (var i = 0; i < the_form.elements.length; i++)
		{
			var el = the_form.elements[i];
			if (el.name != 'undefined' && el.value != 'undefined' && el.name != 'preview')
				values[el.name] = el.value;
		}

		var url = (typeof base_url == 'undefined') ? '' : base_url + '/';

		$.post(url + 'post.php?tid=' + fluxbb.aqp.tid + '&p=' + fluxbb.aqp.cur_page + '&ajax=1', values, function(data)
			{
				if (data.indexOf('<div id="p') != -1)
				{
					new_posts = data.substring(data.indexOf('<div id="p' + fluxbb.aqp.last_post_id) + 4);

					// New post was added to the new page? Redirect in that case
					var pos = new_posts.indexOf('<div id="p');
					if (pos == -1)
						window.location = url + 'viewtopic.php?id=' + fluxbb.aqp.tid + '&action=new';

					new_posts = new_posts.substring(pos);

					new_posts = new_posts.substring(new_posts.indexOf('<div id="p')); // trim top crumbs

					first_new_post = new_posts.substring(new_posts.lastIndexOf('<div id="p') + 10);
					first_new_post = first_new_post.substring(0, first_new_post.indexOf('"'));

					new_posts = new_posts.substring(0, new_posts.indexOf('<div id="aqp">')); // posts end

					last_post = new_posts.substring(new_posts.lastIndexOf('<div id="p') + 10);
					last_post = last_post.substring(0, last_post.indexOf('"'));
					fluxbb.aqp.last_post_id = last_post;

					$('#aqp').html(new_posts);
					window.location.hash = 'p' + first_new_post;

					the_form['req_message'].value = '';
					if (the_form['req_username']) the_form['req_username'].value = '';
					if (the_form['req_email']) the_form['req_email'].value = '';
					if (the_form['email']) the_form['email'].value = '';
				}
				else
					alert(data);

				$('#aqp-icon').hide();
				$('#quickpost form input').removeAttr('disabled');
			}
		);

		return false;
	}
};

window.fluxbb = fluxbb;

##
##
##        Mod title:  Ajax Quick Post
##
##      Mod version:  2.1.1
##  Works on FluxBB:  1.5.0
##     Release date:  2012-08-03
##      Review date:  2012-08-03
##           Author:  Daris (daris91@gmail.com)
##
##      Description:  Allows quickly post a reply (using ajax)
##
##   Repository URL:  http://fluxbb.org/resources/mods/ajax-quick-post/
##
##   Affected files:  viewtopic.php
##                    header.php
##                    footer.php
##                    include/functions.php
##                    post.php
##
##       Affects DB:  No
##
##       DISCLAIMER:  Please note that "mods" are not officially supported by
##                    FluxBB. Installation of this modification is done at
##                    your own risk. Backup your forum database and any and
##                    all applicable files before proceeding.
##
##


#
#---------[ 1. UPLOAD ]-------------------------------------------------------
#

files/include/ajax_quick_post/aqp.js to include/ajax_quick_post/aqp.js
files/img/ajax_quick_post/loading.gif to img/ajax_quick_post/loading.gif

#
#---------[ 2. OPEN ]---------------------------------------------------------
#

viewtopic.php

#
#---------[ 3. FIND ]---------------------------------------------
#

// Add/update this topic in our list of tracked topics
if (!$pun_user['is_guest'])

#
#---------[ 4. REPLACE WITH ]-------------------------------------------------
#

// Add/update this topic in our list of tracked topics
if (!$pun_user['is_guest'] && !isset($_GET['ajax']))

#
#---------[ 3. FIND ]---------------------------------------------
#

// Fetch some info about the topic
if (!$pun_user['is_guest'])
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());
else
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, 0 AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());

#
#---------[ 4. REPLACE WITH (add t.last_post_id to SELECT) ]-------------------------------------------------
#

// Fetch some info about the topic
if (!$pun_user['is_guest'])
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, t.last_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());
else
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, t.last_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, 0 AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());

#
#---------[ 5. FIND ]---------------------------------------------
#

// Retrieve a list of post IDs, LIMIT is (really) expensive so we only fetch the IDs here then later fetch the remaining data
$result = $db->query('SELECT id FROM '.$db->prefix.'posts WHERE topic_id='.$id.' ORDER BY id LIMIT '.$start_from.','.$pun_user['disp_posts']) or error('Unable to fetch post IDs', __FILE__, __LINE__, $db->error());

#
#---------[ 6. REPLACE WITH ]-------------------------------------------------
#

// Retrieve a list of post IDs, LIMIT is (really) expensive so we only fetch the IDs here then later fetch the remaining data
$result = $db->query('SELECT id FROM '.$db->prefix.'posts WHERE topic_id='.$id.(isset($_GET['lpid']) ? ' AND id > '.intval($_GET['lpid']) : '').' ORDER BY id LIMIT '.$start_from.','.$pun_user['disp_posts']) or error('Unable to fetch post IDs', __FILE__, __LINE__, $db->error());

#
#---------[ 7. FIND ]---------------------------------------------
#

<div class="postlinksb">

#
#---------[ 8. BEFORE, ADD ]-------------------------------------------------
#

<div id="aqp"></div>

<?php
// Add/update this topic in our list of tracked topics
if (!$pun_user['is_guest'] && isset($cur_post) && $cur_post['posted'] > $tracked_topics['topics'][$id])
{
	$tracked_topics = get_tracked_topics();
	$tracked_topics['topics'][$id] = $cur_post['posted'];
	set_tracked_topics($tracked_topics);
}
?>

#
#---------[ 9. FIND ]--------------------------------------------
#

			<p class="buttons"><input type="submit" name="submit" tabindex="<?php echo $cur_index++ ?>" value="<?php echo $lang_common['Submit'] ?>" accesskey="s" /> <input type="submit" name="preview" value="<?php echo $lang_topic['Preview'] ?>" tabindex="<?php echo $cur_index++ ?>" accesskey="p" /></p>

#
#---------[ 10. REPLACE WITH ]-----------------------------------------------
#

			<script type="text/javascript">
				fluxbb.aqp.last_post_id = <?php echo $post_ids[count($post_ids) - 1] ?>;
				fluxbb.aqp.tid = <?php echo $id ?>;
				fluxbb.aqp.cur_page = <?php echo $p ?>;
			</script>
			<p class="buttons">
				<input type="submit" name="submit" onclick="if (fluxbb.aqp.post(this.form)) {return true;} else {return false;}" tabindex="<?php echo $cur_index++ ?>" value="<?php echo $lang_common['Submit'] ?>" accesskey="s" />
				<input type="submit" name="preview" value="<?php echo $lang_topic['Preview'] ?>" tabindex="<?php echo $cur_index++ ?>" accesskey="p" />
				<span id="aqp-icon" style="background: url(<?php echo $pun_config['o_base_url'] ?>/img/ajax_quick_post/loading.gif) no-repeat; padding: 1px 8px; margin-left: 5px; display: none;"></span>
			</p>

#
#---------[ 11. OPEN ]---------------------------------------------------------
#

header.php

#
#---------[ 12. FIND ]---------------------------------------------
#

// Make sure no one attempts to run this script "directly"
if (!defined('PUN'))
	exit;

#
#---------[ 13. AFTER, ADD ]---------------------------------------------------
#

if (isset($_GET['ajax']))
	return;

#
#---------[ 14. FIND ]---------------------------------------------
#

echo '<!--[if lte IE 6]><script type="text/javascript" src="style/imports/minmax.js"></script><![endif]-->'."\n";

#
#---------[ 15. AFTER, ADD ]---------------------------------------------------
#

if (basename($_SERVER['PHP_SELF']) == 'viewtopic.php')
{
	$page_head['jquery'] = '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>';
	$page_head['base_url'] = '<script type="text/javascript">var base_url = "'.$pun_config['o_base_url'].'";</script>';
	echo '<script type="text/javascript" src="'.$pun_config['o_base_url'].'/include/ajax_quick_post/aqp.js"></script>'."\n";
}

#
#---------[ 16. OPEN ]---------------------------------------------------------
#

footer.php

#
#---------[ 17. FIND ]---------------------------------------------
#

// Make sure no one attempts to run this script "directly"
if (!defined('PUN'))
	exit;

#
#---------[ 18. AFTER, ADD ]---------------------------------------------------
#

if (isset($_GET['ajax']))
{
	$db->end_transaction();
	$db->close();
	return;
}

#
#---------[ 19. OPEN ]---------------------------------------------------------
#

include/functions.php

#
#---------[ 20. FIND ]---------------------------------------------
#

function redirect($destination_url, $message)
{
	global $db, $pun_config, $lang_common, $pun_user;

#
#---------[ 21. AFTER, ADD ]---------------------------------------------------
#

	if (isset($_GET['ajax']))
		return;

#
#---------[ 22. FIND ]---------------------------------------------
#

function message($message, $no_back_link = false, $http_status = null)
{

#
#---------[ 23. AFTER, ADD ]---------------------------------------------------
#

	if (isset($_GET['ajax']))
	{
		echo $message;
		exit;
	}

#
#---------[ 24. OPEN ]---------------------------------------------------------
#

post.php

#
#---------[ 25. FIND ]---------------------------------------------
#

			$db->query('UPDATE '.$db->prefix.'users SET num_posts=num_posts+1, last_post='.$now.' WHERE id='.$pun_user['id']) or error('Unable to update user', __FILE__, __LINE__, $db->error());

#
#---------[ 26. AFTER, ADD ]---------------------------------------------------
#

		if (isset($_GET['ajax']) && isset($_GET['p']))
		{
			$db->end_transaction();
			$db->close();
			header('Location: viewtopic.php?ajax&id='.$tid.'&p='.intval($_GET['p']));
		}

#
#---------[ 25. FIND ]---------------------------------------------
#

		redirect('viewtopic.php?pid='.$new_pid.'#p'.$new_pid, $lang_post['Post redirect']);

#
#---------[ 26. BEFORE, ADD ]---------------------------------------------------
#

		if (isset($_GET['ajax']) && isset($_GET['p']))
		{
			$db->end_transaction();
			$db->close();
			header('Location: viewtopic.php?ajax&id='.$tid.'&p='.intval($_GET['p']));
		}

#
#---------[ 27. FIND ]---------------------------------------------
#

// If a topic ID was specified in the url (it's a reply)
if ($tid)

#
#---------[ 28. BEFORE, ADD ]---------------------------------------------------
#

if (isset($_GET['ajax']) && !empty($errors))
{
	echo implode("\n", $errors);
	exit;
}

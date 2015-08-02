<?php
$public_system_db_host = '127.0.0.1';
$public_system_db_name = 'yqx';
$public_system_db_user = 'root';
$public_system_db_pwd = '546911';

$public_system_db_host = 'rdsjvf36vzn3eme.mysql.rds.aliyuncs.com';
$public_system_db_name = 'rlj8ed505aoe9sr9';
$public_system_db_user = 'rlj8ed505aoe9sr9';
$public_system_db_pwd = '12345678';

return array (
	'SITE_INFO' => 
			array ( 
					'name' => 'xxxx',
					'keyword' => '我的关键词',
					'description' => '这里写描述',
					'url' => 'http://www.tttt.com/',
					'ossurl' => 'http://ttttt.oss-cn-hangzhou.aliyuncs.com/ttttt.aliapp.com/1/webroot',
			), 
	'TOKEN' => 
			array (
					'false_static' => 2,
				),
					'WEB_ROOT' => 'http://e.wesambo.com',
					'DB_HOST' => $public_system_db_host,
					'DB_NAME' => $public_system_db_name,
					'DB_USER' => $public_system_db_user,
					'DB_PWD' => $public_system_db_pwd,
					'DB_PORT' => '3306',
					'DB_PREFIX' => 'cj_',
					'webPath' => '/',
			);
?>
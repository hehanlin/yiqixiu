<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
		$this->display('index2_9');
    }
	
    public function jumpgo(){
		header("Location: ".str_replace('&amp;','&',I("get.url")));
    }
	
    public function login(){
		header('Content-type: text/json');
		header('HTTP/1.1 401 Unauthorized');
		echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!","obj"=> null,"map"=> null,"list"=> null));
		//header('HTTP/1.1 200 ok');
		//echo json_encode(array("success" => true,"code"=> 200,"msg" => "success","obj"=> null,"map"=> null,"list"=> null));
    }
}
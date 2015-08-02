<?php
class BasesetAction extends BackAction{
	public function _initialize() {
        parent::_initialize();  //RBAC 验证接口初始化
    }
	public function index(){
        $role = M('Role')->getField('id,name');
        $map = array(
		
		);
		
		$map['username'] = 'admin';
        $UserDB = D('User');

        
        $data = $UserDB->where($map)->find();
		
		$data['free_time'] = $data['free_time'] / 3600 /24 ;
       
        $this->assign('data',$data);
		//print_r($data);
       
		
        $this->display();
    }

    // 添加用户
    public function add(){
        
    }

    // 编辑用户
    public function edit(){
         $UserDB = D("User");
		 
		 $map['username'] = 'admin';
		 
		 //$data = $UserDB->where($map)->find();
		 
		 $data['free_time'] = $_POST['free_time'] * 3600 * 24;
		 
		 $data['scene_times'] = $_POST['scene_times'];
			
		$UserDB->where($map)->save($data);
		
		 $this->success('修改成功！');
		
    }

    //ajax 验证用户名
    public function check_username(){
        $userid = $this->_get('userid');
        $username = $this->_get('username');
        if(D("User")->check_name($username,$userid)){
            echo 1;
        }else{
            echo 0;
        }
    }

    //删除用户
    public function del(){
        $id = $this->_get('id','intval',0);
        if(!$id)$this->error('参数错误!');
        $UserDB = D('User');
        $info = $UserDB->getUser(array('id'=>$id));
        if($info['username']==C('SPECIAL_USER')){     //无视系统权限的那个用户不能删除
           $this->error('禁止删除此用户!');
        }
        if($UserDB->delUser('id='.$id)){
            if(M("RoleUser")->where('user_id='.$id)->delete()){
                $this->assign("jumpUrl",U('User/index'));
                $this->success('删除成功！');
            }else{
                $this->error('用户成功,但角色对应关系删除失败!');
            }
        }else{
            $this->error('删除失败!');
        }
    }
}
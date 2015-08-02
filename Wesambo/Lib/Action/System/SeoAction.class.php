<?php
class SeoAction extends BackAction{
	public function _initialize(){	
		parent::_initialize();
	}

	public function index(){
		$seo = M('Seo');
		$count = $seo->count();
		$page=new Page($count,20);
		$show=$page->show();
		$data = $seo->field('id,title')->limit($page->firstRow.','.$page->listRows)->select();
		$this->assign('data',$data);
		$this->assign('show',$show);
		$this->display();
	}

	public function add(){
		if($_POST){
			$data['title'] = $_POST['title'];
			$data['content'] = $_POST['content'];
			$seo = M('Seo');
			if($seo->add($data)){
				$this->success('添加成功',U('index',array('pid'=>88,level=>'3')));
			}else{
				$this->error('添加失败');
			}
			// $data['content'] = stripslashes(htmlspecialchars_decode($_POST['content']));
/*			$this->assign('content',$content);
			$this->display('show');*/
		}else{
			$this->display();
		}
		
	}

	public function edit(){
		if($_POST){
			$data['id'] = $this->_post('id');
			$data['title'] = $this->_post('title');
			$data['content'] = $this->_post('content');
			$seo = M('Seo');
			if($seo->save($data)){
				$this->success('修改成功',U('index',array('pid'=>88,level=>'3')));
			}else{
				$this->error('修改失败');
			}
		}else{
			$where['id'] = $this->_get('id');
			$seo = M('Seo');
			$data = $seo->where($where)->find();
			$content = stripslashes(htmlspecialchars_decode($data['content']));
			$this->assign('data',$data);
			$this->assign('content',$content);
			$this->display();
		}

	}

	public function del(){

		$where['id'] = $this->_get('id');
		$seo = M('Seo');
		if($seo->where($where)->delete()){
			$this->success('删除成功',U('index',array('pid'=>88,level=>'3')));
		}else{
			dump($seo->getLastSql());
			//$this->error('删除失败',U('index',array('pid'=>88,level=>'3')));
		}
	}

	public function show(){
		$this->display();
	}
}
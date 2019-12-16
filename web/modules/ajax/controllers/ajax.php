<?php
class AjaxControllersAjax extends FSControllers{
    function __construct(){
        parent::__construct();
        $_POST = json_decode(file_get_contents('php://input'), true);
    }

    function do_register() {
        global $user;
        $json = array(
            'error' => 1,
            'message' => 'Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại kết nối!'
        );

        $data = array();
        $data['mobile'] = FSInput::get('mobile', '', 'str');
        $data['password'] = FSInput::get('password', '', 'str');
        $data['email'] = FSInput::get('email', '', 'str');
        $data['first_name'] = FSInput::get('first_name', '', 'str');
        $data['last_name'] = FSInput::get('last_name', '', 'str');
        $data['gender'] = FSInput::get('gender', '', 'str');
        $data['birthday'] = FSInput::get('birthday', '', 'str');
        $data['city_id'] = FSInput::get('city_id', 0);
        $data['district_id'] = FSInput::get('district_id', 0);
        $data['address'] = FSInput::get('address', '', 'str');
        $data['service_charge'] = FSInput::get('service_charge', '', 'str');
        $data['machine_type'] = FSInput::get('machine_type', '', 'str');
        $data['experience'] = FSInput::get('experience', '', 'str');
        $data['work_done'] = FSInput::get('work_done', '', 'str');
        $data['version'] = FSInput::get('version', 'guest', 'str');
        $data['created_time'] = date('Y-m-d H:i:s');
        $data['published'] = 1; 
        if ($user->checkExitsEmail($data['email'])) {
            $json['message'] = 'Email này đã có người sử dụng';
            goto json_encode;
        }
        $user_id = $user->insertUser($data);
        if ($user_id) {
            $user->updateUser(array('code' => 'M' . str_pad($user_id, 6, "0", STR_PAD_LEFT)), $user_id);
            $json['error'] = 0;
            $json['message'] = 'Bạn đã đăng ký thành công!';
        }

        json_encode:
        echo json_encode($json);
    }

    function update_member(){
        global $user;
        $json = array(
            'error' => 1,
            'message' => 'Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại kết nối!',
            'user' => array()
        );

        $id = FSInput::get('id', 0);
        $data = array();
        $data['first_name'] = FSInput::get('first_name', '', 'str');
        $data['last_name'] = FSInput::get('last_name', '', 'str');
        $data['gender'] = FSInput::get('gender', '', 'str');
        $data['birthday'] = FSInput::get('birthday', '', 'str');
        $data['city_id'] = FSInput::get('city_id', 0);
        $data['district_id'] = FSInput::get('district_id', 0);
        $data['address'] = FSInput::get('address', '', 'str');
        $data['service_charge'] = FSInput::get('service_charge', '', 'str');
        $data['machine_type'] = FSInput::get('machine_type', '', 'str');
        $data['experience'] = FSInput::get('experience', '', 'str');
        $data['work_done'] = FSInput::get('work_done', '', 'str');

        $user->updateUser($data, $id);
        if ($id) {
            $user->loadUser($id);
            $json['error'] = 0;
            $json['message'] = 'Bạn đã đăng ký thành công!';

            $json['user'] = array(
                'id' => $user->userInfo->id,
                'email' => $user->userInfo->email,
                'mobile' => $user->userInfo->mobile,
                'version' => $user->userInfo->version,
                'first_name' => $user->userInfo->first_name,
                'last_name' => $user->userInfo->last_name,
                'longitude' => $longitude,
                'latitude' => $latitude,
                'gender' => $user->userInfo->gender, 
                'birthday' => $user->userInfo->birthday, 
                'city_id' => $user->userInfo->city_id, 
                'district_id' => $user->userInfo->district_id, 
                'address' => $user->userInfo->address, 
                'service_charge' => $user->userInfo->service_charge, 
                'machine_type' => $user->userInfo->machine_type, 
                'experience' => $user->userInfo->experience, 
                'work_done' => $user->userInfo->work_done,
            );
        }

        json_encode:
        echo json_encode($json);
    }

    function do_login() {
        global $user;
        $json = array(
            'error' => 1,
            'user_id' => 0,
            'message' => 'Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại kết nối!'
        );

        $username = FSInput::get('username');
        $password = FSInput::get('password');
        $version = FSInput::get('version');
        $longitude = FSInput::get('longitude');
        $latitude = FSInput::get('latitude');
        $loged = $user->login($username, $password, $version);
        if ($loged) {
            $json['error'] = 0;
            $json['message'] = 'Bạn đã đăng nhập thành công.';
            $json['version'] = $user->userInfo->version;
            $json['user'] = array(
                'id' => $user->userInfo->id,
                'email' => $user->userInfo->email,
                'mobile' => $user->userInfo->mobile,
                'version' => $user->userInfo->version,
                'first_name' => $user->userInfo->first_name,
                'last_name' => $user->userInfo->last_name,
                'longitude' => $longitude,
                'latitude' => $latitude,
                'gender' => $user->userInfo->gender, 
                'birthday' => $user->userInfo->birthday, 
                'city_id' => $user->userInfo->city_id, 
                'district_id' => $user->userInfo->district_id, 
                'address' => $user->userInfo->address, 
                'service_charge' => $user->userInfo->service_charge, 
                'machine_type' => $user->userInfo->machine_type, 
                'experience' => $user->userInfo->experience, 
                'work_done' => $user->userInfo->work_done,
            );

            $user->updateUser(array(
                'longitude' => $longitude,
                'latitude' => $latitude
            ), $user->userInfo->id);
            
        } else {
            $json['message'] = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        }
        json_encode:
        echo json_encode($json);
    }

    function get_countries(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );

        $list = $this->model->get_countries();
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->name,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_cities(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );

        $list = $this->model->get_cities();
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->name,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_districts(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );
        $city_id = FSInput::get('city_id');
        $list = $this->model->get_districts($city_id);
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->name,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_wards(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );
        $district_id = FSInput::get('district_id');
        $list = $this->model->get_wards($district_id);
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->name,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_search_results(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );
        $list = $this->model->get_search_results();
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->first_name.' '.$item->last_name,
                    'mobile' => $item->mobile,
                    'avatar' => $item->avatar,
                    'distance' => '...',
                    'latitude' => $item->latitude,
                    'longitude' => $item->longitude,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function save_call_technical(){
        ob_start();
        $json = array(
            'error' => true
        );

        $id = $this->model->save_call_technical();

        //ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_called_list(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );
        $list = $this->model->get_called_list();
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->first_name.' '.$item->last_name,
                    'service_charge' => format_money($item->service_charge).' VNĐ',
                    'city_name' => $item->city_name,
                    'mobile' => $item->mobile,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }

    function get_works_measure(){
        ob_start();
        $json = array(
            'error' => true,
            'list' => array(),
        );
        $list = $this->model->get_works_measure();
        if($list){
            $json['error'] = false;
            
            foreach($list as $item){
                $json['list'][] = array(
                    'id' => $item->id,
                    'name' => $item->first_name.' '.$item->last_name,
                    'summary' => $item->summary,
                    'address' => $item->address,
                    'mobile' => $item->mobile,
                );
            }
        }

        ob_end_clean();
        json_encode:
        echo json_encode($json);
    }
}
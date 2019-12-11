import React, {Component} from 'react';

import {
	View,
	Text,
	KeyboardAvoidingView,
	Image,
	TouchableOpacity,
	Picker,
    TextInput,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

import mainStyle from '../../src/styles/mainStyle';

import DateTimePicker from "react-native-modal-datetime-picker";

import {submitRegister} from '../../src/api/apiMember';

export default class Register extends Component{

    constructor(props) {
        super(props);

        this.state = {
            re_password: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            mobile: '',
            address: '',
            gender: 'male',
            buttonText: 'Đăng Ký',
            date: new Date(),
            isDateTimePickerVisible: false,
            type: 'guest'
		}
    }

    componentDidMount() {
        
    }

    onSubmit(){
        var { type, mobile, password, re_password, email, first_name, last_name, birthday, gender, address } = this.state;

        if(mobile == ''){
            Alert.alert('Thông báo', 'Bạn vui lòng nhập số điện thoại.');
            return;
        }

        if(password == ''){
            Alert.alert('Thông báo', 'Bạn vui lòng nhập mật khẩu.');
            return;
        }

        if(re_password != password){
            Alert.alert('Thông báo', 'Nhập lại mật khẩu không đúng.');
            return;
        }

        if(first_name == ''){
            Alert.alert('Thông báo', 'Bạn vui lòng nhập họ.');
            return;
        }

        if(last_name == ''){
            Alert.alert('Thông báo', 'Bạn vui lòng nhập tên.');
            return;
        }

        if(address == ''){
            Alert.alert('Thông báo', 'Bạn vui lòng nhập địa chỉ.');
            return;
        }

        this.setState({ buttonText: 'Đang xử lý...'});

        submitRegister( type, mobile, password, email, first_name, last_name, birthday, gender, address )
        .then(responseJson => {
        
			if(responseJson.error == '0'){
                Alert.alert('Thông báo', responseJson.message,[
                  {text: 'OK', onPress: () => this.props.navigation.navigate('LoginScreen', {draft: responseJson.draft})},
                ]);
            }else {
                Alert.alert('Thông báo', responseJson.message);
                this.setState({ buttonText: 'Registration'});
            }
            
        }).catch(err => {
            Alert.alert('Thông báo!', error.message);

            this.setState({ buttonText: 'Registration'});
        });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
	};

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false });
	};

	handleDatePicked = date => {
        // returns the month (from 0 to 11)
        var month = date.getMonth() + 1
        // returns the day of the month (from 1 to 31)
        var day = date.getDate()
        // returns the year (four digits)
        var year = date.getFullYear()
        var birthday = day + "/" + month + "/" + year;
        this.setState({date, birthday});
		// this.setDatePicker(date);
		this.hideDateTimePicker();
	};


	render() {
		return (
            <KeyboardAvoidingView keyboardVerticalOffset='0' behavior="padding" enabled>
                <ScrollView>
                    <View style = {mainStyle.header}>
                        <Image source= {require('../../assets/backgroundImage2.png')} style ={{height:0.3* height,width:'100%',resizeMode:'cover'}}></Image>
                        <View style = {mainStyle.buttonBack}>
                            <TouchableOpacity
                                onPress={()=>this.props.navigation.goBack()}>
                                <Image source = {require('../../assets/iconBack.png')} style = {{width:25, width:25, resizeMode:'contain'}}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style = {mainStyle.containTextHeader}>
                            <Text style = {mainStyle.textHeader}>Tạo tài khoản khách hàng</Text>
                        </View>
                        <View>
                            <Image source = {require('../../assets/iconProfile12.png')} 
                            style = {{position:'absolute', height: 150* standarHeight/height, width:150* standarWidth/width,
                            resizeMode : 'contain',left: (width - 150* standarWidth/width) /2 ,bottom:-70* standarHeight/height }}></Image>
                        </View>
                    </View>
                    <View style = {mainStyle.body}>
                        <View style = {mainStyle.phone}>
                            <Text style = {mainStyle.titleInput}>Số điện thoại</Text>
                            <TextInput style = {mainStyle.input100Percents} placeholder="Nhập vào số điện thoại" keyboardType='phone-pad'
                                value={this.state.mobile}
                                returnKeyType="next"
                                onSubmitEditing={() =>this.regPassword.focus()}
                                onChangeText={(mobile) => this.setState({ mobile })}/>
                        </View>
                        <View style = {mainStyle.password}>
                            <Text style = {mainStyle.titleInput}>Mật Khẩu</Text>
                            <TextInput style = {mainStyle.input100Percents} secureTextEntry = {true} placeholder="Nhập vào mật khẩu"
                                value={this.state.password}
                                returnKeyType="next"
                                ref={(input) => { this.regPassword = input; }}
                                onSubmitEditing={() =>this.regRePassword.focus()}
                                onChangeText={(password) => this.setState({ password })}/>
                        </View>
                        <View style = {mainStyle.againPassword}>
                            <TextInput style = {mainStyle.input100Percents} secureTextEntry = {true} placeholder="Xác nhận mật khẩu"
                                value={this.state.re_password}
                                returnKeyType="next"
                                ref={(input) => { this.regRePassword = input; }}
                                onSubmitEditing={() =>this.regEmail.focus()}
                                onChangeText={(re_password) => this.setState({ re_password })}/>
                        </View>
                        <View style = {mainStyle.email}>
                            <Text style = {mainStyle.titleInput}>Email của bạn</Text>
                            <TextInput style = {mainStyle.input100Percents} placeholder="Nhập Email" keyboardType='email-address'
                                value={this.state.email}
                                returnKeyType="next"
                                ref={(input) => { this.regEmail = input; }}
                                onSubmitEditing={() =>this.regFirstName.focus()}
                                onChangeText={(email) => this.setState({ email })}/>
                        </View>
                        <View style = {mainStyle.leftAndRight}>
                            <View style = {mainStyle.left}>
                                <Text style = {mainStyle.titleInput}>Họ</Text>
                                <TextInput style = {mainStyle.input100Percents} placeholder="Họ"
                                    value={this.state.first_name}
                                    returnKeyType="next"
                                    ref={(input) => { this.regFirstName = input; }}
                                    onSubmitEditing={() =>this.regLastName.focus()}
                                    onChangeText={(first_name) => this.setState({ first_name })}/>
                            </View>
                            <View style = {mainStyle.right}>
                                <Text style = {mainStyle.titleInput}>Tên</Text>
                                <TextInput style = {mainStyle.input100Percents} placeholder="Tên"
                                    value={this.state.last_name}
                                    returnKeyType="next"
                                    ref={(input) => { this.regLastName = input; }}
                                    onSubmitEditing={() =>this.regAddress.focus()}
                                    onChangeText={(last_name) => this.setState({ last_name })}/>
                            </View>
                        </View>
                        <View style = {mainStyle.leftAndRight}>
                            <View style = {mainStyle.left}>
                                <Text style = {mainStyle.titleInput}>Sinh Ngày</Text>
                                <TextInput style = {mainStyle.input100Percents} placeholder="Sinh ngày"
                                    value={this.state.birthday}
                                    onFocus={() => this.showDateTimePicker()}/>
                            </View>
                            <View style = {mainStyle.right}>
                                <Text style = {mainStyle.titleInput}>Giới Tính</Text>
                                <Picker
                                    selectedValue={this.state.gender}
                                    style={mainStyle.input100Percents}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({gender: itemValue})
                                    }>
                                    <Picker.Item label="Nam" value="male" />
                                    <Picker.Item label="Nữ" value="female" />
                                </Picker>
                            </View>
                        </View>
                        <View style = {mainStyle.leftAndRight}>
                            <View style = {mainStyle.left}>
                                <Text style = {mainStyle.titleInput}>Tỉnh/Thành phố</Text>
                                <View>
                                    <TextInput style = {mainStyle.input100Percents} placeholder="Tỉnh/Thành phố"></TextInput>
                                </View>
                            </View>
                            <View style = {mainStyle.right}>
                                <Text style = {mainStyle.titleInput}>Quận/Huyện</Text>
                                <TextInput style = {mainStyle.input100Percents} placeholder="Quận Huyện"/>
                            </View>
                        </View>
                        <View style = {mainStyle.address}>
                            <Text style = {mainStyle.titleInput}>Địa Chỉ</Text>
                            <TextInput style = {mainStyle.input100Percents} placeholder="Nhập vào địa chỉ"
                                value={this.state.address}
                                returnKeyType="done"
                                ref={(input) => { this.regAddress = input; }}
                                onSubmitEditing={() =>this.onSubmit()}
                                onChangeText={(address) => this.setState({ address })}/>
                        </View>
                        <View style = {mainStyle.leftAndRight}>
                            <View style = {mainStyle.left}>
                                <Text style = {mainStyle.titleInput}>Phí Dịch Vụ</Text>
                                <View>
                                    <TextInput style = {mainStyle.input100Percents} placeholder="Phí Dịch Vụ">
                                    </TextInput>
                                </View>
                            </View>
                            <View style = {mainStyle.right}>
                                <Text></Text>
                                <TextInput style = {mainStyle.input100Percents} placeholder="Loại Máy Sử Dụng"/>
                            </View>
                        </View>
                        <View style = {mainStyle.leftAndRight}>
                            <View style = {mainStyle.left}>
                                <Text style = {mainStyle.titleInput}>Bằng cấp, chứng chỉ</Text>
                                <Text style = {{color:'red'}}>Thiếu chỗ thêm hình ảnh</Text>
                            </View>
                            <View style = {mainStyle.right}>
                                <Text style = {mainStyle.titleInput}>Giấy chứng nhận</Text>
                                <Text style = {{color:'red'}}>Thiếu chỗ thêm hình ảnh</Text>
                            </View>
                        </View>
                        <View style = {mainStyle.address}>
                            <Text style = {mainStyle.titleInput}>Kinh nghiệm</Text>
                            <TextInput style = {mainStyle.input100Percents} placeholder="Kinh nghiệm"/>
                        </View>
                        <View style = {mainStyle.address}>
                            <Text style = {mainStyle.titleInput}>Công việc đã làm</Text>
                            <TextInput style = {mainStyle.input100Percents} placeholder="Công việc đã làm"/>
                        </View>
                    </View>
                    <View style = {mainStyle.footer}>
                        <TouchableOpacity style = {mainStyle.buttonDangKy} 
                            onPress={() =>this.onSubmit()}>
                            <Text style ={mainStyle.textButtonDangKy}>{this.state.buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        cancelTextIOS={'Đóng'}
                        confirmTextIOS={'Xác nhận'}
                        date = {this.state.date}
                        />
                </ScrollView>
            </KeyboardAvoidingView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const standarWidth = 360;
const standarHeight = 592;
const boxWidth =  300/standarWidth * width;
const boxHeight = 450/standarHeight * height;
const text10 = 10/standarWidth * width;
const text11 = 11/standarWidth * width;
const text12 = 12/standarWidth * width;
const text13 = 13/standarWidth * width;
const text14 = 14/standarWidth * width;
const text15 = 15/standarWidth * width;
const text16 = 16/standarWidth * width;
const text17 = 17/standarWidth * width;
const buttonTextFontSize = 14/standarWidth * width;
const titleFontSize = 20/standarWidth * width;
const buttonWidth = 150/standarWidth * width;
const buttonHeight = 10/standarHeight * height;
const lineHeight = 25/standarHeight * height;
const marginBottom = 10/standarHeight * height;
const padding = 10/standarWidth * width;
const margin = 20/standarWidth * width;
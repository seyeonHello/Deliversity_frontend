import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {requestChangeUser} from '../store/actions/action';
import {connect} from 'react-redux';
import axios from '../axiosConfig';
//배달원 혹은 사용자로 탭 전환하는 버튼
class ChangeButton extends Component {
  constructor(props) {
    super(props);
  }

  onClickChange = async () => {
    await axios
      .get('/api/v1/myinfo/')
      .then((res) => {
        console.log(res.data.data.grade);
        if (this.props.user === '사용자') {
          if (res.data.data.grade !== 2) {
            alert('등업 신청을 하세요!');
          } else {
            this.props.requestChangeUser('배달원');
          }
        } else {
          this.props.requestChangeUser('사용자');
        }
      })
      .catch((e) => {
        alert(e.response.data.message);
      });
    // console.log(this.props.user);
  };
  render() {
    return (
      <View style={styles.profile}>
        <TouchableOpacity
          testID="MyButton"
          onPress={() => {
            this.onClickChange();
            this.props.onPress();
          }}>
          <Icon name="bubble-chart" color="#f4da6c" size={35} />
          <Text style={styles.text_header} testID="MyText">
            {this.props.user}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text_header: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
const mapStateToProps = (state) => ({
  user: state.authentication.user,
});
const mapDispatchToProps = (dispatch) => ({
  requestChangeUser: (data) => dispatch(requestChangeUser(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChangeButton);

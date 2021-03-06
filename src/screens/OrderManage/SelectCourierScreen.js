import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from '../../axiosConfig';
import {Button, List, Text} from 'native-base';
import DeliveryManList from '../../components/DeliveryManList';
import SQLite from 'react-native-sqlite-storage';
let db;
//신청온 배달원 리스트 확인후 선택하는 페이지
class SelectCourierScreen extends Component {
  static navigationOptions = {
    title: 'DeliveryMan',
  };
  constructor(props) {
    super(props);
    this.state = {
      orderID: this.props.route.params ? this.props.route.params.orderID : '',
      orderInfo: '',
      isReservation: false,
      reservationTime: '',
      deliveryList: '',
      orderStatus: false,
    };
    this.getDeliveryList();
    this.getOrderInfo();
    db = SQLite.openDatabase({
      name: 'sqlite.db',
      createFromLocation: 1,
    });
  }
  getDeliveryList = async () => {
    await axios
      .get(`/api/v1/order/riders?orderId=${this.state.orderID}`)
      .then((res) => {
        this.setState({
          deliveryList: res.data.data,
        });
      })
      .catch((e) => {
        alert(e.response.data.message);
        this.props.navigation.goBack(null);
      });
  };
  getOrderInfo = async () => {
    //console.log(this.state.orderID);
    await axios
      .get(`/api/v1/order?orderId=${this.state.orderID}`)
      .then((res) => {
        let arr = res.data.data.expArrivalTime.split(' ')[1];
        let hour = arr.split(':')[0];
        let min = arr.split(':')[1];
        let time = hour + ':' + min;
        this.setState({
          orderInfo: res.data.data,
          reservationTime: time,
          isReservation: res.data.data.reservation,
        });
        if (res.data.data.orderStatus === '0') {
          this.setState({
            orderStatus: true,
          });
        }
      });
  };
  handleItemOnPressReview = (articleData) => {
    this.props.navigation.navigate('CourierReview', {
      riderID: articleData.riderId,
      orderID: this.state.orderID,
    });
  };
  onClickConfirmCancle = () => {
    const data = {
      orderId: this.state.orderInfo.id,
    };
    axios({
      url: '/api/v1/order',
      data: data,
      method: 'delete',
    })
      .then((res) => {
        alert('주문이 취소 되었습니다.');
        this.props.navigation.goBack();
      })
      .catch((e) => {
        alert(e.response.data.message);
      });
  };
  onClickOrderCancle = () => {
    Alert.alert(
      '⚠',
      '주문을 취소하시겠습니까?',
      [
        {
          text: '취소',
        },
        {
          text: '주문취소',
          onPress: () => this.onClickConfirmCancle(),
        },
      ],
      {cancelable: false},
    );
  };
  insertRoomDB = (room, sender, receiver, orderId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO consumerRoom (room_id, owner_id, guest_id, order_id) VALUES (?,?,?,?)',
        [room, sender, receiver, orderId],
        (tx, results) => {
          console.log(results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('이제 배달원과 채팅 할 수 있습니다.');
          }
        },
      );
    });
  };
  handleItemOnPressSelect = async (articleData) => {
    const data = {
      riderId: articleData.riderId,
    };
    await axios
      .post(`/api/v1/order/rider?orderId=${this.state.orderID}`, data)
      .then((res) => {
        alert('매칭 신청이 완료 되었습니다.');
        let roomInfo = res.data.data.room;
        this.insertRoomDB(
          roomInfo.roomId,
          roomInfo.ownerId,
          roomInfo.riderId,
          roomInfo.orderId,
        );
        this.props.navigation.goBack(null);
      })
      .catch((e) => {
        alert(e.response.data.message);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.reviewBox}>
          {this.state.orderStatus === true ? (
            <View
              style={{
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.onClickOrderCancle();
                }}>
                <View style={styles.cancleBox}>
                  <Text style={styles.cancleItem}>주문취소</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold', fontSize: 19}}>
              {this.state.orderInfo.storeName}
            </Text>
            {this.state.isReservation === true ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  alignSelf: 'flex-end',
                }}>
                <Text style={styles.bookingStyle}>
                  예약 {this.state.reservationTime}까지
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={{marginBottom: 10}}>{this.state.orderInfo.content}</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: '#A9A9A9'}}>
            배달 받을 곳
          </Text>
          <Text style={{fontSize: 14}}>
            - {this.state.orderInfo.address}{' '}
            {this.state.orderInfo.detailAddress}
          </Text>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#A9A9A9'}}>
            거리 배달비
          </Text>
          <Text style={{fontSize: 15}}>
            - {this.state.orderInfo.deliveryFee}원
          </Text>
        </View>
        <View style={styles.listBox}>
          <Text style={styles.imageTitle}>신청한 배달원 리스트</Text>
          {this.state.deliveryList === null ? (
            <Text style={{paddingHorizontal: 20}}>
              배달을 희망하는 배달원이 없습니다.
            </Text>
          ) : (
            <List
              keyExtractor={(item, index) => index.toString()}
              dataArray={this.state.deliveryList}
              renderRow={(item) => {
                return (
                  <DeliveryManList
                    onPressSelect={this.handleItemOnPressSelect}
                    onPressReview={this.handleItemOnPressReview}
                    data={item}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#fffaf0',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 5,
    backgroundColor: 'white',
    flex: 3,
  },
  listBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#fffaf0',
    flexDirection: 'column',
    marginBottom: 5,
    marginTop: 2,
    backgroundColor: 'white',
    flex: 7,
  },
  cancleItem: {
    fontSize: 15,
    color: '#fff',
    paddingHorizontal: 5,
  },
  imageTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bookingStyle: {
    fontSize: 15,
    color: '#ff7f50',
    paddingHorizontal: 5,
  },
  reservationBox: {
    borderWidth: 2,
    borderColor: '#ff7f50',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cancleBox: {
    backgroundColor: '#ff7f50',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default SelectCourierScreen;

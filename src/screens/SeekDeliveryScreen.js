import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import ChangeButton from '../components/ChangeButton';
import axios from '../axiosConfig';
import OrderItem from '../components/OrderItem';
import HotOrderItem from '../components/HotOrderItem';
import {List} from 'native-base';
class SeekDeliveryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HotOrderList: '',
      DefaultOrderList: '',
      isHotDeal: true,
    };
    this.onClickGetHotDeal();
    this.onClickGetDefault();
  }
  handleItemDataonSelect = (articleData) => {
    this.props.navigation.navigate('DetailDelivery', {
      orderID: articleData.id,
    });
  };
  onClickGetHotDeal = async () => {
    await axios
      .get('/api/v1/order/deliverList')
      .then((res) => {
        const orderList = res.data.data;
        const HotDealList = orderList.filter(function (ele) {
          return ele.hotDeal === true;
        });
        this.setState({HotOrderList: HotDealList});
      })
      .catch((e) => {});
  };
  onClickGetDefault = async () => {
    await axios
      .get('/api/v1/order/deliverList')
      .then((res) => {
        console.log(res.data.data);
        const orderList = res.data.data;
        const DefaultOrderList = orderList.filter(function (ele) {
          return ele.hotDeal === false;
        });
        this.setState({DefaultOrderList: DefaultOrderList});
      })
      .catch((e) => {
        alert(e.response.data.message);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.submitBtn}>
          <ChangeButton />
        </View>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={{width: 150, height: 150}}
          />
          <Text style={styles.text_header}>Deliversity</Text>
        </View>
        <View style={styles.footer}>
          {this.state.isHotDeal === true ? (
            <List
              dataArray={this.state.HotOrderList}
              keyExtractor={(item, index) => index.toString()}
              renderRow={(item) => {
                return (
                  <HotOrderItem
                    onSelect={this.handleItemDataonSelect}
                    data={item}
                  />
                );
              }}
            />
          ) : (
            <List
              dataArray={this.state.DefaultOrderList}
              keyExtractor={(item, index) => index.toString()}
              renderRow={(item) => {
                return (
                  <OrderItem
                    onSelect={this.handleItemDataonSelect}
                    data={item}
                  />
                );
              }}
            />
          )}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => this.setState({isHotDeal: true})}>
              {this.state.isHotDeal === true ? (
                <Text style={styles.panelActivateButtonTitle}>핫딜</Text>
              ) : (
                <Text style={styles.panelButtonTitle}>핫딜</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({isHotDeal: false})}>
              {this.state.isHotDeal === false ? (
                <Text style={styles.panelActivateButtonTitle}>기본</Text>
              ) : (
                <Text style={styles.panelButtonTitle}>기본</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9967a',
  },
  submitBtn: {
    alignSelf: 'flex-end',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 35,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ff7f50',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 5,
    paddingVertical: 5,
  },
  panelActivateButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ff7f50',
    borderWidth: 1,
    borderColor: '#f4da6c',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 5,
    paddingVertical: 5,
  },
  filterButtonTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    borderWidth: 2,
    borderColor: 'gray',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default SeekDeliveryScreen;

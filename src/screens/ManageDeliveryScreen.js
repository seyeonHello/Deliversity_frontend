import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {List, Text} from 'native-base';
import Card from '../components/manageDeliveryCard';
import axios from '../axiosConfig';
class ManageDeliveryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      deliveryList: '',
      orderId: '',
      refreshing: false,
    };
  }
  componentDidMount() {
    this.onClickGetDelivery();
  }
  onClickGetDelivery = async () => {
    await this.setState({refreshing: true});
    await axios
      .get('/api/v1/order/deliverList')
      .then((res) => {
        const deliveryList = res.data.data;
        this.setState({deliveryList: deliveryList, refreshing: false});
      })
      .catch((e) => {
        alert(e);
      });
  };

  handleRefresh = async () => {
    await this.onClickGetDelivery();
  };
  renderItem = ({item}) => {
    return (
      <Card
        itemData={item}
        onPress={() =>
          this.setState({
            orderId: item.id,
          })
        }
      />
    );
  };
  render() {
    let view = this.state.isLoading ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator animating={this.state.isLoading} color="#00f0ff" />
        <Text style={{marginTop: 10}} children="Please Wait.." />
      </View>
    ) : (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        extraData={this.state}
        data={this.state.deliveryList}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
      />
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text_header}>나의 배달 리스트</Text>
        </View>
        <View style={styles.footer}>{view}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9967a',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  footer: {
    flex: 8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
  },
});

export default ManageDeliveryScreen;

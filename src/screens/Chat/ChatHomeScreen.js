import React, {Component} from 'react';
import {View, StyleSheet, FlatList, RefreshControl, Alert} from 'react-native';
import {Text} from 'native-base';
import SQLite from 'react-native-sqlite-storage';
import {connect} from 'react-redux';
import Card from '../../components/chatCard';
let db;
class ChatHomeScreen extends Component {
  constructor(props) {
    super(props);
    db = SQLite.openDatabase({
      name: 'sqlite.db',
      createFromLocation: 1,
    });
    this.state = {
      refreshing: false,
      data: [],
      userId: '',
      password: '',
      backColor: '',
    };
  }
  componentDidMount(): void {
    this.getRoomInfo();
  }
  getRiderRoomInfo() {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM riderRoom', [], (tx, results) => {
        let length = results.rows.length;
        console.log('len' + length);
        if (length > 0) {
          let helpArray = [];
          console.log('success');
          //console.log(results.rows);
          for (let i = 0; i < results.rows.length; i++) {
            helpArray.push(results.rows.item(i));
          }
          this.setState({data: helpArray});
        }
      });
    });
  }
  getConsumerRoomInfo() {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM consumerRoom', [], (tx, results) => {
        let length = results.rows.length;
        console.log('len' + length);
        if (length > 0) {
          let helpArray = [];
          console.log('success');
          //console.log(results.rows);
          for (let i = 0; i < results.rows.length; i++) {
            helpArray.push(results.rows.item(i));
          }
          this.setState({data: helpArray});
        }
      });
    });
  }
  deleteMessageDB(room_id) {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM message where room_id=?',
        [room_id],
        (tx, results) => {
          let length = results.rows.length;
          console.log('len' + length);
          console.log(results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('메시지가 삭제 되었습니다.');
          }
        },
      );
    });
  }
  deleteChatRoom(room_id) {
    let helpArray = [];
    this.state.data.forEach(function (n) {
      if (n.room_id !== room_id) {
        helpArray.push(n);
      }
    });
    this.setState({data: helpArray});
    if (this.props.user === '배달원') {
      this.deleteRiderChatRoom(room_id);
    }
    if (this.props.user === '사용자') {
      this.deleteConsumerChatRoom(room_id);
    }
    this.getRoomInfo();
    this.deleteMessageDB(room_id);
  }
  deleteConfirmChatRoom(room_id) {
    Alert.alert(
      '채팅나가기',
      '채팅을 나가시겠습니까?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          onPress: () => this.deleteChatRoom(room_id),
        },
      ],
      {cancelable: false},
    );
  }
  deleteConsumerChatRoom(room_id) {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM consumerRoom where room_id=?',
        [room_id],
        (tx, results) => {
          let length = results.rows.length;
          console.log('len' + length);
          console.log(results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('채팅방이 나가졌습니다.');
          }
        },
      );
    });
  }
  deleteRiderChatRoom(room_id) {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM riderRoom where room_id=?',
        [room_id],
        (tx, results) => {
          let length = results.rows.length;
          console.log('len' + length);
          console.log(results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('채팅방이 나가졌습니다.');
          }
        },
      );
    });
  }
  getRoomInfo() {
    this.setState({refreshing: true});
    if (this.props.user === '배달원') {
      this.getRiderRoomInfo();
    }
    if (this.props.user === '사용자') {
      this.getConsumerRoomInfo();
    }
    this.setState({refreshing: false});
  }
  handleRefresh = async () => {
    await this.getRoomInfo();
  };
  renderItem = ({item}) => {
    return (
      <Card
        itemData={item}
        onPress={() =>
          this.props.navigation.navigate('Chat', {
            room_id: item.room_id,
            owner_id: item.owner_id,
            guest_id: item.guest_id,
            order_id: item.order_id,
          })
        }
        onPressDelete={() => {
          this.deleteConfirmChatRoom(item.room_id);
        }}
      />
    );
  };
  render() {
    let view = (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        extraData={this.state}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text_header}>채팅</Text>
        </View>
        <View style={styles.footer}>{view}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4da6c',
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
const mapStateToProps = (state) => ({
  user: state.authentication.user,
});
export default connect(mapStateToProps, {})(ChatHomeScreen);

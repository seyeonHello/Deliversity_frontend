import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import ChangeButton from '../components/ChangeButton';
class SeekDeliveryScreen extends Component {
  constructor(props) {
    super(props);
  }
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
          <Text>배달건찾기</Text>
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
    paddingBottom: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  footer: {
    flex: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});

export default SeekDeliveryScreen;
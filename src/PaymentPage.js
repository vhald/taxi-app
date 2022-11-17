import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const Cart = () => {
  [state, setState] = useState({orderId: ''});

  return (
    <View style={{marginTop: 20}}>
      <Text style={{color: 'black', fontSize: 30}}>
        Pay your fare with Razorpay
      </Text>
      <Button
        title={'Pay Now with Razorpay'}
        onPress={() => {
          console.log('button pressed');
          var options = {
            description: 'Credits towards consultation',
            image: 'https://pngimg.com/uploads/uber/uber_PNG24.png',
            currency: 'INR',
            key: 'rzp_test_MuRhmhpUJsLPet', // Your api key
            amount: '5000', // in paise
            name: 'TaxiApp',
            prefill: {
              email: 'void@razorpay.com',
              contact: '9460526019',
              name: 'Razorpay Software',
            },
            theme: {color: '#F37254'},
          };
          RazorpayCheckout.open(options)
            .then(data => {
              // handle success
              alert(`Success: ${data.razorpay_payment_id}`);
            })
            .catch(error => {
              // handle failure
              alert(`Error: ${error.code} | ${error.description}`);
            });
        }}
        style={{fontSize: 30}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgb(249,194,1)',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  button_text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  button_text_small: {
    fontFamily: 'Poppins-Light',
    color: 'white',
    fontSize: 16,
  },
});

export default Cart;

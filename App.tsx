import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, SafeAreaView, Button } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native'
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack'


// MARK : NAVIGATION

type RootStackParamList = {
  Detail: { itemId: number, itemTitle: string };
  List: {}
};

const RootStack = createStackNavigator<RootStackParamList>();

type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Detail'
>;

type ListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'List'
>;

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type ListScreenRouteProp = RouteProp<RootStackParamList, "List">;

type DetailProps = {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
};

type ListProps = {
  navigation: ListScreenNavigationProp;
  route: ListScreenRouteProp;
};

// MARK : INTERFACES

interface ListItem {
  id: number,
  title: string,
  imageUrl: string,
  price: number,
  discount: boolean
}

interface DetailScreenItem {
  id: number,
  title: string,
  description: string,
  category: string,
  imageUrl: string,
  price: number,
  discount: boolean
}


// MARK: SCREENS

const ListScreen = ({navigation}: ListProps) => {

  const fetchList: () => ListItem[] = () => {
    let dataResults: ListItem[] = [];
    fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((item: any) => {
        let isDiscount: boolean = false

        if (item.price > 50) {
          isDiscount = true
          item.price = Math.round(item.price * 0.8)
        } else { isDiscount = false}

        let result: ListItem = { 
          id: item.id, 
          title: item.title, 
          imageUrl: item.image,
          price: item.price,
          discount: isDiscount };

        dataResults.push(result);
      });
      setList(dataResults)
    });
    return list
  }

  const [list, setList] = useState<ListItem[]>(() => fetchList());

  return(
    <FlatList
    data={list}
    renderItem={({ item }) =>
    <TouchableOpacity  onPress={() => {
      navigation.navigate('Detail', {itemId: item.id, itemTitle: item.title})}}>    
      <View style={styles.listContainer}>
        <Image source={{uri: item.imageUrl}} style={{width:100, height:100}}/>
        <View style={styles.textContainer}>
          <Text style={{fontSize: 18, marginBottom: 12, fontWeight: "bold"}}>{item.title}</Text>
          <Text style={{fontSize: 18, color: item.discount? "green" : "black"}}>{"$" + item.price}</Text>
        </View>
      </View>
  </TouchableOpacity>
  }
  keyExtractor={(item) => item.title.toString()}/>
  )
}


const DetailScreen = ({route}: DetailProps) => {

  const fetchDetails: () => DetailScreenItem | null = () => {

    fetch(`https://fakestoreapi.com/products/${route.params.itemId}`)
    .then((response) => response.json())
    .then((json) => {

        let isDiscount: boolean = false

        if (json.price > 50) {
          isDiscount = true
          json.price = Math.round(json.price * 0.8)
        } else { isDiscount = false}

        let result: DetailScreenItem = { 
          id: json.id,
          title: json.title,
          description: json.description,
          category: json.category,
          imageUrl: json.image,
          price: json.price,
          discount: isDiscount };

          setDetail(result)

      });
    return detail
  }

  const [detail, setDetail] = useState<DetailScreenItem | null>(() => fetchDetails());

  return(
    <SafeAreaView style={{...styles.container, padding:12}}>
      <Image source={{uri: detail?.imageUrl}} style={{width: "60%", height: 300, marginTop:50}}/>
      <View style={styles.textContainer}>
        <Text style={{fontSize: 18, fontWeight: "bold", marginBottom:12}}>{detail?.title}</Text>
        <Text style={{fontSize: 18, color: detail?.discount? "green" : "black", marginBottom:12 }}>$ {detail?.price}</Text>
        <Text style={{fontWeight: "bold"}}>Description:</Text>
        <Text style={{marginBottom:12}}>{detail?.description}</Text>
        <Text style={{fontSize: 12, color: "grey" , marginBottom:12}} >Category: {detail?.category}</Text>
      </View>
      <Button title="Add to cart" onPress={() => {console.log("Add to cart pressed")}} />
    </SafeAreaView>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={"List"}>
        <RootStack.Screen name="List" component={ListScreen} />
        <RootStack.Screen 
          name="Detail"
          component={DetailScreen} 
          initialParams={{ itemId: 0, itemTitle: "Detail" }}
          options={({ route }) => ({ title: route.params.itemTitle })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
    resizeMode:'contain',
  },

  textContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  }
});
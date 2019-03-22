import React from 'react';
import { StyleSheet, Text, View, Dimensions,  TouchableHighlight, Alert, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import { Container, Header, Title, Content, Toast, Footer, FooterTab, Button, Left, Right, Body, Icon, Fab, Picker, Item, Label, Input,  Card, CardItem } from 'native-base';
import { createSwitchNavigator, 
        createAppContainer, 
        NavigationActions, 
        StackActions, 
        BackHandler, 
        DrawerItems, 
        SafeAreaView, 
        DrawerNavigator,
        createDrawerNavigator,
        createStackNavigator,
        DrawerActions
      } from "react-navigation";
//import Expo from "expo";
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import OptionsMenu from "react-native-options-menu";
import { FAB } from 'react-native-paper';

import firebase from 'firebase';

/*********************** 
 * 
 * 
 * FIREBASE CONFIGURATION
 * 
*/
var firebaseConfig = {
  apiKey: "AIzaSyBzgpsJOrvt32YA3raJEIRZUr79uHx_3QY",
  authDomain: "expensemanager-cbe3e.firebaseapp.com",
  databaseURL: "https://expensemanager-cbe3e.firebaseio.com",
  projectId: "expensemanager-cbe3e",
  storageBucket: "expensemanager-cbe3e.appspot.com",
  messagingSenderId: "1049924764736"
};  

firebase.initializeApp(firebaseConfig);

const MoreIcon = require('./assets/more-icon.png')
const MenuIcon = require('./assets/menu.png')

var dbid='';
var email='';
var namePro=''


/***************************
 * 
 * 
 * LOAD SCREEN
 * Checks user logged in or not
 * 
 */

class LoadScreen extends React.Component {

  componentDidMount() {
    this.checkIfLoggedIn();
  }
  
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        console.log('AUTH STATE CHANGED CALLED ')
        if (user) {
          email=user.email;
          dbid= user.uid;

          console.log(dbid)
          firebase
          .database()
          .ref('/users/'+dbid+'/name')
          .once('value',(data)=>{console.log(data.toJSON())})
          .then(
            function(snapshot) {
              namePro = snapshot.val(); 
              console.log(namePro)
              })
          this.props.navigation.navigate('MainScreen');
        } else {
          this.props.navigation.navigate('LoginScreen');
        }
      }.bind(this)
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}


/***********************
 * 
 * 
 *LOGIN SCREEN
 *for users who havent logged in
 *Login with google functionality present
 */
class LoginScreen extends React.Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Sign in with credential from the Google user.
          email = googleUser.user.email;
          namePro = googleUser.user.givenName;
          firebase
          .auth()
          .createUserWithEmailAndPassword(googleUser.user.email, 'password')
          .then(
            function(result) {
              console.log("firebase user id: "+firebase.auth().currentUser.uid);
              dbid = firebase.auth().currentUser.uid;
              firebase
                  .database()
                  .ref('/users/' + dbid)
                  .set({
                    mail: googleUser.user.email,
                    name: googleUser.user.givenName,
                  })
                  .then(() => this.props.navigation.navigate('MainScreen'))
                  .catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorMessage);
                   });
              })
                .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if(errorCode==="auth/email-already-in-use"){
                  firebase
                  .auth()
                  .signInWithEmailAndPassword(googleUser.user.email, 'password')
                  .then(() => this.props.navigation.navigate('Main'))
                  .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                     })
                }
              });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };
  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: "126343702066-55p13g0cs0s2d5idf0a3863vkrsdfa62.apps.googleusercontent.com",
        behavior: 'web',
        iosClientId: '', //enter ios client id
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
          <View style={styles.container}>
            <View>
                <Text style={{color:'white'}}>t</Text>
                <Text style={{color:'white'}}>t</Text>
                <Text style={{color:'white'}}>t</Text>
            </View>
            <View>
                <View style={styles.normal}>
                <Text style={styles.regular}>E</Text> 
                <Text style={[styles.regular, styles.color]}>x</Text>
                <Text style={styles.regular}>pense</Text>
                </View>
                <Text style={styles.bold}>Manager</Text>
            </View>
    
            <TouchableHighlight onPress={() => this.signInWithGoogleAsync()}  underlayColor="white">
            <View style={styles.button} > 
                <Text style={styles.buttonText}>Login With Google</Text>
            </View>
            </TouchableHighlight >
    
        
            <View>
                <Text style={{color:'white'}}>t</Text>
                <Text style={{color:'white'}}>t</Text>
                <Text style={{color:'white'}}>t</Text>
            </View>
          </View>
    );
  }
}

var total=0;


/******************
 * 
 * Main Screen
 * Heart of the application
 * All the application information present in this one screen
 * 
 */
class MainScreen extends React.Component {
  componentDidMount(){
    // start listening for firebase updates
    this.listenForTasks(this.tasksRef);
  }
  listenForTasks(tasksRef) {
    console.log("Listened, now acting"+this.groupByValue)
    tasksRef.on('value', (dataSnapshot) => {
      total=0;
      var i=0;
      var tasks = [];
      var subtask = [];
      var previousSubtask=[];
      if(!this.groupByValue.localeCompare("all")||this.groupByValue==='')
      { 
        console.log('Showing all data')
        dataSnapshot.forEach((child) => { 
        child.forEach((key)=>{
          if(i===1){
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = monthNames[today.getMonth()]
            var yyyy = today.getFullYear();
            today = dd + ' ' + mm +', '+yyyy;
            var date = Number(JSON.stringify(key).replace(/\"/g, ""))
            var formattedDate = new Date(parseInt(date))
            var mmf = monthNames[formattedDate.getMonth()]
            var yyyyf = formattedDate.getFullYear()
            var ddf = formattedDate.getDate()

            formattedDate=ddf+" "+mmf+", "+yyyyf

            if(!today.localeCompare(formattedDate)){
              key="Today"
            }
            else{ key=formattedDate}
            
          }
          if(i==0){
            total+=Number(JSON.stringify(key).replace(/\"/g, ""))
          }
          subtask.push(key)
          i++;

        })
        tasks.push(subtask)
          subtask=[]
          i=0;
        });
      }

      if(!this.groupByValue.localeCompare("monthly"))
      { console.log('Showing monthly data')
        var snapshot=0;
        dataSnapshot.forEach((child) => {
          
        child.forEach((key)=>{
          if(i===1){
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var date = Number(JSON.stringify(key).replace(/\"/g, ""))
            var formattedDate = new Date(parseInt(date))
            var mmf = monthNames[formattedDate.getMonth()]
            var yyyyf = formattedDate.getFullYear()
            formattedDate=mmf+" "+yyyyf
            key=formattedDate
            
          }
          if(i===0){
            var convertKey = Number(JSON.stringify(key).replace(/\"/g, ""))
            total+= convertKey
            key=convertKey
          }
          if(i===2){
            var expenseName = JSON.stringify(key).replace(/\"/g, "")
            key = expenseName
          }
          subtask.push(key)
          i++;

        })
      
        if(snapshot===0)
        { tasks.push(subtask)
          previousSubtask = subtask
        }
        else{

          console.log('snapshot: '+ snapshot+', subtask: '+subtask+', previous sub task: '+previousSubtask[1])
          if(!subtask[1].localeCompare( previousSubtask[1]))
          { 
            console.log('entered into equal zone')
            console.log(previousSubtask[2])
            previousSubtask[2]+=", "+subtask[2]
            if(previousSubtask[2].length>34){
              previousSubtask[2]=previousSubtask[2].substring(0,30)+'...'
            }
            var amount = Number(previousSubtask[0])
            amount+=Number(subtask[0])
            previousSubtask[0]=amount
            tasks.splice(-1,1)
            tasks.push(previousSubtask)
          }
          else{
            tasks.push(subtask)
            previousSubtask = subtask
          }
        }
        snapshot++;
        subtask=[]
        i=0;
      });
      }

      if(!this.groupByValue.localeCompare("yearly"))
      { console.log('Showing yearly data')
        var snapshot=0;
        dataSnapshot.forEach((child) => {
          
        child.forEach((key)=>{
          if(i===1){
            var date = Number(JSON.stringify(key).replace(/\"/g, ""))
            var formattedDate = new Date(parseInt(date))
            var yyyyf = formattedDate.getFullYear()
            formattedDate=yyyyf
            key=formattedDate
            
          }
          if(i===0){
            var convertKey = Number(JSON.stringify(key).replace(/\"/g, ""))
            total+= convertKey
            key=convertKey
          }
          if(i===2){
            var expenseName = JSON.stringify(key).replace(/\"/g, "")
            key = expenseName
          }
          subtask.push(key)
          i++;

        })
      
        if(snapshot===0)
        { tasks.push(subtask)
          previousSubtask = subtask
        }
        else{

          console.log('snapshot: '+ snapshot+', subtask: '+subtask[1]+', previous sub task: '+previousSubtask[1])
          if(subtask[1] === previousSubtask[1])
          { 
            console.log('entered into equal zone')
            console.log(previousSubtask[2])
            previousSubtask[2]+=", "+subtask[2]
            if(previousSubtask[2].length>34){
              previousSubtask[2]=previousSubtask[2].substring(0,30)+'... '
            }
            var amount = Number(previousSubtask[0])
            amount+=Number(subtask[0])
            previousSubtask[0]=amount
            tasks.splice(-1,1)
            tasks.push(previousSubtask)
          }
          else{
            tasks.push(subtask)
            previousSubtask = subtask
          }
        }
        snapshot++;
        subtask=[]
        i=0;
      });
      }

      if(!this.groupByValue.localeCompare("quarterly"))
      { console.log('Showing quarterly data')
        var snapshot=0;
        dataSnapshot.forEach((child) => {
          
        child.forEach((key)=>{
          if(i===1){
            var date = Number(JSON.stringify(key).replace(/\"/g, ""))
            var formattedDate = new Date(parseInt(date))
            var mmf = formattedDate.getMonth()
            var quarter = parseInt(mmf/4)+1
            var yyyyf = formattedDate.getFullYear()
            formattedDate="Q"+quarter+", "+yyyyf
            key=formattedDate
            
          }
          if(i===0){
            var convertKey = Number(JSON.stringify(key).replace(/\"/g, ""))
            total+= convertKey
            key=convertKey
          }
          if(i===2){
            var expenseName = JSON.stringify(key).replace(/\"/g, "")
            key = expenseName
          }
          subtask.push(key)
          i++;

        })
      
        if(snapshot===0)
        { tasks.push(subtask)
          previousSubtask = subtask
        }
        else{

          console.log('snapshot: '+ snapshot+', subtask: '+subtask+', previous sub task: '+previousSubtask[1])
          if(!subtask[1].localeCompare( previousSubtask[1]))
          { 
            console.log('entered into equal zone')
            console.log(previousSubtask[2])
            previousSubtask[2]+=", "+subtask[2]
            if(previousSubtask[2].length>34){
              previousSubtask[2]=previousSubtask[2].substring(0,30)+'...'
            }
            var amount = Number(previousSubtask[0])
            amount+=Number(subtask[0])
            previousSubtask[0]=amount
            tasks.splice(-1,1)
            tasks.push(previousSubtask)
          }
          else{
            tasks.push(subtask)
            previousSubtask = subtask
          }
        }
        snapshot++;
        subtask=[]
        i=0;
      });
      }
      

      tasks.reverse()
      this.setState({
        tasks:tasks
      });
    });
    }


  static navigationOptions = {
    drawerIcon:(
      <Image source={require('./assets/dollar.png')}
              style={{height: 24, width:24}}/>
      ),
    title: 'Expense Manager'
  }
  constructor(props) {
    super(props);
    this.tasksRef = firebase.database().ref('/users/'+dbid+'/expenses').orderByChild('date').limitToLast(100);
    this.groupByValue = '';
    this.state = {
      active: 'true',
    };
  }
  logout=async()=>{
    try {
        await firebase.auth().signOut().then(function() {
          this.props.navigation.navigate('LoginScreen')
        }, function(error) {
          console.error('Sign Out Error', error);
        });;
        
    } catch (e) {
        console.log(e);
    }
  }

  goToProfile=()=>{
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  groupBy=(itemValue)=>{
    this.groupByValue=itemValue
    this.listenForTasks(this.tasksRef)
  }


  render() {
    return (
       <Container style={{paddingTop: 23, backgroundColor:'#2f3e9e'}}>
        <Header>
          <Left>
          <Button transparent>
            <TouchableHighlight onPress={()=>this.goToProfile()} underlayColor="white">
              <Icon name='menu' />
            </TouchableHighlight>
          </Button>
          </Left>
          <Body>
            <View flexDirection='row' style={{marginRight: 50}}>
            <Picker
              mode="dropdown"
              style={{color: 'white'}}
              color="white"
              selectedValue={this.state.listType}
              onValueChange={(itemValue, itemIndex) => {this.setState({listType: itemValue}); this.groupBy(itemValue)}}>

              <Picker.Item label="All" value="all" />
              <Picker.Item label="Monthly" value="monthly" />
              <Picker.Item label="Yearly" value="yearly" />
              <Picker.Item label="Quarterly" value="quarterly" />
              
            </Picker>
            </View>
          </Body>
          <Right>
            <View>
              <OptionsMenu
                button={MoreIcon}
                buttonStyle={{ width: 32, height: 20, margin: 7.5, resizeMode: "contain", tintColor:'white' }}
                destructiveIndex={1}
                options={["Logout"]}
                actions={[this.logout]}/>
            </View>
          </Right>
        </Header>
        <View style={{ flex: 1, backgroundColor:'white',}}>
          <View style={{paddingLeft:30, paddingRight:30, paddingTop:10, paddingBottom:10, flexDirection:'row', justifyContent: 'space-between' }} >

            <Text style={{ fontWeight: 'bold', fontSize: 15}}>
              Total Expenses
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
            ₹ {total}
            </Text>
          </View>
          <View style={{width:Dimensions.get('window').width, marginBottom:50}}>
            <Card dataArray={this.state.tasks}
              renderRow={(task) => this._renderItem(task)} 
              noShadow={true}>
            </Card>
          </View>
          <FAB
            style={styles.fab}
            icon="add"
            color='white'
            onPress={() => this.props.navigation.navigate('Add')}/>
        </View>
      </Container>
    );
  }

  _renderItem(task) {
  return (
    <ListItem task={task} />
  );
  }
}

/****
 * 
 * List Item
 * This class is for defining each expense entry present in main screen
 * 
 */
class ListItem extends React.Component {

  render() {
    return (
      <CardItem>
        <View>
          <View style={{marginLeft:10, marginRight:20, marginBottom:10, flexDirection:'row', justifyContent: 'space-between',flex:1 }} >
            <Text style={{ fontSize: 15}}>
              {JSON.stringify(this.props.task[2]).replace(/\"/g, "")} 
            </Text>
            <Text style={{ fontSize: 15}}>
              {JSON.stringify(this.props.task[1]).replace(/\"/g, "")} 
            </Text>
          </View >
          <Text style={{ fontSize: 15, color: '#2f3e9e',marginLeft:10 }}>
            ₹ {JSON.stringify(this.props.task[0]).replace(/\"/g, "")} 
          </Text>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              marginTop: 20,
              width:Dimensions.get('window').width-30
            }}
          />
        </View>         
      </CardItem>
    );
  }
}

/******
 * 
 * 
 * Profile Screen
 * To see profile information of user
 * With update functionality
 * 
 * 
 */

class ProfileScreen extends React.Component {
  total=0
  static navigationOptions = {
    drawerIcon:(
      <Image source={require('./assets/person.png')}
              style={{height: 24, width:24, tintColor:'#2f3e9e'}}/>
      )
  }

  logout=async()=>{
    try {
        await firebase.auth().signOut().then(function() {
          this.props.navigation.navigate('LoginScreen')
        }, function(error) {
          console.error('Sign Out Error', error);
        });;
        
    } catch (e) {
        console.log(e);
    }
  }


   constructor(props) {
   super(props);
   this.state = {
    value1:namePro,
    value2:email,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  goBack(){
    this.props.navigation.goBack()
  }

  handleUpdate= async()=> {
    name=this.state.value1;
    mail=this.state.value2;
    if(name!= namePro || mail===email)
    { namePro= name;
      var updates ={}
      updates['/name']=name;
      firebase
      .database().ref('/users/'+dbid).update(updates)
      .then( () => this.props.navigation.goBack());}
      total=0;
      if(mail!=email){
      Toast.show({text: 'Registered Gmail Id can\'t be changed because you might have trouble logging in again.' , buttonText: 'Okay'})
    }

    else{
      goBack();
    }
  }

  render() {

    return (
       <Container style={{paddingTop: 23, backgroundColor:'#2f3e9e'}}>
        <Header>
          <Left>
            <Button transparent>
            <TouchableHighlight onPress={()=>this.goBack()} underlayColor="white">
              <Icon name='arrow-back' />
            </TouchableHighlight>
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
             <View>
              <OptionsMenu
                button={MoreIcon}
                buttonStyle={{ width: 32, height: 20, margin: 7.5, resizeMode: "contain", tintColor:'white' }}
                destructiveIndex={1}
                options={["Logout"]}
                actions={[this.logout]}/>
            </View>
          </Right>
        </Header> 
        <Content style={{ backgroundColor: 'white',  }}
                  contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
          <View>
           <Item stackedLabel style={{ marginTop:50, width: Dimensions.get('window').width-30, }}>
              <Label>Name</Label>
              <Input maxLength={50}
                    defaultValue={this.state.value1}
                     value1={this.state.value1}
                      onChangeText={(value1) => this.setState({value1})}/>
            </Item>
            <View style={{marginBottom:30}}>
              <Text style={{textAlign:'right', color:'#9F9F9F'}}>
                {this.state.value1.length}/50
              </Text>
            </View>
              
            <Item stackedLabel  style={{ width: Dimensions.get('window').width-30, }}
              onPress={()=>  Alert.alert(
                            'Alert',
                            'Registered Gmail Address Cannot Be Changed',
                            [                           
                              {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                          )}>
              <Label>Email</Label>
              <Input maxLength={50}
                    defaultValue={this.state.value2}
                      value2={this.state.value2}
                      editable = {false}
                      onChangeText={(value2) => this.setState({value2})}/>
            </Item>
            <View style={{marginBottom:30}}>
              <Text style={{textAlign:'right', color:'#9F9F9F'}}>
                {this.state.value2  .length}/50
              </Text>
            </View>
            
          </View>  
            <TouchableHighlight onPress={() => this.handleUpdate()}  underlayColor="white">
            <View style={styles.buttonadd} > 
                <Text style={styles.buttonText}>Update</Text>
            </View>
            </TouchableHighlight >
        </Content>
      </Container>
    );
  }
}

var name = '';
var cost ='';

/******
 * 
 * Add screen
 * To add new entries in the expenses list
 * 
 * 
 */
class AddScreen extends React.Component {
 
  logout=async()=>{
    try {
        await firebase.auth().signOut().then(function() {
          this.props.navigation.navigate('LoginScreen')
        }, function(error) {
          console.error('Sign Out Error', error);
        });;
        
    } catch (e) {
        console.log(e);
    }
  }

  constructor(props) {
   super(props);
   this.state = {
    value1:'',
    value2:'',
    name:'',
    cost:'',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  goBack(){
    this.props.navigation.goBack()
  }

  handleSubmit= async()=> {
    name=this.state.value1;
    cost=this.state.value2;
    var date = new Date();
    var dd = date.getTime()
    firebase
    .database().ref('/users/'+dbid+'/expenses/').push({
        name: name, 
        cost: cost,
        date: dd,
    }).then( () => this.props.navigation.goBack());
  }


  render() {
    return (
       <Container style={{paddingTop: 23, backgroundColor:'#2f3e9e'}}>
        <Header>
          <Left>
            <Button transparent>
            <TouchableHighlight onPress={()=>this.goBack()} underlayColor="white">
              <Icon name='arrow-back' />
            </TouchableHighlight>
            </Button>
          </Left>
          <Body>
            <Title>Add Expenses</Title>
          </Body>
          <Right>
             <View>
              <OptionsMenu
                button={MoreIcon}
                buttonStyle={{ width: 32, height: 20, margin: 7.5, resizeMode: "contain", tintColor:'white' }}
                destructiveIndex={1}
                options={["Logout"]}
                actions={[this.logout]}/>
            </View>
          </Right>
        </Header> 
        <Content style={{ backgroundColor: 'white',  }}
                  contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
          <View>
           <Item floatingLabel style={{ marginTop:50, width: Dimensions.get('window').width-30, }}>
              <Label>Name of Expenses</Label>
              <Input maxLength={50}
                     value1={this.state.value1}
                      onChangeText={(value1) => this.setState({value1})}/>
            </Item>
            <View style={{marginBottom:30}}>
              <Text style={{textAlign:'right', color:'#9F9F9F'}}>
                {this.state.value1.length}/50
              </Text>
            </View>
              
            <Item floatingLabel  style={{ width: Dimensions.get('window').width-30, }}>
              <Label>Expenses Amount</Label>
              <Input maxLength={50}
                      value2={this.state.value2}
                      keyboardType = 'numeric'
                      onChangeText={(value2) => this.setState({value2})}/>
            </Item>
            <View style={{marginBottom:30}}>
              <Text style={{textAlign:'right', color:'#9F9F9F'}}>
                {this.state.value2.length}/50
              </Text>
            </View>
            
          </View>  
            <TouchableHighlight onPress={() => this.handleSubmit()}  underlayColor="white">
            <View style={styles.buttonadd} > 
                <Text style={styles.buttonText}>ADD</Text>
            </View>
            </TouchableHighlight >
        </Content>
      </Container>
    );
  }
}


/*****
 * CustomDrawerContentComponent
 * Used for designing the side drawer bar
 * 
 */

const CustomDrawerContentComponent = (props) =>(
  <Container>
    <Header style={{height: 200}}>
      <Body>
      <View style={{ flex: 1, justifyContent: 'space-between'}}>
        <View>
                <Text style={{color:'#2f3e9e', opacity: 0}}>t</Text>
        </View>

        <View>
          <Text style={styles.regularDrawer}>Expense</Text>
          <Text style={styles.boldDrawer}>Manager</Text>
          </View>
          <View>
          <Text style={{ justifyContent: 'flex-end', color:'white', marginBottom:20, fontWeight: 'bold'}}>
            {email}
          </Text>
        </View>
      </View>
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props}/>
    </Content>
  </Container>
)

/*****
 * 
 * Below are the navigators used to navigate through different screens in the app
 * We need different kinds of navigators like Drawer, Stack and Switch and they have their respective functions
 * 
 * 
 */


/*****
 * 
 * Drawer Navigator:
 * for navigating through side drawer
 */

const AppDrawerNavigator = createDrawerNavigator(
  {
  Main: MainScreen,
  Profile: ProfileScreen
},{
  initialRouteName: 'Main',
  drawerPosition: 'left',
  contentComponent: CustomDrawerContentComponent,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle'
}
)


/******
 * 
 * Stack Navigator:
 * Using this screen get stack on to another
 * 
 */
const AppStackNavigator = createStackNavigator({
  Main: AppDrawerNavigator,
  Add: AddScreen
},
{
   headerMode: 'none'
})

/****
 * 
 * Switch Navigator
 * We let our app initialise uaing this navigator
 * Lets us switch screens with no screen stacked
 * Pressing back closes the application
 * 
 */
const AppSwitchNavigator = createSwitchNavigator({
  LoadScreen: LoadScreen,
  LoginScreen: LoginScreen,
  MainScreen: AppStackNavigator,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

/***
 * 
 * The main rendering of the application
 * 
 */
export default class App extends React.Component {
   constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return <AppNavigator />;
  }
}

/****
 * StyleSheet
 * 
 */
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
      
    },
     MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
    bold:{
    fontWeight: 'bold',
    fontSize: 75
   },
   regular:{
    fontSize: 79
   },

   boldDrawer:{
    fontWeight: 'bold',
    fontSize: 39,
    color: '#7a84c1'
   },
   regularDrawer:{
    fontSize: 39,
    color: '#7a84c1'
   },


   normal:{
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
   },
  
   color:{
    color:'#2f3e9e'
   },
  
   button:{ 
    marginBottom: 30,
    width: Dimensions.get('window').width-30,
    alignItems: 'center',
  
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2f3e9e',
    
  
    borderRadius: 2,
      shadowColor: "#000000",
      shadowOpacity: 1,
      shadowRadius: 2,
      shadowOffset: {
        height: 2,
        width: 0
      },
       elevation: 3,
   },
   buttonText:{
    color: 'white',
    fontWeight: 'bold'
   },
   headerView:{
    marginLeft: 40,
   },
   headerText:{
    fontSize: 20,
    color: 'white',
   },

 
  fixedView: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      
    },

    fab: {
    position: 'absolute',
    margin: 24,
    right: 10,
    bottom: 10,
    backgroundColor:'#df005b'
  },
  buttonadd:{ 
    marginBottom: 30,
    width: Dimensions.get('window').width-30,
    alignItems: 'center',
  
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2f3e9e',
    
  
    borderRadius: 2,
      shadowColor: "#000000",
      shadowOpacity: 1,
      shadowRadius: 2,
      shadowOffset: {
        height: 2,
        width: 0
      },
       elevation: 3,
   }
  });
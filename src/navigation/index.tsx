import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from '@screens/Auth/ForgotPassword';
import Login from '@screens/Auth/Login';
import SignUp from '@screens/Auth/SignUp';
import Chatbot from '@screens/Chatbot';
import ChatbotInGroupScreen from '@screens/ChatbotInGroup/ChatbotInGroupScreen';
import Dictionary from '@screens/Dictionary';
import DictonaryDetail from '@screens/DictionaryDetail';
import DoExamScreen from '@screens/DoExam/DoExamScreen';
import ExamQuestion from '@screens/ExamQuestion';
import GroupDetailScreen from '@screens/GroupDetail/GroupDetailScreen';
import GroupListScreen from '@screens/GroupListScreen/GroupListScreen';
import HomeScreen from '@screens/HomeScreen';
import ListExam from '@screens/ListExam';
import ListResult from '@screens/ListResult';
import News from '@screens/News';
import NewsDetail1 from '@screens/NewsDetail1';
import Result from '@screens/Result';
import ResultDetail from '@screens/ResultDetail/ResultDetail';
import SplashScreen from '@screens/SplashScreen';
import UploadResult from '@screens/UploadResult';
import { TRootStackNav } from '@utils/types/RootStackNav';
import React from 'react';
const Stack = createNativeStackNavigator<TRootStackNav>();
export const navigationRef = createNavigationContainerRef<TRootStackNav>();
const AppNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: 'transparent',
          statusBarStyle: 'dark',
          statusBarTranslucent: true,
        }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='ListResult' component={ListResult} />
        <Stack.Screen name='ListExam' component={ListExam} />
        <Stack.Screen name='ExamQuestion' component={ExamQuestion} />
        <Stack.Screen name='UploadResult' component={UploadResult} />
        <Stack.Screen name='Result' component={Result} />
        <Stack.Screen name='ResultDetail' component={ResultDetail} />
        <Stack.Screen name='News' component={News} />
        <Stack.Screen name='NewsDetail1' component={NewsDetail1} />
        <Stack.Screen name='ChatBot' component={Chatbot} />
        <Stack.Screen name='Dictionary' component={Dictionary} />
        <Stack.Screen name='DictionaryDetail' component={DictonaryDetail} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='GroupList' component={GroupListScreen} />
        <Stack.Screen name='GroupDetail' component={GroupDetailScreen} />
        <Stack.Screen name='DoExam' component={DoExamScreen} />
        <Stack.Screen name='ChatbotInGroup' component={ChatbotInGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

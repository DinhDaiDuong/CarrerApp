import { AppHeader, AppTextInput } from '@components';
import AppImage from '@components/AppImage';
import { IChat, IResponse } from '@interfaces/DTO';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE } from '@store';
import { useMutation } from '@tanstack/react-query';
import { COLORS, FONT, s, vs } from '@utils';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  FlatList,
  ImageBackground,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackNav } from '@utils/types/RootStackNav';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<TRootStackNav, 'ChatbotInGroup'>;
const ChatbotInGroupScreen = ({ route }: Props) => {
  const groupId = route.params.groupId;
  const animatedValue = useSharedValue(0);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<IChat[]>([]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animatedValue.value, [0, 1], [0, 360])}deg` }],
  }));
  const getChat = useMutation({
    mutationKey: [KEY_STORE.CHAT_BOT],
    mutationFn: async (message: string) => {
      if (!message) return;
      return await api(ENDPOINTS_URL.CHAT_BOT.GET_CHAT_IN_GROUP, 'POST', {
        data: { prompt: message, groupdId: groupId },
      });
    },
    onSuccess: async (data: IResponse | any) => {
      InteractionManager.runAfterInteractions(() => {
        if (data?.code === 200) {
          setChats([
            ...chats,
            {
              isBot: true,
              message: data?.data,
            },
          ]);
        }
      });
    },
    onSettled: () => {
      console.log('settle');
    },
    onError: async (e) => {
      console.log('err', e);
    },
  });
  const renderChat = ({ item, index }: ListRenderItemInfo<IChat>) => {
    return (
      <View
        key={index}
        style={[
          {
            flexDirection: item.isBot ? 'row' : 'row-reverse',
          },
          styles.chatRowWrapper,
        ]}>
        <AppImage
          source={{
            uri: item.isBot
              ? 'https://t3.ftcdn.net/jpg/06/57/85/22/360_F_657852299_5py03y6oH4mrUDyZnf9XxFSFfrjcqAzP.jpg'
              : 'https://static.vecteezy.com/system/resources/previews/021/770/056/non_2x/avatar-of-a-student-character-free-vector.jpg',
          }}
          style={[styles.avatar, { borderRadius: s(100) }]}
          resizeMode='contain'
        />
        <View style={styles.chatCard}>
          <Text style={FONT.content.S}>{item.message}</Text>
        </View>
      </View>
    );
  };
  const onSubmit = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
    if (!message.trim()) return;
    const newMessage = {
      isBot: false,
      message,
    };
    if (chats?.length === 0) {
      setChats([newMessage]);
    }
    setChats([...chats, newMessage]);
    setMessage('');
    getChat.mutate(message.trim());
  };
  return (
    <ImageBackground source={require('@assets/images/background2.jpg')} resizeMode='cover' style={styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <SafeAreaView style={[styles.wrapper]}>
          <AppHeader style={{ marginHorizontal: -s(27), marginBottom: vs(16) }} title='Chat cùng giáo viên' />

          <View style={{ flex: 1 }}>
            <FlatList data={chats} renderItem={renderChat} contentContainerStyle={{ gap: vs(12) }} />
            <AppTextInput
              outStyle={[styles.chatInput, { marginBottom: Platform.OS === 'ios' ? 0 : vs(20) }]}
              containerStyle={{
                borderWidth: 0,
              }}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={onSubmit}
              placeholder='Nhập câu hỏi...'
              trailing={
                !getChat?.isPending ? (
                  <Ionicons name='send-outline' size={s(25)} color={COLORS.grey} onPress={onSubmit} />
                ) : (
                  <Animated.View style={animatedStyle}>
                    <AppImage source={require('@assets/images/bookmark.png')} style={styles.trailing} resizeMode='contain' />
                  </Animated.View>
                )
              }
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: vs(10),
    paddingHorizontal: s(27),
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatRowWrapper: {
    alignItems: 'flex-end',
    gap: s(10),
    flex: 1,
  },
  avatar: {
    width: s(30),
    height: s(30),
  },
  chatCard: {
    padding: s(10),
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    maxWidth: '80%',
  },
  chatInput: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    elevation: 4,
    //marginBottom: vs(20),
    marginTop: vs(10),
  },
  trailing: {
    width: s(20),
    height: s(20),
  },
});
export default ChatbotInGroupScreen;

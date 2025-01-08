import { AppTextInput } from '@components';
import AppImage from '@components/AppImage';
import { IChat, IResponse } from '@interfaces/DTO';
import { navigationRef } from '@navigation';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE, storage } from '@store';
import { useMutation } from '@tanstack/react-query';
import { COLORS, FONT, height, s, vs } from '@utils/config';
import React, { useEffect, useRef, useState } from 'react';
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
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Chatbot = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<FlatList>(null);
  const animatedValue = useSharedValue(0);
  const getChat = useMutation({
    mutationKey: [KEY_STORE.CHAT_BOT],
    mutationFn: async (message: string) => {
      if (!message) return;
      return await api(ENDPOINTS_URL.CHAT_BOT.GET_CHAT, 'POST', {
        data: { prompt: message },
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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animatedValue.value, [0, 1], [0, 360])}deg` }],
  }));
  useEffect(() => {
    const listCharts = storage.getString(KEY_STORE.LIST_CHAT);
    if (listCharts) {
      setChats(JSON.parse(listCharts));
    }
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chats?.length !== 0) {
        scrollRef?.current?.scrollToEnd();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [chats?.length]);
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
          source={item.isBot ? require('@assets/images/education.png') : require('@assets/images/avatar.jpeg')}
          style={[styles.avatar, { borderRadius: item.isBot ? 0 : s(100) }]}
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
  useEffect(() => {
    if (getChat.isPending) {
      animatedValue.value = withRepeat(withTiming(1, { duration: 1000 }), -1);
    } else {
      animatedValue.value = withTiming(0);
    }
  }, [getChat.isPending]);

  const onBack = () => {
    storage.set(KEY_STORE.LIST_CHAT, JSON.stringify(chats));
    navigationRef.goBack();
  };
  //console.log('platform', Platform);
  return (
    <ImageBackground source={require('@assets/images/background2.jpg')} resizeMode='cover' style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        //behavior="height"
        //keyboardVerticalOffset={10}
        style={styles.container}>
        <SafeAreaView style={[styles.container, styles.wrapper]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <AntDesign name='arrowleft' size={s(25)} color={COLORS.black} />
            </TouchableOpacity>
            {chats?.length !== 0 && (
              <TouchableOpacity
                onPress={() => {
                  if (chats?.length !== 0) {
                    setChats([]);
                  }
                }}
                disabled={getChat.isPending}>
                <EvilIcons name='trash' size={30} color={COLORS.black} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.container}>
            <FlatList
              data={chats}
              renderItem={renderChat}
              contentContainerStyle={{ gap: vs(10) }}
              showsVerticalScrollIndicator={false}
              ref={scrollRef}
              automaticallyAdjustKeyboardInsets
              keyboardDismissMode='interactive'
              ListEmptyComponent={
                <View style={styles.fallbackContainer}>
                  <AppImage source={require('@assets/images/education.png')} style={styles.fallback} />
                  <Text style={[FONT.content.M.medium, { color: COLORS.grey }]}>Chúc một ngày tốt lành!</Text>
                </View>
              }
            />
          </View>
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Chatbot;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: vs(10),
    paddingHorizontal: s(27),
  },
  chatInput: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    elevation: 4,
    //marginBottom: vs(20),
    marginTop: vs(10),
  },
  avatar: {
    width: s(30),
    height: s(30),
  },
  chatRowWrapper: {
    alignItems: 'flex-end',
    gap: s(10),
    flex: 1,
  },
  chatCard: {
    padding: s(10),
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    maxWidth: '80%',
  },
  trailing: {
    width: s(20),
    height: s(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: vs(20),
    height: height * 0.5,
  },
  fallback: {
    width: s(100),
    height: s(100),
    opacity: 0.7,
    alignSelf: 'center',
  },
});

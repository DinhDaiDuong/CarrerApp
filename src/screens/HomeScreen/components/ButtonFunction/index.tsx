import AppRoundedButton from '@components/AppRoundedButton';
import { navigationRef } from '@navigation';
import { useAuthStore } from '@store/auth.store';
import { COLORS, FONT, s, WIDTH, width } from '@utils/config';
import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type TButton = {
  icon?: string;
  title?: string;
  onPress?: () => void;
  color?: string;
};

const ButtonFunction = () => {
  const { isLogin } = useAuthStore();

  const buttons = useMemo<TButton[]>(
    () => [
      {
        icon: 'pencil',
        title: 'Kiểm tra',
        color: '#4CAF50',
        onPress: () => navigationRef.navigate('ListExam'),
      },
      {
        icon: 'history',
        title: 'Lịch sử',
        color: '#2196F3',
        onPress: () => navigationRef.navigate('ListResult'),
      },
      {
        icon: 'newspaper-o',
        title: 'Tin tức',
        color: '#FF9800',
        onPress: () => navigationRef.navigate('News'),
      },
      {
        icon: 'book',
        title: 'Từ điển',
        color: '#9C27B0',
        onPress: () => navigationRef.navigate('Dictionary'),
      },
      {
        icon: 'users',
        title: 'Nhóm',
        color: '#E91E63',
        onPress: () => {
          if (!isLogin) {
            navigationRef.navigate('Login');
          } else {
            navigationRef.navigate('GroupList');
          }
        },
      },
      {
        icon: 'envelope-o',
        title: 'Liên hệ',
        color: '#607D8B',
        onPress: () => Linking.openURL('mailto:daiduong35578@gmail.com'),
      },
    ],
    [isLogin],
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {buttons?.map((button: TButton, index: number) => (
          <View key={index} style={styles.buttonWrapper}>
            <AppRoundedButton
              onPress={button.onPress}
              style={[styles.button, { backgroundColor: button.color }]}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <FontAwesome name={button.icon as string} color={COLORS.white} size={s(24)} />
                </View>
                <Text style={styles.buttonText}>{button.title}</Text>
              </View>
            </AppRoundedButton>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingHorizontal: s(16),
    paddingVertical: s(10),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: s(12),
  },
  buttonWrapper: {
    width: (width - s(44)) / 2,
  },
  button: {
    width: '100%',
    height: s(100),
    borderRadius: s(16),
    padding: 0,
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: s(8),
  },
  buttonText: {
    // ...FONT.content.S.medium,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default ButtonFunction;
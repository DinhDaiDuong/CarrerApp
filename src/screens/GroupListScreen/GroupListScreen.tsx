import { AppCard, AppHeader, AppView } from '@components';
import AppEmpty from '@components/AppNoData/AppEmpty';
import { IListGroup, IListGroupResponse } from '@interfaces/DTO/Group/group';
import { navigationRef } from '@navigation';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE, storage } from '@store';
import { useAuthStore } from '@store/auth.store';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, FONT, QUERY_KEY, s, vs, width } from '@utils';
import { EROLE } from '@utils/enum/user.enum';
import React from 'react';
import { ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';

const GROUPS = [
  {
    groupName: 'Group 1',
    ownerName: 'Tina',
    owner: {
      _id: '1133',
      name: 'OKKK',
    },
  },
  {
    groupName: 'Group 2',
    ownerName: 'Tina',
    owner: {
      _id: '1133',
      name: 'OKKK',
    },
  },
];

const GroupListScreen = () => {
  const authStore = useAuthStore();
  const { userInfo } = useAuthStore();

  // API
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      api(ENDPOINTS_URL.AUTH.LOGOUT, 'POST', {
        data: {
          key: '25012003',
          deviceId: await DeviceInfo.getUniqueId(),
        },
      }),
    onSuccess: (value: { data: string | null }) => {
      storage.set(KEY_STORE.ANNONYMOUS_TOKEN, value.data || '');
      Toast.show({
        type: 'success',
        text1: 'Thông báo',
        text2: 'Đăng xuất thành công!',
      });
      authStore.resetAuthStore();
      navigationRef.navigate('HomeScreen');
    },
  });
  const { data: groups } = useQuery<unknown, DefaultError, IListGroupResponse>({
    queryKey: [QUERY_KEY.GROUP],
    queryFn: () =>
      api(ENDPOINTS_URL.GROUP.GET_LIST_GROUP_BY_USER_ID, 'GET', {
        params: {
          userId: userInfo?.id,
        },
      }),
  });

  // METHODS
  const handleLogout = async () => {
    mutate();
  };

  const renderGroupItem = ({ item, index }: ListRenderItemInfo<IListGroup>) => {
    return (
      <View key={index}>
        <AppCard
          containerStyle={[styles.card, { alignSelf: 'center' }]}
          type='large'
          imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMAkWsip8bmdBWfZ8qBfO1Nccf-Se0JUpoq6GhO09oKq5ctxB0FwyvBwwfFmQpMvEZkzI&usqp=CAU'
          subTitle={item.owner.name}
          title={item.groupName}
          onPress={() => navigationRef?.navigate('GroupDetail', { id: item._id })}
        />
      </View>
    );
  };

  return (
    <React.Fragment>
      <AppView
        data={groups?.data || []}
        renderItem={renderGroupItem}
        ListEmptyComponent={<AppEmpty />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <AppHeader title='Nhóm' onPress={() => navigationRef.navigate('HomeScreen')} />
            </View>
            <View style={styles.body}>
              <AppCard
                containerStyle={styles.card}
                type='large'
                imageUrl={
                  userInfo?.role === EROLE.TEACHER
                    ? 'https://t3.ftcdn.net/jpg/06/57/85/22/360_F_657852299_5py03y6oH4mrUDyZnf9XxFSFfrjcqAzP.jpg'
                    : 'https://static.vecteezy.com/system/resources/previews/021/770/056/non_2x/avatar-of-a-student-character-free-vector.jpg'
                }
                imageStyle={styles.avatar}
                //subTitle={userInfo?.role}
                title={
                  <View style={{ gap: vs(4) }}>
                    <Text style={styles.title}>{userInfo?.name}</Text>
                    <Text style={styles.email}>{userInfo?.email}</Text>
                    <TouchableOpacity onPress={handleLogout}>
                      <Text style={[FONT.content.XS.medium, { color: COLORS.grey }]}>Đăng xuất</Text>
                    </TouchableOpacity>
                  </View>
                }
                rightSection={
                  <TouchableOpacity style={styles.icon}>
                    <Feather name='edit-3' size={20} color={COLORS.grey} />
                  </TouchableOpacity>
                }
              />
              <View style={styles.groupContainer}>
                <Text style={FONT.content.L}>Danh sách nhóm</Text>
              </View>
            </View>
          </View>
        }
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: vs(10),
  },
  body: {
    paddingHorizontal: s(27),
  },
  card: {
    width: width - s(27) * 2,
    marginVertical: vs(5),
  },
  avatar: {
    width: s(64),
    height: s(64),
    borderRadius: s(100),
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
  },
  title: {
    ...FONT.content.M.semiBold,
  },
  email: {
    ...FONT.content.XS.medium,
  },
  icon: {
    marginLeft: s(4),
  },
  groupContainer: {
    marginTop: vs(8),
  },
});
export default GroupListScreen;

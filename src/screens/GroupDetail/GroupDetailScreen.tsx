import { AppButton, AppHeader, AppView } from '@components';
import AppImage from '@components/AppImage';
import { IAccountItem, IExamItem, IGroupResponse } from '@interfaces/DTO/Group/group';
import { navigationRef } from '@navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { DefaultError, useQuery } from '@tanstack/react-query';
import { COLORS, FONT, QUERY_KEY, s, vs } from '@utils';
import { TRootStackNav } from '@utils/types/RootStackNav';
import React, { useState } from 'react';
import { FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import ListGroup from './components/ListGroup';

type Props = NativeStackScreenProps<TRootStackNav, 'GroupDetail'>;
const GroupDetailScreen = ({ route }: Props) => {
  const { id } = route.params;
  const { data: group } = useQuery<unknown, DefaultError, IGroupResponse>({
    queryKey: [QUERY_KEY.GROUP, { id }],
    queryFn: () =>
      api(ENDPOINTS_URL.GROUP.GET_DETAIL, 'GET', {
        params: {
          id: id,
        },
      }),
  });

  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const renderMemberItem = ({ item, index }: ListRenderItemInfo<IAccountItem>) => {
    return (
      <View key={index} style={styles.memberContainer}>
        <AppImage
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/021/770/056/non_2x/avatar-of-a-student-character-free-vector.jpg',
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.email}</Text>
        </View>
      </View>
    );
  };
  const renderExamItem = ({ item, index }: ListRenderItemInfo<IExamItem>) => {
    return (
      <View key={index} style={styles.memberContainer}>
        <AppImage source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8750/8750743.png' }} style={styles.avatar} />
        <View style={styles.examRightSection}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.category}</Text>
          <Text style={styles.desc}>{item.type}</Text>
          <Text style={[styles.desc, item.status ? { color: COLORS.green } : { color: COLORS.red }, styles.chip]}>
            {item.status ? 'Đang hoạt động' : 'Tạm dừng'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigationRef.navigate('DoExam', { examId: item._id, groupId: id })}>
          <Feather name='chevrons-right' color={'gray'} size={24} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <React.Fragment>
      <AppView>
        <AppHeader title='Nhóm' />
        <View style={styles.groupInfoContainer}>
          <AppImage
            style={styles.avatar}
            source={{ uri: 'https://t3.ftcdn.net/jpg/06/57/85/22/360_F_657852299_5py03y6oH4mrUDyZnf9XxFSFfrjcqAzP.jpg' }}
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupTitle}>{group?.data?.owner?.name}</Text>
            <Text style={styles.groupTitle}>Số lượng thành viên: {group?.data?.members?.length} người</Text>
            {group?.data?.status ? (
              <View style={styles.badge}>
                <Text style={styles.badgeContent}>Đang hoạt động</Text>
              </View>
            ) : (
              <View
                style={[styles.badge, group?.data?.status ? { backgroundColor: COLORS.green } : { backgroundColor: COLORS.red }]}>
                <Text style={styles.badgeContent}>Tạm dừng hoạt động</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Danh sách thành viên</Text>
          </View>
          <FlatList data={group?.data?.members} renderItem={renderMemberItem} contentContainerStyle={{ gap: 10 }} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Danh sách bài kiểm tra</Text>
          </View>
          <FlatList
            data={group?.data?.exams?.filter((exam) => exam.status === 'ACTIVE')}
            renderItem={renderExamItem}
            contentContainerStyle={{ gap: 10 }}
          />

          {/* Chat bot */}
          <View style={{ marginTop: vs(16) }}>
            <AppButton
              label='Chat cùng giáo viên'
              labelStyle={FONT.content.M.semiBold}
              size='S'
              type='outline'
              leading={<AntDesign name='questioncircleo' size={20} color={COLORS.green} />}
              onPress={() => navigationRef.navigate('ChatbotInGroup', { groupId: route?.params?.id })}
            />
          </View>
        </View>
      </AppView>
      <Modal visible={openAddMemberModal} onRequestClose={() => setOpenAddMemberModal(false)} statusBarTranslucent>
        <SafeAreaView style={styles.modalOverall}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm mới thành viên</Text>
            <TouchableOpacity hitSlop={10} onPress={() => setOpenAddMemberModal(false)}>
              <Feather name='x' size={24} color={'black'} />
            </TouchableOpacity>
          </View>
          <ListGroup
            members={group?.data?.members || []}
            groupId={group?.data?._id || ''}
            onBack={() => setOpenAddMemberModal(false)}
          />
        </SafeAreaView>
      </Modal>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: s(50),
    height: s(50),
    borderRadius: s(100),
    elevation: 4,
  },
  groupInfoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    marginHorizontal: s(10),
    marginVertical: vs(10),
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    padding: s(10),
    gap: s(10),
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: vs(2),
    height: '100%',
  },
  groupTitle: {
    fontSize: s(16),
    color: COLORS.black,
  },
  badge: {
    backgroundColor: COLORS.green,
    borderRadius: 100,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: s(5),
    paddingVertical: vs(3),
  },
  badgeContent: {
    fontSize: s(12),
    color: COLORS.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: s(16),
    color: COLORS.black,
    fontWeight: 'bold',
  },
  body: {
    paddingHorizontal: s(16),
    gap: vs(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addNewLabel: {
    fontSize: s(14),
    color: COLORS.green,
    fontWeight: 'bold',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    backgroundColor: COLORS.white,
    padding: s(10),
    borderRadius: s(5),
  },
  desc: {
    fontSize: s(14),
    color: COLORS.black,
  },
  deleteButton: {},
  modalOverall: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    gap: vs(10),
  },

  modalTitle: {
    fontSize: s(18),
    color: COLORS.black,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examRightSection: { flex: 1, paddingLeft: 10 },
  chip: {
    paddingHorizontal: s(10),
    color: COLORS.white,
    backgroundColor: COLORS.green,
    width: s(120),
    paddingVertical: vs(2),
    borderRadius: s(15),
  },
});
export default GroupDetailScreen;

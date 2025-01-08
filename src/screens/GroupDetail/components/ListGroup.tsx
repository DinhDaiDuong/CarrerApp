import { AppButton } from '@components';
import AppImage from '@components/AppImage';
import { IResponse } from '@interfaces/DTO';
import { IMemberSelectResponse } from '@interfaces/DTO/Auth/auth';
import { IAccountItem, IGroupDetailREQ } from '@interfaces/DTO/Group/group';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { DefaultError } from '@tanstack/query-core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, QUERY_KEY, queryClient, s, vs } from '@utils';
import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
type TOption = {
  label: string;
  value: string;
};
type TListGroup = {
  members: IAccountItem[];
  groupId: string;
  onBack: () => void;
};
const ListGroup = ({ members, groupId, onBack }: TListGroup) => {
  const [value, setValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [listMembers, setListMembers] = useState<IAccountItem[]>([]);
  const { data: listMember } = useQuery<unknown, DefaultError, IMemberSelectResponse>({
    queryKey: [QUERY_KEY.MEMBER_SELECT, { keyword }],
    queryFn: () =>
      api(ENDPOINTS_URL.AUTH.LIST_MEMBER, 'GET', {
        params: {
          keyword: keyword,
        },
      }),
  });
  const { isPending, mutate: updateGroup } = useMutation<IResponse, Error, Partial<IGroupDetailREQ>>({
    mutationFn: (variables: Partial<IGroupDetailREQ>) => {
      return api(ENDPOINTS_URL.GROUP.UPDATE_GROUP, 'PUT', {
        params: {
          id: groupId,
        },
        data: variables,
      }) as Promise<IResponse>; // Type assertion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP, { id: groupId }],
      });
      onBack();
      Toast.show({
        type: 'success',
        text1: 'Thông báo',
        text2: 'Cập nhật thành công',
      });
    },
    onError: (e) => {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Cảnh báo',
        text2: e.message,
      });
    },
  });
  const renderItem = (item: TOption) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && <Ionicons style={styles.icon} color='black' name='people-outline' size={20} />}
      </View>
    );
  };
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
        <TouchableOpacity onPress={() => onChangeItem({ label: `${item.name} - ${item.email}`, value: item._id })}>
          <Feather name='x' size={s(20)} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    );
  };
  const onChangeItem = (item: { label: string; value: string }) => {
    const isExist = listMembers.find((member) => member._id === item.value);
    if (isExist) {
      const newListMember = listMembers.filter((member) => member._id !== item.value);
      setListMembers([...newListMember]);
    } else {
      const [name, email] = item.label.trim().split('-');
      const newListMember = [...listMembers, { _id: item.value, email: email, name: name, status: 1 }];
      setListMembers([...newListMember]);
    }
  };

  useEffect(() => {
    setListMembers([...members]);
  }, [members]);
  return (
    <View style={styles.overall}>
      <View style={{ flex: 1, gap: vs(10) }}>
        <View>
          <Text style={styles.label}>Chọn thành viên mới</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            onChangeText={setKeyword}
            data={listMember?.data?.map((item) => ({ label: `${item.name} - ${item.email}`, value: item._id })) || []}
            search
            maxHeight={300}
            labelField='label'
            valueField='value'
            placeholder='Tìm kiếm thông tin thành viên'
            searchPlaceholder='Tìm kiếm...'
            value={value}
            onChange={(item) => {
              onChangeItem(item);
              setValue(item.value);
            }}
            renderLeftIcon={() => <Ionicons style={styles.icon} color='black' name='people-outline' size={20} />}
            renderItem={renderItem}
          />
        </View>
        <FlatList data={listMembers} renderItem={renderMemberItem} contentContainerStyle={{ gap: 10 }} />
      </View>
      <AppButton
        label='Cập nhật'
        labelStyle={{ fontSize: s(16) }}
        loading={isPending}
        onPress={() =>
          updateGroup({
            members: listMembers?.map((member) => member._id),
          })
        }></AppButton>
    </View>
  );
};

export default ListGroup;

const styles = StyleSheet.create({
  overall: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: vs(10),
  },
  label: {
    fontSize: s(14),
    color: COLORS.black,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  avatar: {
    width: s(50),
    height: s(50),
    borderRadius: s(100),
    elevation: 4,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    backgroundColor: COLORS.white,
    padding: s(10),
    borderRadius: s(5),
    elevation: 5,
    margin: 1,
  },
  desc: {
    fontSize: s(14),
    color: COLORS.black,
  },
  title: {
    fontSize: s(16),
    color: COLORS.black,
    fontWeight: 'bold',
  },
});

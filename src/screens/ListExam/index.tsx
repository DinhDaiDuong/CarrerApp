import { AppButton } from '@components';
import AppHeader from '@components/AppHeader';
import AppImage from '@components/AppImage';
import AppView from '@components/AppView';
import { navigationRef } from '@navigation';
import { COLORS, FONT, s, vs } from '@utils/config';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import ExamCard from './components/ExamCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListExam = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStartExam = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    navigationRef.navigate('ExamQuestion');
  };

  return (
    <>
      <AppView>
        <AppHeader title='Chuẩn bị làm bài kiểm tra' />
      </AppView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirmation}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="information-circle-outline" size={s(32)} color={COLORS.green} />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Ionicons name="close-outline" size={s(24)} color={COLORS.darkGrey} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Bạn đã sẵn sàng?</Text>
            <Text style={styles.modalDescription}>
              Bạn sắp bắt đầu bài kiểm tra hướng nghiệp. Hãy đảm bảo rằng bạn:
            </Text>
            
            <View style={styles.checklistContainer}>
              <View style={styles.checklistItem}>
                <Ionicons name="checkmark-circle-outline" size={s(20)} color={COLORS.green} />
                <Text style={styles.checklistText}>Có đủ thời gian để hoàn thành</Text>
              </View>
              <View style={styles.checklistItem}>
                <Ionicons name="checkmark-circle-outline" size={s(20)} color={COLORS.green} />
                <Text style={styles.checklistText}>Ở nơi yên tĩnh, tập trung</Text>
              </View>
              <View style={styles.checklistItem}>
                <Ionicons name="checkmark-circle-outline" size={s(20)} color={COLORS.green} />
                <Text style={styles.checklistText}>Trả lời trung thực nhất có thể</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <AppButton
                label='Bắt đầu ngay'
                buttonStyle={styles.confirmButton}
                onPress={handleConfirm}
              />
              <AppButton
                label='Để sau'
                buttonStyle={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
                onPress={() => setShowConfirmation(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomSheet}>
        <AppButton
          label='Bắt đầu kiểm tra'
          buttonStyle={{ width: s(307) }}
          onPress={handleStartExam}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: vs(10),
    marginTop: vs(10),
    marginBottom: vs(100),
  },
  card: {
    width: s(307),
    height: vs(136),
    borderRadius: s(10),
    backgroundColor: COLORS.white,
    paddingHorizontal: s(30),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    width: s(135),
    height: vs(106),
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingVertical: vs(20),
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: s(20),
    padding: s(24),
    width: '90%',
    maxWidth: s(350),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalTitle: {
    ...FONT.content.L,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: vs(12),
  },
  modalDescription: {
    ...FONT.content.M,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginBottom: vs(16),
  },
  checklistContainer: {
    gap: vs(12),
    marginBottom: vs(24),
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  checklistText: {
    ...FONT.content.M,
    color: COLORS.darkGrey,
  },
  modalButtons: {
    gap: vs(12),
  },
  confirmButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: COLORS.lightGrey,
  },
  cancelButtonText: {
    color: COLORS.darkGrey,
  },
});

export default ListExam;
import {View, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {Portal} from 'react-native-portalize';
type Props = {
  open: boolean;
  setOpen: (openImagePicker: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
};
const AppBackDrop = ({open, setOpen, children, disabled = false}: Props) => {
  if (open)
    return (
      <Portal>
        <View style={styles.wrapper}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
            disabled={disabled}
          />
          {children && children}
        </View>
      </Portal>
    );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});
export default AppBackDrop;

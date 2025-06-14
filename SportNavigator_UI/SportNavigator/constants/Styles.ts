import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFFFF',
  },
  inputField: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-b',
  },
  footer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
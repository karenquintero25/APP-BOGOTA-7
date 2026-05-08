/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { StyleSheet } from 'react-native';
export const Colors = {
  light: {
    tint: '#007AFF',
    background: '#fff',
  },
  dark: {
    tint: '#fff',
    background: '#000',
  },
};

export const globalStyles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
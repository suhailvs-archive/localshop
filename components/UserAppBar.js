import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const UserAppBar = () => {
  const router = useRouter();
  const _handleClose = () => {
    // router.replace('/'); // Replace current screen with home or dashboard
    router.back(); // Navigate to previous screen
  };

  return (
    <Appbar.Header>
      {/* <Appbar.BackAction onPress={_goBack} /> */}
      <Appbar.Content title="User Details" />
      <Appbar.Action icon="close" onPress={_handleClose} />
    </Appbar.Header>
  );
};

export default UserAppBar;
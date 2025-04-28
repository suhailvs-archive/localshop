import { Appbar } from 'react-native-paper';

const MyComponent = () => {
  const _goBack = () => console.log('Went back');

  const _handleSearch = () => console.log('Searching');

  const _handleMore = () => console.log('Shown more');

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title="User Details" />
      <Appbar.Action icon="close" onPress={_handleSearch} />
    </Appbar.Header>
  );
};

export default MyComponent;
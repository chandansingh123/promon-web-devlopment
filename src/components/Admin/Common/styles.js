import { StyleSheet } from 'aphrodite';

const styles = StyleSheet.create ({
  mainContent: {
    width: 'calc(83.33% - 16px)',
    marginLeft: 'calc(8.33% + 8px)',
    '@media (max-width: 992px)': {
      width: 'calc(100% - 16px)',
      marginLeft: 8,
    }
  }
});

export default styles;

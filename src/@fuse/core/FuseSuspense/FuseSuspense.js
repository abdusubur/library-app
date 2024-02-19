import FuseLoading from '@fuse/core/FuseLoading';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import FuseSplashScreen from '../FuseSplashScreen';

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */ function FuseSuspense(props) {
  return <Suspense fallback={<FuseSplashScreen {...props.loadingProps} />}>{props.children}</Suspense>;
}

FuseSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

FuseSuspense.defaultProps = {
  loadingProps: {
    delay: 0,
  },
};

export default FuseSuspense;

import styled from 'styled-components';
import Spinner from '../image/spinner.gif';

const SBackground = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffff;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = () => {
  return (
    <SBackground>
      <img src={Spinner} alt="loading" width="5%" />
    </SBackground>
  );
};

export default Loading;

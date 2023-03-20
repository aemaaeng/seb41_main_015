import styled from 'styled-components';
import Spinner from '../image/spinner.gif';

const SBackground = styled.div`
  width: inherit;
  height: 40vh;
  background: #ffffff;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 0px;
`;

const Loading = () => {
  return (
    <SBackground>
      <img src={Spinner} alt="loading" width="5%" />
    </SBackground>
  );
};

export default Loading;

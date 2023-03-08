import styled from 'styled-components';
import { ReactComponent as BackIcon } from '../image/back.svg';
import { useNavigate } from 'react-router-dom';

const SContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  flex-direction: column;

  h1 {
    font-size: 5rem;
    margin: 4px 0px;
  }

  #notFound {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 13px;
  }

  #description {
    font-size: 1.2rem;
  }

  button {
    margin-top: 30px;
    border: 1px solid #aaaaaa;
    padding: 10px;
    border-radius: 3px;

    display: flex;
    align-items: center;
    gap: 6px;

    font-weight: 500;
    color: #5c5c5c;

    &:hover {
      background-color: #f2f2f29e;
    }
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <SContainer>
      <h1>404</h1>
      <div id="notFound">페이지를 찾을 수 없습니다.</div>
      <div id="description">
        죄송합니다. 요청하신 페이지는 존재하지 않습니다.
      </div>
      <button onClick={handleClick}>
        <BackIcon width="18px" height="18px" fill="#bb2649" />
        홈으로 돌아가기
      </button>
    </SContainer>
  );
};

export default NotFound;

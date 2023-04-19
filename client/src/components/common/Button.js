import styled, { css } from 'styled-components';

// 일반 버튼
const SButton = styled.button`
  width: 90px;
  height: 41px;
  padding: 10px;
  border: 1px solid #bb2649;
  border-radius: 5px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #bb2649;
  ${(props) =>
    props.cancel
      ? css`
          background-color: #ffffff;
          color: #bb2649;
          margin-right: 5%;
        `
      : null}
  ${(props) =>
    props.comment
      ? css`
          margin-left: 30px;
          width: 100px;
          height: 60px;
        `
      : null}
`;

// 글 작성 페이지 접속 버튼 (나눔하기, 요청하기, 평점 책 등록하기)
const SRegisterButton = styled(SButton)`
  background-color: #cf385b;
  border-radius: 3px;
  box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.7);
  font-weight: 500;

  :hover {
    color: #ffffff;
    background-color: #bb2649;
    border: 1px solid #bb2649;
  }

  ${(props) =>
    props.rate
      ? css`
          width: 100px;
        `
      : css`
          @media screen and (max-width: 1023px) {
            width: 80px;
            margin-right: 0;
            font-size: 0.95rem;
          }
        `}
`;

export const Button = ({ text, onClick, ...props }) => {
  return (
    <SButton onClick={onClick} {...props}>
      {text}
    </SButton>
  );
};

export const RegisterButton = ({ text, onClick, ...props }) => {
  return (
    <SRegisterButton onClick={onClick} {...props}>
      {text}
    </SRegisterButton>
  );
};

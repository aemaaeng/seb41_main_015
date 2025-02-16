import React from 'react';
import styled, { css } from 'styled-components';

// 버튼 배경색 초기 설정: 빨간 배경
const primary = css`
  background-color: #bb2649;
  color: #ffffff;
`;

const small = css`
  width: fit-content;
  border-radius: 3px;
  :hover {
    background-color: #bb2649;
    color: #ffffff;
  }
`;

const wide = css`
  width: 300px;
  height: 35px;
  border-radius: 2.5px;
`;

const sizes = { small, wide };

const cancel = css`
  margin-right: 5%;
`;

const comment = css`
  width: 100px;
  height: 60px;
`;

const rate = css`
  width: 100px;
`;

const types = { cancel, comment, rate };

interface PropTypes extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  onClick: () => void;
  primary?: boolean;
  kind?: 'cancel' | 'comment' | 'rate';
  size?: 'small' | 'wide';
}

const SButton = styled.button<PropTypes>`
  width: 90px;
  height: 41px;
  padding: 10px;
  border: 1px solid #bb2649;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 배경색 지정 */
  ${(props) =>
    props.primary
      ? primary
      : css`
          background-color: #ffffff;
          color: #bb2649;
        `}
  ${(props) => (props.size ? sizes[props.size] : '')}
  ${(props) => (props.kind ? types[props.kind] : '')}
`;

// 글 작성 페이지 접속 버튼 (나눔하기, 요청하기, 평점 책 등록하기)
const SRegisterButton = styled(SButton)<PropTypes>`
  background-color: #cf385b;
  border-radius: 3px;
  font-weight: 500;
  box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.7);

  :hover {
    color: #ffffff;
    background-color: #bb2649;
    border: 1px solid #bb2649;
  }

  ${(props) => (props.kind ? types[props.kind] : '')}
`;

export const Button = ({ text, onClick, ...props }: PropTypes) => {
  return (
    <SButton onClick={onClick} {...props}>
      {text}
    </SButton>
  );
};

export const RegisterButton = ({ text, onClick, ...props }: PropTypes) => {
  return (
    <SRegisterButton onClick={onClick} {...props}>
      {text}
    </SRegisterButton>
  );
};

import { useState } from 'react';
import styled from 'styled-components';
import instanceAxios from '../../util/InstanceAxios';
import { showConfirmAlert } from '../common/Alert';

const SLabel = styled.label`
  --width: 90px;

  position: relative;
  display: inline-block;
  width: var(--width);
  height: 33px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .statusSwitch {
    background-color: #c8f9b6;
  }

  input:checked + .statusSwitch:before {
    -webkit-transition: translateX(58px);
    -ms-transform: translateX(58px);
    transform: translateX(58px);
    transition: 0.4s;
  }

  .statusSwitch {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background-color: #dfdfdf;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .statusSwitch:before {
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 5px;
    background-color: #ffffff;
    border-radius: 20px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  // 안에 글자
  .texts {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 0.8rem;
    color: #000000;
    transition: all 0.4s;
    overflow: hidden;
    cursor: pointer;
  }

  .texts::after {
    content: attr(data-off);
    position: absolute;
    /* color: #474747; */
    font-weight: 700;
    opacity: 1;
    transition: all 0.4s;
    top: 7px;
    right: 12px;
  }

  .texts::before {
    content: attr(data-on);
    position: absolute;
    color: #474747;
    top: 6px;
    left: calc(var(--width) * -0.87);
    font-weight: 700;
    opacity: 0;
    transition: all 0.4s;
  }

  input:checked ~ .texts::after {
    opacity: 0;
    transform: translateX(var(--width));
  }

  input:checked ~ .texts::before {
    opacity: 1;
    transform: translateX(var(--width));
  }
`;

const ToggleSwitch = ({ id, status }: { id: string; status: boolean }) => {
  // 초기값은 서버에서 받아온 나눔 상태 값 (boolean)
  const [isAvailable, setIsAvailable] = useState(status);

  const handleToggleClick = () => {
    setIsAvailable(!isAvailable);
  };

  const handleStatusChange = () => {
    showConfirmAlert({
      title: '나눔 상태를 변경하시겠습니까?',
    }).then((res) => {
      if (res.isConfirmed) {
        handleToggleClick();
        instanceAxios
          .patch(`v1/borrows/completion/${id}`)
          .catch((err) => console.error(err));
      }
    });
  };

  return (
    <SLabel>
      <input
        type="checkbox"
        checked={isAvailable}
        onChange={handleStatusChange}
      />
      <span className="statusSwitch"></span>
      <span className="texts" data-on="나눔가능" data-off="나눔완료"></span>
    </SLabel>
  );
};

export default ToggleSwitch;

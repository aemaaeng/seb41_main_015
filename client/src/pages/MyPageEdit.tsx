import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instanceAxios from '../util/InstanceAxios';
import axios from 'axios';
import {
  showWarningAlert,
  showSuccessAlert,
  showFailedToFetch,
  showConfirmAlert,
} from '../components/common/Alert';

const SWrapEdit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  @media screen and (max-width: 1080px) {
    padding-left: 10px;
  }
`;
const SLabelList = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0 50px;
  label {
    margin-bottom: 1rem;
    padding-top: 10px;
    height: 36px;
    width: 100px;
  }
  .upload-Btn {
    border-radius: 5px;
    height: 36px;
    padding: 5px 10px;
    :hover {
      color: #bb2649;
      cursor: pointer;
    }
  }
`;

const SInputList = styled.div`
  input[type='file'] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px;
  padding-right: 10%;
  @media screen and (max-width: 1080px) {
    padding-left: 10px;
    justify-content: left;
  }
  input {
    margin-bottom: 1rem;
  }
  input:disabled {
    background: #f2f2f2;
  }
  .inputSize {
    width: 472px;
    height: 36px;
    @media screen and (max-width: 1080px) {
      width: 20rem;
    }
  }
  .upload-name {
    color: #999999;
  }
`;

const SWithdraw = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  color: #bb2649;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  padding-right: 10%;
`;

const SCancelBtn = styled.button`
  height: 43px;
  width: 141px;
  top: 860px;
  border-radius: 5px;
  border: 1px solid #bb2649;
  color: #bb2649;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  @media screen and (max-width: 1080px) {
    height: 40px;
    width: 100px;
    margin-left: 50px;
  }
`;
const SSaveBtn = styled.button`
  height: 43px;
  width: 141px;
  left: 576px;
  top: 860px;
  border-radius: 5px;
  border: 1px solid #bb2649;
  background-color: #bb2649;
  color: white;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  margin-left: 40px;
  @media screen and (max-width: 1080px) {
    height: 40px;
    width: 100px;
    margin-left: 20px;
  }
`;

const SEditBtn = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const STitle = styled.div`
  h2 {
    color: #2c2c2c;
    padding: 18px;
    margin: 20px 10%;
    border-bottom: 1px solid #acacac;
  }
`;

const SDefaultProfile = styled.div`
  margin: 2rem 0;
  @media screen and (max-width: 1080px) {
    display: flex;
    margin: 2rem 0;
    justify-content: center;
  }
  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    @media screen and (max-width: 1080px) {
      height: 80px;
      width: 80px;
      margin-left: 110%;
    }
  }
  .profileRemove {
    border: none;
    padding: 10px;
    :hover {
      color: #bb2649;
    }
    @media screen and (max-width: 1080px) {
      display: none;
    }
  }
`;

const MyPageEdit = () => {
  //컴포넌트에서 바뀌는 값 관리
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const navigate = useNavigate();

  //input 입력값 상태 저장
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleChangeDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  //이미지 사진 반영하기
  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', uploadFile);
      const accessToken = sessionStorage.getItem('accessToken');
      axios
        .post(
          `https://serverbookvillage.kro.kr/v1/s3/images/upload`,
          formData,
          {
            headers: {
              'Content-type': 'multipart/form-data;UTF-8',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setImgUrl(res.data.data);
        });
    }
  };
  //프로필 제거 함수
  const handleClickProfileRemove = () => {
    setImgUrl('https://img.icons8.com/windows/32/null/user-male-circle.png');
  };

  //수정 취소 확인 함수
  const handleCancel = () => {
    showConfirmAlert({
      title: '작성을 취소하시겠습니까?',
      text: '작성 중인 내용은 저장되지 않습니다',
    }).then((res) => {
      if (res.isConfirmed) {
        navigate(-1);
      }
    });
  };

  //저장 버튼 클릭 시, 서버로 patch 요청
  const handleClickSave = () => {
    instanceAxios
      .patch('/v1/members', {
        name,
        address,
        phoneNumber,
        imgUrl,
      })
      .then(() => {
        navigate('/mypage');
        window.location.reload();
        showSuccessAlert(
          '프로필 수정 완료',
          '프로필이 정상적으로 수정되었습니다'
        );
      })
      .catch((err) => {
        showWarningAlert('프로필 수정 실패', '프로필 수정에 실패했습니다');
        console.error(err);
      });
  };

  useEffect(() => {
    const editData = async () => {
      try {
        const res = await instanceAxios.get('/v1/members');
        setName(res.data.data.name);
        setEmail(res.data.data.email);
        setDisplayName(res.data.data.displayName);
        setAddress(res.data.data.address);
        setPhoneNumber(res.data.data.phoneNumber);
        setImgUrl(res.data.data.imgUrl);
      } catch (error) {
        console.error(error);
        showFailedToFetch();
        navigate('/');
      }
    };
    editData();
  }, []);

  //회원탈퇴
  const handleClickQuit = () => {
    showConfirmAlert({
      title: '회원탈퇴를 진행하시겠습니까?',
      text: '회원탈퇴 후 로그인이 불가하니 신중하게 생각해주세요.',
      confirmButtonText: '탈퇴',
    }).then((res) => {
      if (res.isConfirmed) {
        // 만약 모달창에서 confirm 버튼을 눌렀다면
        instanceAxios.patch('/v1/members/quit').then(() => {
          sessionStorage.clear();
          navigate('/');
          window.location.reload();
          showSuccessAlert(
            '정상적으로 회원탈퇴가 처리되었습니다.',
            '이용해주셔서 감사합니다'
          );
        });
      }
    });
  };

  return (
    <div>
      <STitle>
        <h2>회원정보 수정</h2>
      </STitle>
      <SWrapEdit>
        <SDefaultProfile>
          {imgUrl === '' ? (
            <img
              src="https://img.icons8.com/windows/32/null/user-male-circle.png"
              alt="noProfile"
            />
          ) : (
            <img src={imgUrl} alt="profile" />
          )}
          <button className="profileRemove" onClick={handleClickProfileRemove}>
            삭제
          </button>
        </SDefaultProfile>
        <SFlexRow>
          <SLabelList>
            <label htmlFor="name" className="mr-30 inputSize">
              이름
            </label>
            <label htmlFor="nickName" className="mr-18 inputSize">
              닉네임
            </label>

            <label htmlFor="email" className="mr-18 inputSize">
              이메일
            </label>
            <label htmlFor="address" className="mr-30 inputSize">
              주소
            </label>
            <label htmlFor="phonNumber" className="mr-6 inputSize">
              전화번호
            </label>
            <label htmlFor="profile" className="profileLabel mr-6 inputSize">
              <div className="upload-Btn">프로필등록</div>
            </label>
          </SLabelList>
          <SInputList>
            <input
              id="name"
              type="text"
              className="inputSize"
              placeholder="이름을 입력하십시오"
              value={name || ''}
              onChange={handleChangeName}
            ></input>
            <input
              id="nickName"
              type="text"
              className="inputSize"
              placeholder="닉네임을 입력하십시오"
              disabled
              value={displayName || ''}
              onChange={handleChangeDisplayName}
            ></input>
            <input
              id="email"
              type="text"
              className="inputSize"
              placeholder="이메일을 입력하십시오"
              disabled
              value={email || ''}
              onChange={handleChangeEmail}
            ></input>
            <input
              id="address"
              type="text"
              className="inputSize"
              placeholder="주소를 입력하십시오"
              value={address || ''}
              onChange={handleChangeAddress}
            ></input>
            <input
              id="phonNumber"
              type="text"
              className="inputSize"
              placeholder="전화번호를 입력하십시오"
              value={phoneNumber || ''}
              onChange={handleChangePhoneNumber}
            ></input>
            <input
              className="upload-name inputSize profileInput"
              placeholder="프로필을 등록하세요"
              disabled
            />
            <input
              type="file"
              id="profile"
              accept="image/*"
              onChange={handleChangeProfile}
            />
            <SWithdraw onClick={handleClickQuit}>회원탈퇴</SWithdraw>
          </SInputList>
        </SFlexRow>
      </SWrapEdit>
      <SEditBtn>
        <SCancelBtn onClick={handleCancel}>취소</SCancelBtn>
        <SSaveBtn onClick={handleClickSave}>저장</SSaveBtn>
      </SEditBtn>
    </div>
  );
};
export default MyPageEdit;

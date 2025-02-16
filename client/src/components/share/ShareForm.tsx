import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookAddModal from '../common/BookAddModal';
import axios from 'axios';
import { showWarningAlert, showConfirmAlert } from '../common/Alert';
import { Button } from '../common/Button';
import { InputProps } from '../../pages/ReqAdd';

const StyledShareForm = styled.div`
  .title {
    color: #2c2c2c;
    padding: 18px;
    margin: 0 10%;
    border-bottom: 1px solid #acacac;
  }
`;
const SInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 11% 10px 14%;
  font-size: 13px;
  #imgInput {
    display: none;
  }
  @media screen and (max-width: 1070px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }
`;

const SInputLeft = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .thumbnail {
    width: 230px;
    height: 297.156px;
    margin-bottom: 30px;

    @media screen and (max-width: 930px) {
      width: 160px;
      height: 205px;
    }
  }
  .imgAddDes {
    color: #626262;
    font-size: 11px;
    @media screen and (max-width: 1070px) {
      margin-bottom: 15px;
    }
  }
`;

const SImgBtn = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  margin-bottom: 20px;
  .imgInputBtn {
    width: 100px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #d0c9c0;
    margin-right: 5px;
    background-color: #d0c9c0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .imgDelete {
    width: 100px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #d0c9c0;
    background-color: #d0c9c0;
    font-weight: 700;
  }
`;

const SInputRight = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  input {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    border: none;
    border-radius: 2px;
    background-color: #f4f4f4;
    padding-left: 10px;

    :focus {
      outline: none;
      border-bottom: 2px solid #4f4f4f;
    }
  }
  .inputContent {
    width: 100%;
    height: 220px;
    border: none;
    margin-bottom: 30px;
    padding: 10px;
  }
`;

const SButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 70px;
  button {
    width: 15%;
    height: 35px;
  }
`;

const ShareForm = (props: InputProps) => {
  const navigate = useNavigate();
  const { inputs, onBookInfoChange } = props;
  const { bookTitle, author, publisher, talkUrl, title, content, thumbnail } =
    inputs;

  const handleChangeString = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string | string[]
  ) => {
    onBookInfoChange({ ...inputs, [`${type}`]: e.target.value });
  };

  const handleChangeThmbnail = (image: string) => {
    onBookInfoChange({ ...inputs, thumbnail: image });
  };

  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadImg = e.target.files[0];
      const accessToken = sessionStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('image', uploadImg);
      axios
        .post(
          'https://serverbookvillage.kro.kr/v1/s3/images/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Athorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          handleChangeThmbnail(res.data.data);
        })
        .catch((err) => console.log(err));
    }

    if (e.target.files && e.target.files[0]) {
      const maxSize = 3 * 1024 * 1024;
      const fileSize = e.target.files[0].size;

      if (fileSize > maxSize) {
        showWarningAlert(
          '책 표지 등록 실패',
          '첨부 파일의 사이즈는 3MB 이내로 등록 가능합니다'
        );
      }
    }
  };

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

  const deleteImg = () => {
    URL.revokeObjectURL(thumbnail);
    handleChangeThmbnail(
      'https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg'
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <StyledShareForm>
      <div className="title">
        <h2>{props.page === 'shareAdd' ? '나눔하기' : '나눔글 수정하기'}</h2>
        <div>
          {props.page === 'shareAdd' ? '갖고 있는 도서를 나눠보세요!' : ''}
        </div>
      </div>
      <SInputContainer>
        <SInputLeft>
          {thumbnail && (
            <img alt="thumbnail" src={thumbnail} className="thumbnail" />
          )}
          <SImgBtn>
            <input
              type="file"
              accept="image/*"
              id="imgInput"
              disabled={bookTitle === undefined || bookTitle === ''}
              onChange={(e) => uploadImg(e)}
            />
            <label className="imgInputBtn" htmlFor="imgInput">
              책 표지 등록
            </label>
            <button className="imgDelete" onClick={() => deleteImg()}>
              삭제
            </button>
          </SImgBtn>
          <div className="imgAddDes">
            {props.page === 'shareAdd'
              ? '책 상태를 보여줄 수 있는 사진을 첨부해주시면 더 좋습니다!'
              : ''}
          </div>
        </SInputLeft>
        <SInputRight>
          <div>
            <input
              name="bookTitle"
              value={bookTitle || ''}
              onChange={(e) => handleChangeString(e, bookTitle)}
              placeholder="책 제목을 입력해주세요."
              onClick={handleOpenModal}
              autoComplete="off"
            />
            {/* 검색 모달  */}
            <BookAddModal
              isModalOpen={isModalOpen}
              onBookInfoChange={onBookInfoChange}
              handleCloseModal={handleCloseModal}
              isRate={false}
            />
          </div>
          <div>
            <input
              name="author"
              value={author || ''}
              onChange={(e) => handleChangeString(e, author)}
              placeholder="저자를 입력해주세요."
              disabled
            />
          </div>
          <div>
            <input
              name="publisher"
              value={publisher || ''}
              onChange={(e) => handleChangeString(e, publisher)}
              placeholder="출판사를 입력해주세요."
              disabled
            />
          </div>
          <div>
            <input
              name="talkUrl"
              value={talkUrl || ''}
              onChange={(e) => handleChangeString(e, 'talkUrl')}
              placeholder="오픈채팅 대화방 링크를 입력해주세요. (http://, https:// 포함)"
              autoComplete="off"
            />
          </div>
          <div>
            <input
              name="title"
              value={title || ''}
              onChange={(e) => handleChangeString(e, 'title')}
              placeholder="게시글 제목을 입력해주세요."
              autoComplete="off"
            />
          </div>
          <div>
            <input
              name="content"
              value={content || ''}
              onChange={(e) => handleChangeString(e, 'content')}
              className="inputContent"
              placeholder="게시글 내용을 입력해주세요. (ex. 책 상태, 구매 시기 등)"
              autoComplete="off"
            />
          </div>
        </SInputRight>
      </SInputContainer>
      <SButtonBox>
        <Button text="취소" onClick={handleCancel} kind="cancel" />
        <Button
          text={props.page === 'shareAdd' ? '등록' : '수정'}
          onClick={props.onClick}
          primary
        />
      </SButtonBox>
    </StyledShareForm>
  );
};

export default ShareForm;

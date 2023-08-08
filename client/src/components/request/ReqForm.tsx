import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookAddModal from '../common/BookAddModal';
import { Button } from '../common/Button';
import { showConfirmAlert } from '../common/Alert';
import { InputProps } from '../../pages/ReqAdd';

const StyledReqForm = styled.div`
  .title {
    color: #2c2c2c;
    padding: 18px;
    margin: 0 10% 20px;
    border-bottom: 1px solid #acacac;
  }
`;

const SInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 11% 10px 14%;
  font-size: 13px;
  #ImgInput {
    display: none;
  }
  @media screen and (max-width: 930px) {
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
  .bookImg {
    width: 230px;
    margin-bottom: 30px;

    @media screen and (max-width: 930px) {
      width: 160px;
      height: 205px;
    }
  }
`;

const SImgBtn = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  margin-bottom: 20px;
  .bookImg {
    width: 230px;
    height: 297.156px;
    margin-bottom: 30px;
    @media screen and (max-width: 930px) {
      width: 160px;
      height: 206.712px;
    }
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
    width: 15rem;
    height: 35px;
  }
`;

const ReqForm = (props: InputProps) => {
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

  const handleChangeThumbnail = (
    e: React.FormEvent<HTMLImageElement>,
    imgUrl: string
  ) => {
    onBookInfoChange({ ...inputs, thumbnail: imgUrl });
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <StyledReqForm>
      <div className="title">
        <h2>{props.page === 'reqAdd' ? '요청하기' : '요청글 수정하기'}</h2>
        <div>
          {props.page === 'reqAdd' ? '원하는 도서를 요청해보세요!' : ''}
        </div>
      </div>

      <SInputContainer>
        <SInputLeft>
          <SImgBtn>
            <img
              alt="bookImg"
              src={thumbnail}
              className="bookImg"
              onChange={(e) => handleChangeThumbnail(e, thumbnail)}
            />
          </SImgBtn>
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
          text={props.page === 'reqAdd' ? '등록' : '수정'}
          onClick={props.onClick}
          primary
        />
      </SButtonBox>
    </StyledReqForm>
  );
};

export default ReqForm;

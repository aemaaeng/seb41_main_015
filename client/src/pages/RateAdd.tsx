import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BookAddModal from '../components/common/BookAddModal';
import { Button } from '../components/common/Button';
import instanceAxios from '../util/InstanceAxios';
import { RateStar } from '../components/rate/RateStar';
import {
  showRequireLogin,
  showSuccessAlert,
  showConfirmAlert,
  showWarningAlert,
} from '../components/common/Alert';
import { BookInfo } from '../components/common/BookAddModal';

interface RateInput {
  bookTitle: string;
  author: string | string[];
  publisher: string;
  thumbnail: string;
  isbn: string;
  content: string;
}

const StyledForm = styled.div`
  margin: 0px 190px;

  .title {
    color: #2c2c2c;
    padding: 18px;
    border-bottom: 1px solid #acacac;
  }

  @media screen and (max-width: 1200px) {
    margin: 0px 50px;
  }
`;

const SInputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0px;
  font-size: 13px;
  @media screen and (max-width: 1200px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    margin: 0;
  }
`;

const SImageContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .bookImg {
    width: 230px;
    margin-bottom: 30px;

    @media screen and (max-width: 930px) {
      width: 160px;
    }
  }
`;

const SInputs = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  input {
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
  @media screen and (max-width: 1200px) {
    width: 80%;
  }
  .content {
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

const RateAdd = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const defaultImg =
    'https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg';
  const [inputs, setInputs] = useState<RateInput>({
    bookTitle: '',
    author: '',
    publisher: '',
    thumbnail: defaultImg,
    isbn: '',
    content: '',
  });

  const { bookTitle, author, publisher, thumbnail, isbn, content } = inputs;
  const [rating, setRating] = useState(0);
  const handleBookInfoChange = (bookInfo: BookInfo) => {
    setInputs({ ...inputs, ...bookInfo });
  };

  // 문자열 변경 감지 함수
  const handleChangeString = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    handleBookInfoChange({ ...inputs, [`${type}`]: e.target.value });
  };

  const accessToken = sessionStorage.getItem('accessToken');

  const handleSubmit = () => {
    if (!accessToken) {
      showRequireLogin();
      return;
    }

    // input 유효성 검사
    if (rating === 0) {
      showWarningAlert('등록 불가', '평점은 최소 1점 이상 등록 가능합니다');
      return;
    }
    if (!bookTitle || bookTitle.length === 0) {
      showWarningAlert('등록 불가', '책 정보를 입력해주세요');
      return;
    }
    if (!content || content.length === 0) {
      showWarningAlert('등록 불가', '코멘트를 입력해주세요');
      return;
    }

    // 서버 요청
    instanceAxios
      .post(
        `v1/rates?isbn=${isbn}&bookTitle=${bookTitle}&author=${author}&publisher=${publisher}`,
        {
          rating,
          content,
          thumbnail,
        }
      )
      .then(() => {
        showSuccessAlert('평점 등록 완료', '평점이 정상적으로 등록되었습니다');
        navigate('/rateList');
      })
      .catch((err) => console.error(err));
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

  return (
    <StyledForm>
      <div className="title">
        <h2>평점 매기기</h2>
        <div>내가 읽은 책에 대한 평가를 남겨보세요!</div>
      </div>
      <SInputContainer>
        <SImageContainer>
          <img alt="bookImg" src={thumbnail} className="bookImg" />
          <RateStar rating={rating} setRating={setRating} />
        </SImageContainer>
        <SInputs>
          <input
            placeholder="책 제목을 입력해주세요"
            onClick={() => setIsModalOpen(true)}
            value={bookTitle || ''}
            onChange={(e) => handleChangeString(e, bookTitle)}
            autoComplete="off"
          />
          <BookAddModal
            isModalOpen={isModalOpen}
            onBookInfoChange={handleBookInfoChange}
            handleCloseModal={handleCloseModal}
            isRate={true}
          />
          <input
            placeholder="책 저자를 입력해주세요"
            value={author}
            onChange={(e) => handleChangeString(e, 'author')}
            disabled
            autoComplete="off"
          />
          <input
            placeholder="출판사를 입력해주세요"
            value={publisher}
            onChange={(e) => handleChangeString(e, 'publisher')}
            disabled
            autoComplete="off"
          />
          <input
            placeholder="책에 대한 코멘트를 입력해주세요"
            onChange={(e) => handleChangeString(e, 'content')}
            className="content"
            autoComplete="off"
          />
        </SInputs>
      </SInputContainer>
      <SButtonBox>
        <Button text="취소" onClick={handleCancel} cancel />
        <Button text="등록" onClick={handleSubmit} primary />
      </SButtonBox>
    </StyledForm>
  );
};

export default RateAdd;

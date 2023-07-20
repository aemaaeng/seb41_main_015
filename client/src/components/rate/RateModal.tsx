import styled from 'styled-components';
import { useEffect, useState } from 'react';
import instanceAxios from '../../util/InstanceAxios';
import { RateStar } from './RateStar';
import { showWarningAlert, showRequireLogin } from '../common/Alert';
import { Button } from '../common/Button';
import { BookInfo } from '../common/BookAddModal';
import { RateCommentType } from './RateComment';

interface RateBookInfo extends BookInfo {
  bookId: number;
  avgRate: number;
  rates: RateCommentType[];
  createdAt: string;
  modifiedAt: string;
}

const SModalBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const SRateModal = styled.div`
  width: 400px;
  height: 320px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  border: 1px solid #aaaaaa;
  background-color: #ffffff;
  .close {
    padding-top: 3px;
    position: absolute;
    right: 13px;
    font-size: 2rem;
    color: #aaaaaa;
    cursor: pointer;
  }
`;

const SRateInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  align-items: center;
  text-align: center;
  .rateExplain {
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .star {
    flex-direction: row;
    margin-bottom: 20px;
  }
  .rateReviewTextBox {
    border-radius: 2.5px;
    padding: 10px;
    resize: none;
    height: 100px;
    width: 300px;
  }
  button {
    margin-top: 20px;
  }
`;

const RateModal = ({
  isModalOpen,
  handleCloseModal,
  data,
}: {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  data: RateBookInfo;
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    console.log(data);
  }, []);

  const handleChangeRateContent = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(e.target.value);
  };

  const handleRateSubmit = () => {
    const sessionAccessToken = sessionStorage.getItem('accessToken');

    // 로그인 회원만 이용가능한 서비스
    if (!sessionAccessToken) {
      showRequireLogin();
      return;
    }

    if (content.length === 0) {
      showWarningAlert('내용을 입력하세요', '최소 1글자 이상 작성해야 합니다');
      return;
    }

    instanceAxios
      .post(
        `/v1/rates?isbn=${data.isbn}&bookTitle=${data.bookTitle}&author=${data.author}&publisher=${data.publisher}`,
        {
          rating,
          content,
        }
      )
      .then((res) => {
        handleCloseModal();
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        showWarningAlert(
          '이미 등록한 평점이 존재합니다',
          '평점은 한 번만 등록할 수 있습니다'
        );
        handleCloseModal();
      });
  };

  return (
    <>
      {isModalOpen ? (
        <SModalBackground onClick={handleCloseModal}>
          <SRateModal onClick={(e) => e.stopPropagation()}>
            <div className="close" onClick={handleCloseModal}>
              &times;
            </div>
            <SRateInfo>
              <div className="rateExplain">
                이 책에 대한 평점과 리뷰를 남겨보세요
              </div>
              <div className="star">
                <RateStar rating={rating} setRating={setRating} />
              </div>
              <div>
                <textarea
                  className="rateReviewTextBox"
                  placeholder="리뷰를 입력해주세요"
                  onChange={handleChangeRateContent}
                ></textarea>
                <Button
                  text="리뷰 남기기"
                  onClick={handleRateSubmit}
                  wide
                  primary
                />
              </div>
            </SRateInfo>
          </SRateModal>
        </SModalBackground>
      ) : null}
    </>
  );
};

export default RateModal;

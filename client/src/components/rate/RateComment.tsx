import styled from 'styled-components';
import { useState } from 'react';
import { RateStarSmall } from './RateStar';
import { ReactComponent as BookStar } from '../../images/bookStar.svg';
import instanceAxios from '../../util/InstanceAxios.js';
import { prettyDate } from '../../util/dateparse.js';
import {
  showNormalAlert,
  showWarningAlert,
  showConfirmAlert,
} from '../common/Alert.js';
import { GeneralComment } from '../common/Comment.js';

export interface RateCommentType extends GeneralComment {
  rateId: number;
  rating: number;
}

const SCommentWrap = styled.div`
  margin: 0px 10%;
  color: #434343;
  h2 {
    margin-bottom: 0px;
    border-bottom: 1px solid #acacac;
    padding-bottom: 15px;
    font-size: 1.3rem;
  }
  @media screen and (max-width: 1100px) {
    margin: 0px 24px;
  }
  input {
    border: 1px solid #acacac;
    border-radius: 3px;
    padding: 7px 5px;
  }
`;

const SCommentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0px;
  padding: 0px 10px 20px 10px;
  border-bottom: 1px solid #acacac;

  img {
    width: 45px;
    height: 45px;
    border-radius: 70%;
  }

  .texts {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .commentTop {
    display: flex;
    justify-content: space-between;
  }

  .commentInfo {
    display: flex;
    gap: 10px;
    margin-bottom: 7px;
  }

  #author {
    font-weight: 600;
  }

  #rates {
    display: flex;
    align-items: center;
    font-weight: 600;
    span {
      padding-bottom: 2px;
    }
  }

  #content {
    font-size: 0.9rem;
  }

  #createdAt {
    margin-left: 15px;
    font-size: 0.7rem;
    font-weight: 400;
    color: #acacac;
  }
`;

const SControlButtons = styled.div`
  color: #aaaaaa;
  font-size: 0.8rem;
  .button {
    margin: 0px 3px;
    &:hover {
      cursor: pointer;
      color: #bb2649;
    }
  }
`;

const RateComment = ({ data }: { data: RateCommentType[] }) => {
  const [rating, setRating] = useState(0);
  const [editId, setEditId] = useState('');
  const handleEditMode = (rateId: string, rating: number, content: string) => {
    setEditId(rateId);
    setRating(rating);
    setEditInput(content);
  };

  const [editInput, setEditInput] = useState('');
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value);
  };

  const handleSubmitEdit = () => {
    // 서버에 요청 보내기 (id는 나중에 props로 내려받기)
    instanceAxios
      .patch(`v1/rates/${editId}`, {
        rating: rating,
        content: editInput,
      })
      .then(() => {
        showConfirmAlert({
          title: '평점이 정상적으로 수정되었습니다.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: '확인',
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((err) => {
        console.log(err);
        showWarningAlert('평점 수정 실패', '평점 수정에 실패했습니다');
      });
  };

  const handleCancelEdit = () => {
    setEditId('');
  };

  const handleDeleteRate = (rateId: string) => {
    // 삭제하기 전에 한 번 물어보기
    showConfirmAlert({
      title: '평점을 삭제하시겠습니까?',
    }).then((res) => {
      if (res.isConfirmed) {
        instanceAxios.delete(`v1/rates/${rateId}`).then(() => {
          showNormalAlert('평점이 삭제되었습니다');
          window.location.reload();
        });
      }
    });
  };

  return (
    <>
      {data && (
        <SCommentWrap>
          <h2>리뷰 {data.length}</h2>
          {data.map((rate) => {
            const currentUser = sessionStorage.getItem('displayName');
            const isSameUser = rate.displayName === currentUser ? true : false;

            return (
              <SCommentContainer key={rate.rateId}>
                <img src={rate.imgUrl} alt="profile" />
                <div className="texts">
                  <div className="commentTop">
                    <div className="commentInfo">
                      <div id="author">{rate.displayName}</div>
                      {editId === String(rate.rateId) ? (
                        <RateStarSmall rating={rating} setRating={setRating} />
                      ) : (
                        <div id="rates">
                          <BookStar />
                          <span>{rate.rating}</span>
                          <div id="createdAt">{prettyDate(rate.createdAt)}</div>
                        </div>
                      )}
                    </div>
                    {isSameUser ? (
                      <SControlButtons>
                        {editId === String(rate.rateId) ? (
                          <span className="button" onClick={handleSubmitEdit}>
                            확인
                          </span>
                        ) : (
                          <span
                            className="button"
                            onClick={() =>
                              handleEditMode(
                                String(rate.rateId),
                                rate.rating,
                                rate.content
                              )
                            }
                          >
                            수정
                          </span>
                        )}
                        <span>|</span>
                        {editId === String(rate.rateId) ? (
                          <span className="button" onClick={handleCancelEdit}>
                            취소
                          </span>
                        ) : (
                          <span
                            className="button"
                            onClick={() =>
                              handleDeleteRate(String(rate.rateId))
                            }
                          >
                            삭제
                          </span>
                        )}
                      </SControlButtons>
                    ) : null}
                  </div>
                  {editId === String(rate.rateId) ? (
                    <input
                      defaultValue={rate.content}
                      onChange={handleChangeInput}
                    ></input>
                  ) : (
                    <div id="content">{rate.content}</div>
                  )}
                </div>
              </SCommentContainer>
            );
          })}
        </SCommentWrap>
      )}
    </>
  );
};

export default RateComment;

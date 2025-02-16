import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ToggleSwitch from '../share/ToggleSwitch';
import ShareStatus from '../share/ShareStatus';
import Comment from './Comment';
import instanceAxios from '../../util/InstanceAxios';
import { prettyDate } from '../../util/dateparse';
import { ReactComponent as KakaoFill } from '../../images/kakaofill.svg';
import { ReactComponent as Eye } from '../../images/eye.svg';
import { showNormalAlert, showConfirmAlert } from './Alert';
import { Comments } from './Comment';

interface GeneralPostData {
  author: string;
  bookTitle: string;
  content: string;
  createdAt: string;
  displayName: string;
  imgUrl: string;
  modifiedAt: string;
  publisher: string;
  talkUrl: string;
  thumbnail: string;
  title: string;
  view: number;
}

export interface BorrowPostData extends GeneralPostData {
  borrowId: number;
  borrowComments: Comments;
  borrowWhthr: boolean;
}

interface RequestPostData extends GeneralPostData {
  requestId: number;
  requestComments: Comments;
}

export type PostData = BorrowPostData | RequestPostData;

const SDetailLayout = styled.main`
  padding: 24px;
  min-height: calc(100vh - 60px - 280px);

  .container {
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const SDetailWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 35px;

  img {
    margin: 24px 24px 24px 0px;
    width: 250px;
  }

  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
    gap: 0px;
  }
`;

const SRightSide = styled.div`
  margin: 24px;
  /* border: 1px solid green; */
  width: calc(100% - 610px);

  .controlButtons {
    flex-shrink: 0;
    color: #aaaaaa;
    margin-right: 8px;
  }

  .betweenButtons {
    margin: 5px;
  }

  .controlButton {
    &:hover {
      color: #bb2649;
      cursor: pointer;
    }
  }

  .description {
    font-size: 1.05rem;
  }
  @media screen and (max-width: 1100px) {
    width: 100%;
    padding: 0px 24px;
  }
`;

const STopWrap = styled.div`
  padding-bottom: 5px;
  border-bottom: 1px solid #aaaaaa;
  /* max-width: 677px; */

  h1 {
    margin: 10px 0px;
  }

  .titleAndButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
`;

const SAuthorAndStatus = styled.div`
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  margin-bottom: 10px;

  .authorInfo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 3px;

    .author {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    img {
      margin: 0;
      width: 28px;
      height: 28px;
      border-radius: 70%;
    }

    .views {
      color: #aaaaaa;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .createdAt {
      color: #aaaaaa;
      font-size: 0.8rem;
      @media screen and (max-width: 527px) {
        display: none;
      }
    }
  }

  .onlyInShare {
    display: none;
  }
`;

const SBookInfo = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  background-color: #fffbeac2;
  border-radius: 5px;
  padding: 24px 12px 5px 24px;

  h2 {
    margin-top: 0;
  }

  div {
    color: #000000;
    margin: 5px 0px;
    font-weight: 600;
    font-size: 1rem;
    span {
      color: #505050;
    }
  }
`;

const SContact = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  div {
    font-weight: 600;
    margin-right: 15px;
    color: #7c7c7c;
    font-size: 0.9rem;
  }

  button {
    border: none;
    border-radius: 5px;
    background-color: #f9e000;
    padding: 12px;
    margin: 10px 5px 10px 0px;
    font-weight: 600;
    font-size: 0.9rem;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }
`;

const DetailForm = ({
  data,
  endpoint,
  id,
  comments,
}: {
  data: PostData;
  endpoint: string;
  id: string;
  comments: Comments;
}) => {
  const navigate = useNavigate();

  // 자기가 쓴 글이 아니면 수정, 삭제 버튼이 안 보여야 함
  const currentUser = sessionStorage.getItem('displayName');
  const isSameUser = data.displayName === currentUser ? true : false;

  const onlyInShare = endpoint === 'borrows' ? '' : 'onlyInShare';
  const borrowWhthr = (data: PostData) => {
    if ('borrowId' in data) return data.borrowWhthr;
  };

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    // 서버에 삭제 요청 보내기 (instanceAxios 쓰기)
    showConfirmAlert({
      title: '정말로 삭제하시겠습니까?',
    }).then((res) => {
      if (res.isConfirmed) {
        instanceAxios
          .delete(`v1/${endpoint}/${id}`)
          .then(() => {
            showNormalAlert('글이 삭제되었습니다');
            navigate(-1);
          })
          .catch((err) => {
            showNormalAlert('글 삭제에 실패했습니다');
            console.error(err);
          });
      }
    });
  };

  // 기본 이미지
  const cover = data.thumbnail
    ? data.thumbnail
    : 'https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg';

  // 프로필 사진 기본 이미지
  const profile = data.imgUrl
    ? data.imgUrl
    : 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg';

  return (
    <SDetailLayout>
      <div className="container">
        <SDetailWrap>
          <div>
            <img alt="책 표지" src={cover} />
          </div>
          <SRightSide>
            <STopWrap>
              <div className="titleAndButton">
                <h1>{data.title}</h1>
                {isSameUser ? (
                  <div className="controlButtons">
                    <Link
                      to={
                        endpoint === 'requests'
                          ? `/reqEdit/${id}`
                          : `/shareEdit/${id}`
                      }
                    >
                      <span className="controlButton">수정</span>
                    </Link>
                    <span className="betweenButtons">|</span>
                    <span className="controlButton" onClick={handleDelete}>
                      삭제
                    </span>
                  </div>
                ) : null}
              </div>
              <SAuthorAndStatus>
                <div className="authorInfo">
                  <div className="author">
                    <img alt="profileImage" src={profile} />
                    <div>{data.displayName}</div>
                  </div>
                  <div className="views">
                    <Eye width="14px" height="14px" />
                    {data.view}
                  </div>
                  <div className="createdAt">{prettyDate(data.createdAt)}</div>
                </div>
                <div className={onlyInShare}>
                  {isSameUser ? (
                    <ToggleSwitch id={id} status={borrowWhthr(data)!} />
                  ) : (
                    <ShareStatus status={borrowWhthr(data)!} />
                  )}
                </div>
              </SAuthorAndStatus>
            </STopWrap>
            <SBookInfo>
              <h2>{data.bookTitle}</h2>
              <div>
                저자: <span>{data.author}</span>
              </div>
              <div>
                출판사: <span>{data.publisher}</span>
              </div>
              <SContact>
                <div>
                  {endpoint === 'requests'
                    ? '이 책을 갖고 계신가요?'
                    : '이 책을 찾고 계셨나요?'}
                </div>
                <button
                  onClick={() => {
                    window.open(data.talkUrl);
                  }}
                >
                  <KakaoFill width="16" height="16" />
                  오픈채팅으로 연락하기
                </button>
              </SContact>
            </SBookInfo>
            <p className="description">{data.content}</p>
          </SRightSide>
        </SDetailWrap>
      </div>
      <Comment endpoint={endpoint} comments={comments} id={id} />
    </SDetailLayout>
  );
};

export default DetailForm;

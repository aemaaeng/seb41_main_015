import styled from 'styled-components';
import instanceAxios from '../../util/InstanceAxios';
import { useState } from 'react';
import { prettyDate } from '../../util/dateparse';
import { Button } from './Button';
import {
  showNormalAlert,
  showWarningAlert,
  showSuccessAlert,
  showRequireLogin,
  showConfirmAlert,
} from './Alert';

const SCommentForm = styled.div`
  margin: 30px auto;
  padding: 0px 150px 0px 130px;
  max-width: 1280px;

  @media screen and (max-width: 1100px) {
    padding: 0px 24px;
  }
`;

const SCommentsInfo = styled.h2`
  font-size: 1.3rem;
`;

const SInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0px 40px 0px;
  .commentInput {
    width: 100%;
    height: 60px;
    border: 1px solid #aaaaaa;
    border-radius: 5px;
    padding-left: 10px;
  }
  button {
    margin-left: 20px;
  }
`;

const SCommentContainer = styled.div`
  color: #212529;
  padding-bottom: 24px;
`;

const SUserContainer = styled.div`
  display: flex;
  align-items: center;
  img {
    margin: 0px 10px 0px 5px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .userName {
    font-size: 16px;
    font-weight: 700;
    align-items: center;
  }
  .createdAt {
    color: #aaaaaa;
    font-size: 0.8rem;
    margin-left: auto;
    @media screen and (max-width: 527px) {
      display: none;
    }
  }
`;

const SUserComment = styled.div`
  .content {
    width: 100%;
    height: 45px;
    border: none;
    padding: 10px;
    overflow: hidden;
    resize: none;
    line-height: 1.6;
    font-size: 15px;
    background-color: #ffffff;
  }
  .tModify {
    width: 100%;
    height: 45px;
    padding: 10px;
    overflow: hidden;
    resize: none;
    line-height: 1.6;
    font-size: 15px;
    border: 1px solid #aaaaaa;
    outline-color: #aaaaaa;
  }
  .btnBox {
    margin: 10px;
    float: right;
    color: #aaaaaa;
    font-size: 13px;
  }
  button {
    color: #aaaaaa;
    border: none;
    padding: 0 5px;
    :hover {
      color: #bb2649;
    }
  }
`;

const SCommentWrap = styled.div`
  border-bottom: 1px solid #ececec;
  margin: 20px 0;
  padding-bottom: 10px;
`;

const Comment = ({ endpoint, comments, id }) => {
  const [content, setContent] = useState('');
  const [contentForm, setContentForm] = useState('');

  // 해당하는 유저에게만 댓글을 수정하고 삭제하는 권한주기
  const currentUser = sessionStorage.getItem('displayName');

  //수정 폼 글자수 제한 함수
  const handleChangeContent = (e) => {
    setContent(e.target.value);
    const text_length = e.target.value.length;
    if (text_length > 60) {
      showWarningAlert('글자 수 초과', '댓글은 60자 이상 작성할 수 없습니다.');
    }
  };

  //수정 폼 판별하기
  const handleClickModifyComment = (commentId, content) => {
    setContentForm(commentId);
    setContent(content);
  };

  //댓글 등록
  const handleSubmit = () => {
    //로그인 회원만 이용가능한 서비스
    const sessionAccessToken = sessionStorage.getItem('accessToken');

    if (!sessionAccessToken) {
      showRequireLogin();
      return;
    }
    if (!content) {
      showWarningAlert('내용을 입력하세요', '최소 1글자 이상 작성해야 합니다');
      return;
    }

    instanceAxios
      .post(`/v1/${endpoint}/comments/${id}`, {
        content,
      })
      .then((res) => {
        setContent(res.data.data.content);
        window.location.reload();
        showSuccessAlert('댓글 등록', '댓글이 정상적으로 등록되었습니다');
      })
      .catch((err) => {
        showWarningAlert('댓글 등록 실패', '댓글 등록에 실패했습니다');
        console.error(err);
      });
  };

  //댓글 수정
  const handleClickPatchComment = (commentId) => {
    if (content) {
      instanceAxios
        .patch(`/v1/${endpoint}/comments/${commentId}`, {
          content,
        })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          showWarningAlert('댓글 수정 실패', '댓글 수정에 실패했습니다');
        });
    } else {
      console.error('err');
      showWarningAlert('내용을 입력하세요', '최소 1글자 이상 작성해야 합니다');
    }
  };

  //댓글 삭제
  const handleClickDeleteComment = (commentId) => {
    showConfirmAlert({
      title: '작성을 취소하시겠습니까?',
      text: '작성 중인 내용은 저장되지 않습니다',
    }).then((res) => {
      if (res.isConfirmed) {
        instanceAxios
          .delete(`/v1/${endpoint}/comments/${commentId}`)
          .then(() => {
            window.location.reload();
            showNormalAlert('댓글이 정상적으로 삭제되었습니다.');
          })
          .catch(() => {
            showNormalAlert('댓글 삭제에 실패했습니다.');
          });
      }
    });
  };

  const handleClickCancelModify = () => {
    setContentForm('');
  };

  return (
    <SCommentForm>
      <SCommentsInfo>댓글 {comments.length}</SCommentsInfo>
      <SInputContainer>
        <input
          type="text"
          className="commentInput"
          placeholder="댓글을 남겨보세요"
          onChange={handleChangeContent}
        />
        <Button text="등록" onClick={handleSubmit} comment primary />
      </SInputContainer>
      <SCommentContainer>
        {comments.map((comment) => {
          const commentId =
            endpoint === 'borrows'
              ? comment.borrowCommentId
              : comment.requestCommentId;
          const isSameUser = comment.displayName === currentUser ? true : false;
          return (
            <SCommentWrap key={commentId}>
              <SUserContainer>
                <img
                  alt="profileImage"
                  src={
                    comment.imgUrl ||
                    'https://img.icons8.com/windows/32/null/user-male-circle.png'
                  }
                />
                <span className="userName">{comment.displayName}</span>
                <div className="createdAt">{prettyDate(comment.createdAt)}</div>
              </SUserContainer>
              <SUserComment>
                {contentForm === commentId ? (
                  //수정할 때
                  <div>
                    <input
                      className="tModify"
                      type="text"
                      placeholder="댓글을 입력하십시오"
                      defaultValue={comment.content || ''}
                      maxLength="60"
                      onChange={(e) => {
                        handleChangeContent(e);
                      }}
                    ></input>
                  </div>
                ) : (
                  //수정 안할때
                  <div>
                    <input
                      className="content"
                      value={comment.content || ''}
                      disabled
                    ></input>
                  </div>
                )}
                {/* 내가 쓴 댓글만 수정가능 */}
                {isSameUser && (
                  <div className="btnBox">
                    {contentForm === commentId ? (
                      <div>
                        <button
                          onClick={() => handleClickPatchComment(commentId)}
                        >
                          확인
                        </button>
                        <button onClick={handleClickCancelModify}>취소</button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() =>
                            handleClickModifyComment(commentId, comment.content)
                          }
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleClickDeleteComment(commentId)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </SUserComment>
            </SCommentWrap>
          );
        })}
      </SCommentContainer>
    </SCommentForm>
  );
};

export default Comment;

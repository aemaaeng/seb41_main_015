import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareForm from '../components/share/ShareForm';
import instanceAxios from '../util/InstanceAxios';
import { checkTalkUrl } from '../util/checkTalkUrl';
import {
  showRequireLogin,
  showWarningAlert,
  showSuccessAlert,
} from '../components/common/Alert';

const ShareAdd = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    bookTitle: '',
    author: '',
    publisher: '',
    talkUrl: '',
    title: '',
    content: '',
    thumbnail:
      'https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg',
  });

  const { bookTitle, author, publisher, talkUrl, title, content, thumbnail } =
    inputs;

  const handleClickSubmit = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      showRequireLogin();
      return;
    }

    if (!checkTalkUrl(talkUrl)) {
      showWarningAlert(
        '오픈채팅 링크를 확인해주세요',
        '링크에는 https:// 혹은 http://가 포함되어야 합니다.'
      );
      return;
    }

    instanceAxios
      .post('/v1/borrows', {
        bookTitle,
        author,
        publisher,
        talkUrl,
        title,
        content,
        thumbnail,
      })
      .then((res) => {
        showSuccessAlert(
          '나눔글 등록 완료',
          '나눔글이 정상적으로 등록되었습니다.'
        );
        navigate('/shareList');
      })
      .catch((err) => {
        showWarningAlert('나눔글 등록 실패', '나눔글 등록에 실패했습니다.');
      });
  };

  const handleBookInfoChange = (bookInfo) => {
    setInputs(bookInfo);
  };

  return (
    <>
      <ShareForm
        page="shareAdd"
        onClick={handleClickSubmit}
        inputs={inputs}
        onBookInfoChange={handleBookInfoChange}
      />
    </>
  );
};

export default ShareAdd;

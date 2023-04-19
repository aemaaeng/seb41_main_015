import ReqForm from '../components/request/ReqForm';
import { useState } from 'react';
import instanceAxios from '../util/InstanceAxios';
import { useNavigate } from 'react-router-dom';
import { checkTalkUrl } from '../util/checkTalkUrl';
import {
  showRequireLogin,
  showWarningAlert,
  showSuccessAlert,
} from '../components/common/Alert';

const ReqAdd = () => {
  const navigate = useNavigate();
  const defaultImg =
    'https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg';

  const [inputs, setInputs] = useState({
    bookTitle: '',
    author: '',
    publisher: '',
    talkUrl: '',
    title: '',
    content: '',
    thumbnail: defaultImg,
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
      .post('/v1/requests', {
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
          '요청글 등록 완료',
          '요청글이 정상적으로 등록되었습니다'
        );
        navigate('/reqList');
      })
      .catch((err) => {
        showWarningAlert('요청글 작성 실패', '글 등록에 실패했습니다');
      });
  };

  const handleBookInfoChange = (bookInfo) => {
    setInputs(bookInfo);
  };

  return (
    <ReqForm
      page="reqAdd"
      onClick={handleClickSubmit}
      inputs={inputs}
      onBookInfoChange={handleBookInfoChange}
    ></ReqForm>
  );
};
export default ReqAdd;

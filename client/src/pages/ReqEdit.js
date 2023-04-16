import ReqForm from '../components/request/ReqForm';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import instanceAxios from '../util/InstanceAxios';
import { showSuccessAlert, showWarningAlert } from '../components/common/Alert';

const ReqEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const defaultImg =
    ' https://dimg.donga.com/wps/NEWS/IMAGE/2011/11/17/41939226.1.jpg';

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
    instanceAxios
      .patch(`/v1/requests/${id}`, {
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
          '요청글 수정 완료',
          '요청글이 정상적으로 수정되었습니다.'
        );
        navigate('/ReqList');
      })
      .catch((err) => {
        showWarningAlert('요청글 수정 실패', '글 수정에 실패했습니다');
      });
  };

  useEffect(() => {
    const reqAddData = async () => {
      try {
        const result = await instanceAxios.get(`/v1/requests/${id}`);
        setInputs(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    reqAddData();
  }, []);

  const handleBookInfoChange = (bookInfo) => {
    setInputs(bookInfo);
  };

  return (
    <ReqForm
      page="ReqEdit"
      editBtn={handleClickSubmit}
      inputs={inputs}
      onBookInfoChange={handleBookInfoChange}
    />
  );
};
export default ReqEdit;

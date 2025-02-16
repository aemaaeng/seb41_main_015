import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShareForm from '../components/share/ShareForm';
import instanceAxios from '../util/InstanceAxios';
import { showSuccessAlert, showWarningAlert } from '../components/common/Alert';
import { BookInfo } from '../components/common/BookAddModal';
import { FormInput } from './ReqAdd';

const ShareEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState<FormInput>({
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

  const handleClickEdit = () => {
    instanceAxios
      .patch(`v1/borrows/${id}`, {
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
          '나눔글 수정 완료',
          '나눔글이 정상적으로 수정되었습니다'
        );
        navigate('/shareList');
      })
      .catch((err) => {
        showWarningAlert('나눔글 수정 실패', '나눔글 수정에 실패했습니다');
      });
  };

  useEffect(() => {
    const shareAddData = async () => {
      try {
        const result = await instanceAxios.get(`v1/borrows/${id}`);
        setInputs(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    shareAddData();
  }, []);

  const handleBookInfoChange = (bookInfo: BookInfo) => {
    setInputs({ ...inputs, ...bookInfo });
  };

  return (
    <>
      <ShareForm
        page="shareEdit"
        onClick={handleClickEdit}
        inputs={inputs}
        onBookInfoChange={handleBookInfoChange}
      />
    </>
  );
};

export default ShareEdit;

import { useState, useEffect } from 'react';
import axios from 'axios';
import DetailForm from '../components/common/DetailForm';
import Loading from '../components/common/Loading';
import { showFailedToFetch } from '../components/common/Alert';

const CommonDetail = ({ endpoint, id }) => {
  const [data, setData] = useState({});
  const [comment, setComment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`v1/${endpoint}/${id}`)
      .then((res) => {
        // 게시글 정보
        setData(res.data.data);
        setIsLoading(false);

        const comments =
          endpoint === 'borrows'
            ? res.data.data.borrowComments
            : res.data.data.requestComments;
        //댓글 최신순 정렬
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComment(comments);
      })
      .catch((err) => {
        showFailedToFetch();
        console.error(err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <DetailForm
          data={data}
          endpoint={endpoint}
          id={id}
          comments={comment}
        />
      )}
    </>
  );
};

export default CommonDetail;

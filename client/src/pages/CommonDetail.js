import { useState, useEffect } from 'react';
import axios from 'axios';
import DetailForm from '../components/common/DetailForm';
import Swal from 'sweetalert2';
import Loading from '../components/common/Loading';

const CommonDetail = ({ endpoint, id }) => {
  const [data, setData] = useState({});
  const [comment, setComment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = 'https://serverbookvillage.kro.kr/';

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(url + `v1/${endpoint}/${id}`)
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
        Swal.fire('데이터 로딩 실패', '데이터 로딩에 실패했습니다.', 'warning');
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

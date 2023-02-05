import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DetailForm from '../components/DetailForm';
import Swal from 'sweetalert2';
import Comment from '../components/Comment';

const CommonDetail = ({ endpoint }) => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [comment, setComment] = useState([]);
  const url = 'https://serverbookvillage.kro.kr/';

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(url + `v1/${endpoint}/${id}`)
      .then((res) => {
        // 게시글 정보
        setData(res.data.data);

        const comments =
          endpoint === 'borrows'
            ? res.data.data.borrowComments
            : res.data.data.requestComments;
        const sortComments = comments;
        //댓글 최신순 정렬
        sortComments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComment(sortComments);
      })
      .catch((err) => {
        Swal.fire('데이터 로딩 실패', '데이터 로딩에 실패했습니다.', 'warning');
        console.error(err);
      });
  }, []);

  return (
    <>
      <DetailForm data={data} page="request" id={id} />
      <Comment endpoint={endpoint} comments={comment} id={id} />
    </>
  );
};

export default CommonDetail;

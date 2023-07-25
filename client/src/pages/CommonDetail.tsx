import { useState, useEffect } from 'react';
import axios from 'axios';
import DetailForm from '../components/common/DetailForm';
import Loading from '../components/common/Loading';
import { showFailedToFetch } from '../components/common/Alert';
import { PostData } from '../components/common/DetailForm';
import { SingleComment } from '../components/common/Comment';

const createInitialData = (endpoint: string): PostData => {
  const generalData = {
    author: '',
    bookTitle: '',
    content: '',
    createdAt: '',
    displayName: '',
    imgUrl: '',
    modifiedAt: '',
    publisher: '',
    talkUrl: '',
    thumbnail: '',
    title: '',
    view: 0,
  };
  if (endpoint === 'borrows') {
    return {
      ...generalData,
      borrowId: 0,
      borrowComments: [],
      borrowWhthr: false,
    };
  } else if (endpoint === 'requests') {
    return {
      ...generalData,
      requestId: 0,
      requestComments: [],
    };
  } else {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }
};

const CommonDetail = ({ endpoint, id }: { endpoint: string; id: string }) => {
  const [data, setData] = useState<PostData>(createInitialData(endpoint));
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
        comments.sort(
          (a: SingleComment, b: SingleComment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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

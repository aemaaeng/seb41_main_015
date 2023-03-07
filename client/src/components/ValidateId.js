import { useLocation, useParams } from 'react-router-dom';
import NotFound from '../page/NotFound';
import CommonDetail from '../page/CommonDetail';

const ValidateId = () => {
  // id가 숫자인지 아닌지 검증하고 페이지로 넘어간다.
  const { pathname } = useLocation();
  const { id } = useParams();
  const articleId = id.match(/\d+/);
  const endpoint = pathname.split('/')[1];

  if (!articleId) {
    // NotFound 페이지로 돌려보낸다.
    return <NotFound />;
  }

  // shareDetail일 때와 reqDetail일 때 분기해주기
  if (endpoint === 'shareDetail') {
    return <CommonDetail endpoint="borrows" id={id} />;
  } else if (endpoint === 'reqDetail') {
    return <CommonDetail endpoint="requests" id={id} />;
  }
};

export default ValidateId;

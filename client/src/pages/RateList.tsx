import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import RateItems from '../components/rate/RateItems';
import { useNavigate } from 'react-router-dom';
import Paging from '../components/common/Paging';
import Loading from '../components/common/Loading';
import { RegisterButton } from '../components/common/Button';
import { RateBookInfo } from '../components/rate/RateModal';

const StyledRateList = styled.div`
  margin: 0 190px;
  @media screen and (max-width: 1360px) {
    margin: 0px 50px;
  }

  .rateHeader {
    height: 146px;
    color: #2c2c2c;
    padding: 18px;
    border-bottom: 1px solid #acacac;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      flex-direction: column;
      h2 {
        margin-bottom: 0;
        font-size: 22px;
      }
    }
    @media screen and (max-width: 555px) {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      height: 150px;
      p {
        display: none;
      }
    }
  }
`;

const RateList = () => {
  const [bookItems, setBookItems] = useState<RateBookInfo[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const PER_PAGE = 15;

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`v1/books?page=0&size=${PER_PAGE}&sort=createdAt%2Cdesc`)
      .then((res) => {
        setIsLoading(false);
        setBookItems(res.data.data);
        setCount(res.data.pageInfo.totalElements);
      })
      .catch((err) => {
        setCount(0);
        setBookItems([]);
        console.log(err);
      });
  }, []);

  const getDatabyPage = async (page: number) => {
    try {
      const res = await axios.get(
        `v1/books?page=${page - 1}&size=${PER_PAGE}&sort=createdAt%2Cdesc`
      );
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = async (page: number) => {
    setPage(page);
    const pageData = await getDatabyPage(page);
    setBookItems(pageData.data);
  };

  return (
    <StyledRateList>
      <div className="rateHeader">
        <div className="title">
          <h2>빌리지 사람들의 평점 목록입니다!</h2>
          <p>알고 있는 책에 자유롭게 평점을 매겨보세요!</p>
        </div>
        <RegisterButton
          text="책 등록하기"
          onClick={() => navigate('/rateAdd')}
          kind="rate"
          primary
        />
      </div>
      {isLoading ? <Loading /> : <RateItems data={bookItems} />}
      <Paging
        count={count}
        page={page}
        perPage={PER_PAGE}
        handlePageChange={handlePageChange}
      />
    </StyledRateList>
  );
};

export default RateList;

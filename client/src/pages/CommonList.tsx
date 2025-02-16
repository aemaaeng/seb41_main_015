import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ListHigh from '../components/common/ListHigh';
import BookList from '../components/common/BookList';
import Paging from '../components/common/Paging';
import Loading from '../components/common/Loading';
import { showFailedToFetch } from '../components/common/Alert';

interface ListProps {
  headTitle: string;
  endpoint: string;
  route: string;
}

const SListContainer = styled.div`
  margin: 0px 190px;
  @media screen and (max-width: 1360px) {
    margin: 0px 50px;
  }
`;

const CommonList = (props: ListProps) => {
  const { headTitle, endpoint, route } = props;
  const { pathname } = useLocation();

  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 한 페이지에 들어갈 데이터 (페이지가 바뀔 때마다 get으로 받아옴)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  // 총 데이터 개수
  const [count, setCount] = useState(0);
  const PER_PAGE = 10;

  useEffect(() => {
    // 상태 초기화
    setTitle(headTitle);
    setPage(1);
    setIsSearchMode(false);
    setItems([]);
    setIsLoading(true);

    // 첫 페이지 데이터 불러오기
    axios
      .get(`v1/${endpoint}?page=0&size=${PER_PAGE}&sort=createdAt%2Cdesc`)
      .then((res) => {
        setItems(res.data.data);
        setCount(res.data.pageInfo.totalElements);
        setIsLoading(false);
      })
      .catch((err) => {
        setItems([]);
        setCount(0);
        setIsLoading(false);
        console.log(err);
        showFailedToFetch();
      });
  }, [pathname]);

  const getDatabyPage = async (page: number) => {
    try {
      const res = await axios.get(
        `v1/${endpoint}?page=${page - 1}&size=${PER_PAGE}&sort=createdAt%2Cdesc`
      );
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const getSearchDatabyPage = async (
    keyword: string,
    type: string,
    page: number
  ) => {
    try {
      const res = await axios.get(
        `v1/${endpoint}/search?field=${type}&keyword=${keyword}&page=${
          page - 1
        }&size=${PER_PAGE}&sort=createdAt%2Cdesc`
      );
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = async (page: number) => {
    setPage(page);
    if (!isSearchMode) {
      const pageData = await getDatabyPage(page);
      setItems(pageData.data);
    } else {
      const pageData = await getSearchDatabyPage(keyword, type, page);
      setItems(pageData.data);
    }

    window.scrollTo(0, 0);
  };

  const handleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 드롭다운 이벤트
  const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing === true) return;

    if (e.key === 'Enter') {
      // 검색어가 공백으로만 이루어진 경우
      if (keyword.replace(/^\s+|\s+$/gm, '').length === 0) {
        alert('검색어를 입력해주세요.');
        setKeyword('');
        return;
      }

      // type이 없고 검색어도 없을 땐 아무것도 하지 않기
      if (!type && !keyword) return;

      // 둘 중 하나라도 입력한 경우에는 경고창 띄우기
      if (type && !keyword) {
        alert('검색어를 입력해주세요.');
        return;
      }
      if (!type && keyword) {
        alert('검색어 종류를 선택해주세요.');
        return;
      }

      setTitle(`'${keyword}'에 대한 검색 결과입니다.`);

      axios
        .get(
          `v1/${endpoint}/search?field=${type}&keyword=${keyword}&page=0&size=${PER_PAGE}&sort=createdAt%2Cdesc`
        )
        .then((res) => {
          setIsSearchMode(true);
          setItems(res.data.data);
          setCount(res.data.pageInfo.totalElements);
          setPage(1);
        })
        .catch((err) => {
          showFailedToFetch();
          console.error(err);
        });
    }
  };

  return (
    <>
      <SListContainer>
        <ListHigh
          title={title}
          route={route}
          keyword={keyword}
          handleKeyword={handleKeyword}
          handleSearch={handleSearch}
          handleOption={handleOption}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <BookList data={items} route={route} />
            <Paging
              page={page}
              count={count}
              perPage={PER_PAGE}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </SListContainer>
    </>
  );
};

export default CommonList;

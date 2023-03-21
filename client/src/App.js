import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CommonList from './pages/CommonList';
import Header from './components/common/Header';
import ShareAdd from './pages/ShareAdd';
import ShareEdit from './pages/ShareEdit';
import ReqAdd from './pages/ReqAdd';
import ReqEdit from './pages/ReqEdit';
import MyPage from './pages/MyPage';
import MyPageEdit from './pages/MyPageEdit';
import Callback from './pages/Callback';
import RateList from './pages/RateList';
import RateAdd from './pages/RateAdd';
import RateDetail from './pages/RateDetail';
import Footer from './components/common/Footer';
import NotFound from './pages/NotFound';
import ValidateId from './components/common/ValidateId';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/shareList"
          element={
            <CommonList
              headTitle="현재 빌리지에 올라온 목록입니다!"
              endpoint="borrows"
              route="share"
            />
          }
        />
        <Route path="/shareAdd" element={<ShareAdd />} />
        <Route path="/shareEdit/:id" element={<ShareEdit />} />
        <Route path="/shareDetail/:id" element={<ValidateId />} />
        <Route
          path="/reqList"
          element={
            <CommonList
              headTitle="빌리지 사람들이 찾고 있는 책이에요!"
              endpoint="requests"
              route="request"
            />
          }
        />
        <Route path="/reqAdd" element={<ReqAdd />} />
        <Route path="/reqEdit/:id" element={<ReqEdit />} />
        <Route path="/reqDetail/:id" element={<ValidateId />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypageEdit" element={<MyPageEdit />} />
        <Route path="/rateList" element={<RateList />} />
        <Route path="/rateAdd" element={<RateAdd />} />
        <Route path="/rateDetail/:id" element={<RateDetail />} />
        <Route path="/oauth" element={<Callback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

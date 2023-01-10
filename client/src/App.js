import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import CommonLayout from './page/CommonLayout';
import Header from './components/Header';
import Login from './page/Login';
import ShareList from './page/ShareList';
import ShareAdd from './page/ShareAdd';
import ShareEdit from './page/ShareEdit';
import ShareDetail from './page/ShareDetail';
import ReqList from './page/ReqList';
import ReqAdd from './page/ReqAdd';
import ReqEdit from './page/ReqEdit';
import ReqDetail from './page/ReqDetail';
import MyPage from './page/MyPage';
import MyPageEdit from './page/MyPageEdit';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 푸터가 들어가는 부분 */}
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<Home />} />
          <Route path="/shareList" element={<ShareList />} />
          <Route path="/shareAdd" element={<ShareAdd />} />
          <Route path="/shareEdit" element={<ShareEdit />} />
          <Route path="/shareDetail" element={<ShareDetail />} />
          <Route path="/reqList" element={<ReqList />} />
          <Route path="/reqAdd" element={<ReqAdd />} />
          <Route path="/reqEdit" element={<ReqEdit />} />
          <Route path="/reqDetail" element={<ReqDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypageEdit" element={<MyPageEdit />} />
        </Route>
        {/* 푸터 필요없는 부분 */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

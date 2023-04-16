import Swal from 'sweetalert2';

export const showNormalAlert = (message) => {
  Swal.fire(message);
};

export const showWarningAlert = (title, message) => {
  Swal.fire(title, message, 'warning');
};

export const showSuccessAlert = (title, message) => {
  Swal.fire(title, message, 'success');
};

export const showFailedToFetch = () => {
  Swal.fire('데이터 로딩 실패', '데이터 로딩에 실패했습니다.', 'warning');
};

export const showRequireLogin = () => {
  Swal.fire(
    '로그인이 필요한 서비스입니다',
    '로그인 후 이용해주세요',
    'warning'
  );
};

export const showConfirmAlert = (options) => {
  return Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#bb2649',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    ...options,
  });
};

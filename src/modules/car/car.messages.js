export const CAR_MESSAGES = {
  EXISTING_CAR_NAME: "Tên xe này đã tồn tại trong hệ thống!",
  EXISTING_CAR_LICENSE: "Biển số xe này đã tồn tại trong hệ thống!",
  CREATE_SUCCESS: "Thêm mới xe thành công!",
  UPDATE_SUCCESS: "Cập nhật lại xe thành công!",
  NOT_FOUND: "Không tìm thấy xe hiện tại!",
  ACTIVATED: (unlockScheduleSuccess, unlockScheduleFailed) =>
    `Xe đã được kích hoạt, mở khoá lại thành công ${unlockScheduleSuccess} thất bại ${unlockScheduleFailed} lịch chạy!`,
  DEACTIVATED:
    "Xe đã bị vô hiệu hóa, các lịch chạy chưa bị khoá hiện không thể hoạt động!",
};

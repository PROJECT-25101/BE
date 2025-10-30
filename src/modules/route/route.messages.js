export const ROUTE_MESSAGES = {
  EXISTING_NAME: "Tên của tuyến đường này đã tồn tại trong hệ thống!",
  EXISTING_ROUTE: (pickupPoint, dropPoint) => {
    return `Tuyến đường từ ${pickupPoint} đến ${dropPoint} đã tồn tại trong hệ thống!`;
  },
  CREATED_ROUTE: "Tạo tuyến đường thành công!",
  UPDATED_ROUTE: "Cập nhật tuyến đường thành công!",
  NOT_FOUND_ROUTE: "Không tìm thấy tuyến đường!",
  ACTIVATED:
    "Tuyến đường đã được hoạt động trở lại các lịch chạy sẽ hoạt động lại!",
  DEACTIVATED:
    "Tuyến đường đã bị khoá các lịch chạy tuyến đường này sẽ bị khoá!",
  DUPLICATE_PICK_DROP: "Điểm xuất phát và điểm kết thúc phải khác nhau!",
};

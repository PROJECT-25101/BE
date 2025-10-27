export const SEAT_MESSAGES = {
  CREATED: "Tạo ghế thành công!",
  NOT_FOUND: "Không tìm thấy ghế hiện tại!",
  ACTIVATED: "Ghế đã được mở lại và đã sẵn sàng hoạt động!",
  DEACTIVATED: "Ghế đã bị vô hiệu hoá, hiện không thể hoạt động!",
  QUANTITY_INVALID: "Số lượng ghế không hợp lệ!",
  COLUMNS_INVALID: "Sô lượng cột không hợp lệ!",
  ID_REQUIRED: "Cần có Id của xe để tạo ghế!",
  SEATLABEL_EXIST: "Tên ghế này đã tồn tại trên xe này!",
  SEATORDER_EXIST: "Đã có ghế nằm ở trên vị trí này!",
  NOTFOUND_DELETE: "Ghế đã bị xoá hoặc không tồn tài",
  DELETED_SEAT: "Xoá ghế thành công!",
  DELETED_FLOOR: (count) => {
    return `Xoá thành công ${count} ghế!`;
  },
  DELETED_FAIL_FLOOR: `Xoá tầng thất bại!`,
  DEACTIVE_FLOOR: "Khoá toàn bộ ghế ở tầng thành công!",
  ACTIVE_FLOOR: "Mở khoá toàn bộ ghế ở tầng thành công!",
  OUTMAXQUANTITY_SEAT: "Không được phép vượt qua 30 ghế 1 tầng!",
};

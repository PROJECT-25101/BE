export const SCHEDULE_MESSAGES = {
  NOT_FOUND_SCHEDULE: "Không tìm thấy lịch chạy tương ứng!",
  // CONFLICT_SCHEDULE: (conflict) => {
  //   return `Có một lịch chạy đang hoạt động bị xung đột thời gian với cái bạn định tạo!
  //   thông tin lịch chạy xung đôt : ${conflict}
  //   `;
  // },
  CONFLICT_SCHEDULE: `Lịch chạy này xung đột với lịch bạn định tạo!`,
  CREATED_SCHEDULE: "Lịch chạy đã được tạo thành công!",
  UPDATED_SCHEDULE: "Lịch chạy đã được cập nhật thành công!",
  ACTIVATED: "Lịch chạy này đã hoạt động trở lại!",
  DEACTIVATED: "Lịch chạy này đã bị khóa!",
  CAR_NOT_AVAILABLE: "Chiếc xe phụ trách lịch chạy này đang không hoạt động!",
  ROUTE_NOT_AVAILABLE:
    "tuyến đường tương ứng với lịch chạy này đang không khả dụng!",
  DISABLE_BY_HANDLE: "Lịch chạy đã bị khoá trước đó",
  CREATE_MANY_SCHEDULE: (createdLength) =>
    `Tạo thành công ${createdLength} lịch chạy!`,
  CREATE_MANY_ERROR_SCHEDULE: (totalLength, failedLength) =>
    `Tạo lịch chạy thất bại do có ${failedLength} lịch chạy tạo thất bại trong tổng số ${totalLength} lịch chạy`,
};

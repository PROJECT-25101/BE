export default (socket, io) => {
  socket.on("joinSchedule", (scheduleId) => {
    socket.join(scheduleId);
    console.log(`${socket.id} joined ${scheduleId}`);
  });
  socket.on("leaveSchedule", (scheduleId) => {
    console.log(`${socket.id} leave ${scheduleId}`);
    socket.leave(scheduleId);
  });
};

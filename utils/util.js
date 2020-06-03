const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const getImgs = function (ids) {
  let arrId = (ids + "").split(",");
  return tt.getStorageSync('all_img').filter(it => ~arrId.indexOf(it.img_id + "")).map(it => it.imgUrl);
};

const getImgsdir = function (ids, all_img) {
  let arrId = (ids + "").split(",");
  return all_img.filter(it => ~arrId.indexOf(it.img_id + "")).map(it => it.imgUrl);
};

const getIdsdir = function (urls, all_img) {
  return all_img.filter(it => ~urls.indexOf(it.imgUrl)).map(it => it.img_id);
};

const getIds = function (urls) {
  return tt.getStorageSync('all_img').filter(it => ~urls.indexOf(it.imgUrl)).map(it => it.img_id);
};

const flashCollect = function (urls) {};

module.exports = {
  formatTime: formatTime,
  getImgs: getImgs,
  getIds: getIds,
  getImgsdir: getImgsdir,
  getIdsdir: getIdsdir
};
export const checkTalkUrl = (url) => {
  const startsWithHttp = new RegExp(/^https?:\/\//);
  if (url.match(startsWithHttp)) return true;
  return false;
};

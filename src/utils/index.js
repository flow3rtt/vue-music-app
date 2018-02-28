export const formatSinger = singer => {
  return _.map(singer, singer => singer.name).join('/');
};


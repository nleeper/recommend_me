exports.common = {
  version: '1.0',
  port: 5000,
  app_secret: 'recommend_me-2014',
  static_dir: 'public',
  dice: {
    size: 10,
    base_url: 'https://api.dice.com',
    api_key: '7fcba57524d913314bda16a2ca28fb8e85d90d9b736ac8ca1f2d37d6c4d6eda266102ae24ad43da80c57e13504e60a4d9cab83b1b68379f22ca3b73569729882'
  },
  firebase: {
    url: 'https://recommend-me.firebaseio.com/'
  }
};

exports.staging = {

};

exports.production = {

};
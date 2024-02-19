import _ from "@lodash";
import mockApi from "../books-api.json";
import mock from "../mock";

const booksDB = mockApi.value;

mock.onPost("/api/books").reply((config) => {
  const requestData = JSON.parse(config.data);
  const { pageSize, page, writerValue, booksName, isbnNumber, publisherValue } =
    requestData;

  // Sayfa boyutu ve sayfa numarasına göre belirli bir aralıktaki öğrenci verilerini seç
  let paginatedData = booksDB.filter(
    (_, index) => index >= page * pageSize && index < (page + 1) * pageSize
  );

  if (booksName || writerValue || isbnNumber || publisherValue) {
    paginatedData = booksDB.filter((item) => {
      let name = booksName ? item.adi.toLowerCase().includes(booksName) : true;
      let isbnNo = isbnNumber ? item.isbnno.includes(isbnNumber) : true;
      let writer = writerValue ? item.yazar.toLowerCase().includes(writerValue.toLowerCase()) : true;
      let publisher = publisherValue
        ? item.yayinevi.toLowerCase().includes(publisherValue.toLowerCase())
        : true;

      if (name && isbnNo && writer && publisher) {
        return item;
      }
    });
  }
  return [200, { data: paginatedData, count: booksDB.length }];
});

mock.onPost("/api/books/writers").reply((config) => {
  const data = booksDB;
  const writer = Array.from(new Set(data.map((item) => item.yazar)));

  return [200, { writer }];
});

mock.onPost("/api/books/bookName").reply((config) => {
  const data = booksDB;
  const bookName = Array.from(new Set(data.map((item) => item.adi)));
  const books = Array.from(new Set(data.map((item) => item)));

  return [200, { bookName : bookName, data : books }];
});

mock.onPost("/api/books/publisher").reply((config) => {
  const data = booksDB;
  const publisher = Array.from(new Set(data.map((item) => item.yayinevi)));

  return [200, { publisher }];
});

mock.onPost("/api/books/addBooks").reply((config) => {
  const {
    addBooksName,
    addBooksPicture,
    addBooksIsbnNo,
    addBooksNo,
    addBooksWriter,
    addBooksPublisher,
  } = JSON.parse(config.data);

  // Yeni kitap objesini oluştur
  const newBooks = {
    id: booksDB.length + 1, // kitap benzersiz bir ID atayın
    adi: addBooksName,
    resim: addBooksPicture,
    isbnno: addBooksIsbnNo,
    barkodno: addBooksNo,
    yazar: addBooksWriter,
    yayinevi: addBooksPublisher,
  };
  console.log("NEW Data :" ,config.data)
  booksDB.push(newBooks);

  return [200, { data: newBooks }];
});

mock.onGet(/\/api\/books\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/books\/(?<id>[^/]+)/).groups;
  return [200, _.find(booksDB, { id })];
});

mock.onPut(/\/api\/books\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/books\/(?<id>[^/]+)/).groups;

  _.assign(_.find(booksDB, { id }), JSON.parse(data));

  return [200, JSON.parse(data)];
});

mock.onDelete(/\/api\/books\/[^/]+/).reply((config) => {
  const { id } = config.url.match(
    /\/api\/books\/(?<id>[^/]+)/
  ).groups;

  _.remove(booksDB, { id });

  return [200, id];
});
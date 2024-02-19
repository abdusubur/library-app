import _ from "@lodash";
import transactionApi from "../transaction-api.json";
import studentsApi from "../student-api.json";
import booksApi from "../books-api.json";
import mock from "../mock";

const studentsDB = studentsApi.value;
const booksDB = booksApi.value;
const transactionDB = transactionApi.value;
const transactionDurumDB = transactionApi.durumlar;

mock.onPost("/api/studentByNumbers").reply((config) => {
  const studentNumber = JSON.parse(config.data);
  const newNumber = studentNumber.studentNumber;
  console.log("Student Number :", studentNumber.studentNumber);
  // Sayfa boyutu ve sayfa numarasına göre belirli bir aralıktaki öğrenci verilerini seç
  let studentById = [];
  if (newNumber) {
    studentById = _.find(studentsDB, (item) => {
      // item.ogrNo içinde newNumber'ı ara
      return _.includes(item.ogrNo, newNumber);
    });
  }
  // if (studentById) {
  //   studentById.books = _.find(booksDB, (book) => {
  //     // Öğrenci kitaplarını bulmak için kId ve id eşleşmesini kontrol et
  //     return book.id === studentById.kId;
  //   });
  //   console.log("Veriler :", studentById);
  // }

  return [200, studentById];
});

mock.onPost("/api/studentTransaction").reply((config) => {
  const requestData = JSON.parse(config.data);
  const { pageSize, page, booksName, studentName, studentNumber } =
    requestData;
  
  // Sayfa boyutu ve sayfa numarasına göre belirli bir aralıktaki öğrenci verilerini seç
  let paginatedData = transactionDB.filter(
    (_, index) => index >= page * pageSize && index < (page + 1) * pageSize
  );

  if (booksName || studentName || studentNumber) {

    paginatedData = transactionDB.filter((item) => {
      let kitap = booksName
        ? item.kitapAdi.toLowerCase().includes(booksName.toLowerCase())
        : true;
      let isim = studentName
        ? item.adSoyadi.toLowerCase().includes(studentName)
        : true;
      let no = studentNumber ? item.ogrNo.includes(studentNumber) : true;

      if(isim && no && kitap) {
          return item;
      }
    });
  }
  return [200, { data: paginatedData, count: transactionDB.length }];
});

mock.onPost("/api/bookByName").reply((config) => {
  const bookName = JSON.parse(config.data);
  const data = bookName.bookName;
  console.log("Student Number :", bookName.bookName);
  // Sayfa boyutu ve sayfa numarasına göre belirli bir aralıktaki öğrenci verilerini seç
  let bookByName = [];
  if (data) {
    bookByName = _.find(booksDB, (item) => {
      // item.ogrNo içinde newNumber'ı ara
      return _.includes(item.adi, data);
    });
  }

  return [200, bookByName];
});

mock.onPost("/api/students/addStudentBook").reply((config) => {
  const addStudentBook = JSON.parse(config.data);
  const newData = addStudentBook.data;

  const currentDate = new Date(); // Şu anki tarih ve saat

  const startDate = new Date(newData.startDate);
  const endDate = new Date(newData.endDate);

  let status;

  if (currentDate >= startDate && currentDate <= endDate) {
    status = "Devam Ediyor";
  } else {
    status = "Getirmedi";
  }

  console.log("Durum:", startDate);

  // Yeni öğrenci objesini oluştur
  const newStudentBook = {
    id: studentsDB.length + 1,
    ogrNo: newData.addStudentNumber,
    adSoyadi: newData.addStudentName,
    sinifi: newData.addClasses,
    kitapAdi: newData.addBookName,
    start: newData.startDate,
    end: newData.endDate,
    durumu: status,
  };

  // Yeni öğrenciyi studentsDB'ye ekleyin
  transactionDB.push(newStudentBook);
  console.log("AddStudent BOok :", newStudentBook);

  return [200, { data: newStudentBook }];
});


mock.onGet(/\/api\/transaction\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/transaction\/(?<id>[^/]+)/).groups;
  return [200, _.find(transactionDB, { id })];
});

mock.onPut(/\/api\/transaction\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/transaction\/(?<id>[^/]+)/).groups;

  _.assign(_.find(transactionDB, { id }), JSON.parse(data));

  return [200, JSON.parse(data)];
});

mock.onDelete(/\/api\/transaction\/[^/]+/).reply((config) => {
  const { id } = config.url.match(
    /\/api\/transaction\/(?<id>[^/]+)/
  ).groups;

  _.remove(transactionDB, { id });

  return [200, id];
});

mock.onPost("/api/transaction/durumu").reply((config) => {
  const data = transactionDurumDB;
  const durumu = Array.from(new Set(data.map((item) => item.durum)));
  const icon = Array.from(new Set(data.map((item) => item.icon)));

  return [200, { durumu,icon }];
});
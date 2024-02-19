import _ from "@lodash";
import mockApi from "../student-api.json";
import mock from "../mock";

const studentsDB = mockApi.value;

mock.onPost("/api/students").reply((config) => {
  const requestData = JSON.parse(config.data);
  const { pageSize, page, classValue, studentName, studentNumber } =
    requestData;
  
  // Sayfa boyutu ve sayfa numarasına göre belirli bir aralıktaki öğrenci verilerini seç
  let paginatedData = studentsDB.filter(
    (_, index) => index >= page * pageSize && index < (page + 1) * pageSize
  );

  if (classValue || studentName || studentNumber) {

    paginatedData = studentsDB.filter((item) => {
      let sinif = classValue
        ? item.sinifi.toLowerCase().includes(classValue.toLowerCase())
        : true;
      let isim = studentName
        ? item.adSoyadi.toLowerCase().includes(studentName)
        : true;
      let no = studentNumber ? item.ogrNo.includes(studentNumber) : true;

      if(isim && no && sinif) {
          return item;
      }
    });
  }
  return [200, { data: paginatedData, count: studentsDB.length }];
});

mock.onPost("/api/students/classes").reply((config) => {
  const data = studentsDB;
  const uniqueSiniflar = Array.from(new Set(data.map((item) => item.sinifi)));

  return [200, { uniqueSiniflar }];
});

mock.onPost("/api/students/addStudent").reply((config) => {
  const { AddStudentName, AddStudentNumber, AddClasses } = JSON.parse(
    config.data
  );

  // Yeni öğrenci objesini oluştur
  const newStudent = {
    id: studentsDB.length + 1, // Öğrenciye benzersiz bir ID atayın
    ogrNo: AddStudentNumber,
    adSoyadi: AddStudentName,
    sinifi: AddClasses,
  };

  // Yeni öğrenciyi studentsDB'ye ekleyin
  studentsDB.push(newStudent);

  return [200, { data: newStudent }];
});

mock.onGet(/\/api\/student\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/student\/(?<id>[^/]+)/).groups;
  return [200, _.find(studentsDB, { id })];
});

mock.onPut(/\/api\/student\/[^/]+/).reply(({ url, data }) => {
  const { id } = url.match(/\/api\/student\/(?<id>[^/]+)/).groups;

  _.assign(_.find(studentsDB, { id }), JSON.parse(data));

  return [200, JSON.parse(data)];
});

mock.onDelete(/\/api\/student\/[^/]+/).reply((config) => {
  const { id } = config.url.match(
    /\/api\/student\/(?<id>[^/]+)/
  ).groups;

  _.remove(studentsDB, { id });

  return [200, id];
});
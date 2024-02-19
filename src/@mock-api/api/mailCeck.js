
import mock from "../mock";


const mailler = ["admin@fusetheme.com", "admin2@fusetheme.com"];
mock.onPost("api/auth/mailCheck").reply(async (config) => {
  const data = JSON.parse(config.data);
  const { email } = data;
  console.log("email: ", email)

  
if(mailler.includes(email)) {
  return[200, { islem: "mail_var"}];
}
else {
  return[200, {islem: "mail_yok"}];
}

});


const cardlar =["4824098224429923","4824650248180448"]
mock.onPost("api/auth/cardCheck").reply(async (config) => {
  const data = JSON.parse(config.data);
  const { card } = data;
  console.log("card: ", card)

  
if(cardlar.includes(card)) {
  return[200, { islem: "card_var"}];
}
else {
  return[200, {islem: "card_yok"}];
}

});

